import React from 'react';

// libs
import { LWeb3 } from '../Libs/LWeb3';

// components
import TokenIcon from './TokenIcon';
import { Text } from './Text';
import Group from './Group';
import Input from './Input';
import ButtonAddToken from './ButtonAddToken';

// css
// import './InputTokenAmountConverted.css';

class InputTokenAmountConverted extends React.Component {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      updateRevision: 0,
      id: props.id || 'dialog_tokenInputConverted',
      onChange: props.onChange || null,
      token: props.token,
      tokenConvert: props.tokenConvert || window.chef.stableToken,
      showIcon: props.showIcon && true,
    };

    this.checkUpdate_token = this.checkUpdate_token.bind(this);
    this.ref_input = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('token_priceInfo', this.checkUpdate_token);
  }

  componentWillUnmount() {
    document.removeEventListener('token_priceInfo', this.checkUpdate_token);
  }

  onChange(_e) {
    const { onChange } = this.state;
    this.update();
    if (onChange) {
      onChange(_e);
    }
  }

  getAsUint256() {
    const v = LWeb3.tokensToUint256String(this.ref_input.current.getValue());
    const val = window.chef.web3_data.eth.abi.encodeParameter('uint256', v);

    return val;
  }

  convertTokenAmount = (_tokenFrom, _tokenTo, _amount) => {
    // tokenFrom
    const tokenFrom_liquidityValue = window.chef.toBN(
      _tokenFrom.liquidityValue
    );
    const tokenFrom_liquidityAmount = window.chef.toBN(
      _tokenFrom.liquidityAmount
    );

    // tokenTo
    const tokenTo_liquidityValue = window.chef.toBN(_tokenTo.liquidityValue);
    const tokenTo_liquidityAmount = window.chef.toBN(_tokenTo.liquidityAmount);

    // convert over stable
    const amount = window.chef.toBN(_amount || '0');
    const priceFromAmount = tokenFrom_liquidityValue
      .mul(amount)
      .div(tokenFrom_liquidityAmount);
    const convertedTo = tokenTo_liquidityAmount
      .mul(priceFromAmount)
      .div(tokenTo_liquidityValue);
    const convertedStr = convertedTo.toString(10);

    return convertedStr;
  };

  update() {
    const { updateRevision } = this.state;
    // eslint-disable-next-line react/destructuring-assignment
    this.setState({ updateRevision: updateRevision + 1 });
  }

  checkUpdate_token(_data) {
    const { token } = this.state;
    if (LWeb3.checkEqualAddress(_data.detail.address, token.address)) {
      this.update();
    }
  }

  render() {
    const classes = ['InputTokenAmountConverted'];
    const { token, tokenConvert, showIcon, id } = this.state;
    const { label } = this.props;
    // converted
    const val = this.ref_input?.current?.getValue();
    const convertedAmount = this.convertTokenAmount(
      token,
      tokenConvert || window.chef.stableToken,
      LWeb3.tokensToUint256String(val || '0')
    );
    const converted = (
      <Group className="converted">
        {LWeb3.smartFormatTokens(convertedAmount, tokenConvert, true)}{' '}
        {tokenConvert.symbol}
      </Group>
    );

    // name
    let name = token.symbol;
    if (token.token0 !== null) {
      name = 'LP';
    }

    // label
    let calculatedLabel = null;
    if (label) {
      calculatedLabel = (
        <Text size="1" className="Label">
          {label}
        </Text>
      );
    }

    // icon
    let icon = null;
    if (showIcon) {
      icon = <TokenIcon token={token} height="60" width="60" />;
      classes.push('Icon');
    }

    let size = 0;
    if (name.length > 4) {
      size = -1;
    }
    if (name.length > 8) {
      size = -3;
    }
    return (
      <Group className={classes.join(' ')}>
        <Group>
          {converted}
          <Group className="inputContainer">
            <Group className="LabelContainer">{calculatedLabel}</Group>
            {icon}
            <Input
              id={id}
              ref={this.ref_input}
              onChange={(_e) => this.onChange(_e)}
              type="number"
              min="0"
              placeholder="0"
            />
            <Group className="info">
              <Text size={size}>{name}</Text>
            </Group>
          </Group>
          <Group className="AddButton">
            <ButtonAddToken token={token} mode="text" />
          </Group>
        </Group>
      </Group>
    );
  }
}

export default InputTokenAmountConverted;
