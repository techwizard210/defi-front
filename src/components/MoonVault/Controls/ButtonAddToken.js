import React from 'react';

// components
import Button from './Button';
import Group from './Group';
import { Image } from './Image';

// css
// import './ButtonAddToken.css';

class ButtonAddToken extends React.Component {
  constructor(props) {
    super(props);

    // find icon
    this.token = props.token;
    this.icon1 = '';
    this.icon2 = '';
    this.vaultinator3000 = props.vaultinator3000;

    this.initIcons();
  }

  async onClick_addToken() {
    await this.token.addToWallet();
  }

  initIcons() {
    // find icons
    if (this.token !== null && !!this.token.icon) {
      this.icon1 = this.token.icon;
    }
    if (this.token?.token0 !== null && this.icon1 === '') {
      const token1 = this.vaultinator3000.findToken(this.token.token0);
      this.icon1 = token1.icon;
    }
    if (this.token?.token1 !== null) {
      const token2 = this.vaultinator3000.findToken(this.token.token1);
      this.icon2 = token2.icon;
    }
  }

  renderIcon() {
    if (this.icon2 === '') {
      return (
        <Group className="TokenIcon tokenIconSingle">
          <Image className="icon1" src={this.icon1} />
        </Group>
      );
    }
    return (
      <Group className="TokenIcon tokenIconDual">
        <Image className="icon1" src={this.icon1} />
        <Image className="icon2" src={this.icon2} />
      </Group>
    );
  }

  render() {
    const { mode, token } = this.props;
    if (mode === 'text') {
      let name = token.symbol;
      if (token.token0 !== null) {
        name = 'LP';
      }

      const label = `show ${name} in wallet`;
      return (
        <button type="button" onClick={(e) => this.onClick_addToken(e)}>
          {label}
        </button>
      );
    }

    return (
      <Button
        buttonStyle="0"
        className="ButtonAddToken"
        onClick={() => this.onClick_addToken()}
      >
        {this.renderIcon()}
        show in wallet
      </Button>
    );
  }
}

export default ButtonAddToken;
