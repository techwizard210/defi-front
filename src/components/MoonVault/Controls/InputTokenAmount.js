import React from 'react';

// libs
import { LWeb3 } from '../Libs/LWeb3';

// components
import TokenIcon from './TokenIcon';
import { Text } from './Text';
import Button from './Button';
import Group from './Group';
import Input from './Input';
import ButtonAddToken from './ButtonAddToken';

// css
// import './InputTokenAmount.css';

class InputTokenAmount extends React.Component {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      id: props.id || 'dialog_tokenInput',
      onChange: props.onChange || null,
      onChangeToken: props.onChangeToken || null,
      token: props.token,
      max: props.max,
      showIcon: props.showIcon && true,
    };

    this.checkUpdate_app = this.checkUpdate_app.bind(this);
    this.checkUpdate_token = this.checkUpdate_token.bind(this);
    this.ref_input = React.createRef();

    this.vaultinator3000 = props.vaultinator3000;
  }

  componentDidMount() {
    document.addEventListener('app_reload', this.checkUpdate_app);
    document.addEventListener('token_userInfo', this.checkUpdate_token);
  }

  componentWillUnmount() {
    document.removeEventListener('app_reload', this.checkUpdate_app);
    document.removeEventListener('token_userInfo', this.checkUpdate_token);
  }

  onClick_max() {
    const { max, token, onChange } = this.state;
    this.ref_input.current.setValue(
      LWeb3.fullFormatTokens(
        max,
        token || this.vaultinator3000.wrappedCoin,
        true
      )
    );
    if (onChange) {
      onChange();
    }
  }

  getAsUint256() {
    const v = LWeb3.tokensToUint256String(this.ref_input.current.getValue());
    const val = this.vaultinator3000.web3_data.eth.abi.encodeParameter(
      'uint256',
      v
    );

    return val;
  }

  checkUpdate_app() {
    // eslint-disable-next-line react/destructuring-assignment
    if (!this.state.token) {
      this.setState({ max: this.vaultinator3000.userCoinBalance });
    }
  }

  checkUpdate_token(_data) {
    const { token, onChangeToken } = this.state;
    if (LWeb3.checkEqualAddress(_data.detail.address, token?.address)) {
      if (onChangeToken) {
        this.setState({ max: onChangeToken() });
      } else {
        this.setState({ max: token.userBalance });
      }
    }
  }

  render() {
    const classes = ['InputTokenAmount'];
    const { balanceLabel, label } = this.props;
    const { max, token, showIcon, onChange, id } = this.state;
    // available
    const calculatedBalanceLabel = balanceLabel || 'Balance';
    const available = (
      <Group className="available">
        {calculatedBalanceLabel}:{' '}
        {LWeb3.smartFormatTokensDisplay(
          max,
          token || this.vaultinator3000.wrappedCoin,
          true
        )}
      </Group>
    );

    // name
    let name = token?.symbol || this.vaultinator3000.currentChain?.coin || '';
    if (token && token.token0 !== null) {
      name = 'LP';
    }

    // label
    let calculatedLabel = <></>;
    if (label) {
      calculatedLabel = (
        <Text size="1" className="Label">
          {label}
        </Text>
      );
    }

    // icon
    let icon = <></>;
    if (showIcon) {
      icon = (
        <TokenIcon
          token={token}
          height="60"
          width="60"
          vaultinator3000={this.vaultinator3000}
        />
      );
      classes.push('Icon');
    }

    // add token
    let addToken = <></>;
    if (token) {
      addToken = (
        <ButtonAddToken
          token={token}
          mode="text"
          vaultinator3000={this.vaultinator3000}
        />
      );
    }

    return (
      <Group className={classes.join(' ')}>
        <Group>
          {available}
          <Group className="inputContainer">
            <Group className="LabelContainer">{calculatedLabel}</Group>
            {icon}
            <Input
              id={id}
              ref={this.ref_input}
              onChange={onChange}
              type="number"
              min="0"
              placeholder="0"
            />
            <Group className="info">
              <Text size={name.length > 4 ? -1 : 0}>{name}</Text>
              <Button buttonStyle="1" onClick={() => this.onClick_max()}>
                Max
              </Button>
            </Group>
          </Group>
          <Group className="AddButton">{addToken}</Group>
        </Group>
      </Group>
    );
  }
}

export default InputTokenAmount;
