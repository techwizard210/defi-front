import React from 'react';
import { NavLink } from 'react-router-dom';

// css
// import './Link.css';

class Link extends React.Component {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      onClick: props.onClick,
    };
  }

  buildPropsClassName() {
    const { size, weight, color, disabled, nav } = this.props;
    // build props name
    let propsClassName = '';

    // size
    const fontSize = parseInt(size || 0, 10);
    switch (fontSize) {
      case -1:
        propsClassName += 'sizeSmall';
        break;

      case 1:
        propsClassName += 'sizeBig';
        break;

      case 2:
        propsClassName += 'sizeVeryBig';
        break;

      default:
        propsClassName += 'sizeNormal';
    }
    propsClassName += ' ';

    // weight
    const fontWeight = parseInt(weight || 0, 10);
    switch (fontWeight) {
      case -1:
        propsClassName += 'weightLight';
        break;

      case 1:
        propsClassName += 'weightBold';
        break;

      default:
        propsClassName += 'weightNormal';
    }
    propsClassName += ' ';

    // color
    const fontColor = parseInt(color || 1, 10);
    switch (fontColor) {
      case 0:
        propsClassName += 'colorDisabled';
        break;

      case 2:
        propsClassName += 'colorSecondary';
        break;

      default:
        if (nav === true) {
          propsClassName += 'colorMenu';
        } else {
          propsClassName += 'colorPrimary';
        }
    }
    propsClassName += ' ';

    // disabled
    propsClassName += disabled === true ? 'disabled ' : '';

    return propsClassName;
  }

  render() {
    const { className, href, title, children, nav, target } = this.props;
    const { onClick } = this.state;
    const cn = `Link ${this.buildPropsClassName()}${className || ''}`;

    if (href === undefined) {
      // BUTTON
      return (
        <button type="button" className={cn} onClick={onClick} title={title}>
          {children}
        </button>
      );
    }
    if (nav === true) {
      // NavLink
      return (
        <NavLink className={cn} to={href} title={title}>
          {children}
        </NavLink>
      );
    }
    // A
    return (
      <a className={cn} href={href} target={target} title={title}>
        {children}
      </a>
    );
  }
}

export default Link;
