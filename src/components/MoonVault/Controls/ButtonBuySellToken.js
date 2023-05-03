import React from 'react';

// libs
import { LSymbols } from '../Libs/LSymbols';

// components
import Button from './Button';
import Group from './Group';
import { Text } from './Text';

// css
// import './ButtonBuySellToken.css';

class ButtonBuySellToken extends React.Component {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      token: props.token,
      sell: props.sell || false,
      showLabel: props.showLabel || false,
    };

    this.router = props.vaultinator3000.findRouter(props.token?.router);
  }

  getLink() {
    const { token, sell } = this.state;
    let link = '';
    if (token.isLPToken()) {
      // LP token
      if (sell) {
        link = this.router.linkRemoveLiquidity
          .replace('{token0}', token.token0)
          .replace('{token1}', token.token1);
      } else {
        link = this.router.linkAddLiquidity
          .replace('{token0}', token.token0)
          .replace('{token1}', token.token1);
      }
    } else if (token.linkSwap !== '') {
      // token (overriden swap)
      if (sell) {
        link = token.linkSwap
          .replace('{from}', token.address)
          .replace('{to}', '');
      } else {
        link = token.linkSwap
          .replace('{from}', '')
          .replace('{to}', token.address);
      }
    } else {
      link = sell
        ? this.router.linkSwap
            .replace('{from}', token.address)
            .replace('{to}', '')
        : this.router.linkSwap
            .replace('{from}', '')
            .replace('{to}', token.address);
    }

    return link;
  }

  getLabel = () => {
    const { token, sell } = this.state;
    let lbl = '';
    if (token.isLPToken()) {
      // LP token
      if (sell) {
        lbl = 'to remove liquidity';
      } else {
        lbl = 'to add liquidity';
      }
    } else {
      lbl = sell ? 'to sell token' : 'to buy token';
    }

    if (lbl !== '') {
      return <Text color="2">{lbl}</Text>;
    }
    return lbl;
  };

  render() {
    if (this.router === null) {
      return null;
    }
    const { showLabel, sell } = this.state;
    return (
      <Group className="ButtonBuySellToken">
        {showLabel ? <Text color="2">Click</Text> : <></>}
        <Button
          className={`ButtonBuySellToken ${sell ? 'sell' : 'buy'}`}
          href={this.getLink()}
          target="blank"
        >
          {LSymbols.cart()}
        </Button>
        {showLabel ? this.getLabel() : <></>}
      </Group>
    );
  }
}

export default ButtonBuySellToken;
