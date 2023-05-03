import React from 'react';

// css
// import './TokenIcon.css';

// components
import Group from './Group';

class TokenIcon extends React.Component {
  constructor(props) {
    super(props);

    const { token, vaultinator3000 } = props;
    let icon1 = '';
    let icon2 = '';
    if (token && token.icon) {
      icon1 = props.token.icon;
    }

    if (props.token?.token0 && icon1 === '') {
      const token1 = vaultinator3000.findToken(props.token.token0);
      icon1 = token1.icon;
    }

    if (props.token?.token1) {
      const token2 = vaultinator3000.findToken(props.token.token1);
      icon2 = token2.icon;
    }

    // init state
    this.state = {
      icon1,
      icon2,
      height: props.height,
      width: props.width,
    };
  }

  render() {
    const { icon1, icon2, height, width } = this.state;
    let tokenImg;
    if (icon1 !== '') {
      tokenImg = (
        <img
          className={`icon1${icon2 !== '' ? ' iconLP' : ''}`}
          src={icon1}
          alt=""
        />
      );
    }
    let token2Img;
    if (icon2 !== '') {
      token2Img = <img className="icon2 iconLP" src={icon2} alt="" />;
    }

    const css = {};
    if (height) css.height = `${height}px`;
    if (width) css.width = `${width}px`;

    return (
      <Group className="TokenIcon icons" style={css}>
        {tokenImg}
        {token2Img}
      </Group>
    );
  }
}

export default TokenIcon;
