import React from 'react';

// css
// import './Button.css';

class Button extends React.Component {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      onClick: props.onClick,
    };
  }

  buildPropsClassName() {
    const { disabled, buttonStyle } = this.props;
    // build props name
    let propsClassName = '';

    // style
    const bStyle = parseInt(buttonStyle || 0, 10);
    switch (bStyle) {
      case 1:
        propsClassName += 'stylePrimary';
        break;

      default:
        propsClassName += 'styleNormal';
    }
    propsClassName += ' ';

    // disabled
    if (disabled === true) {
      propsClassName += 'disabled ';
    }

    return propsClassName;
  }

  render() {
    const { className, href, title, children, target } = this.props;
    const { onClick } = this.state;
    const cn = `Button ${this.buildPropsClassName()}${className || ''}`;

    if (href === undefined) {
      // BUTTON
      return (
        <button type="button" className={cn} onClick={onClick} title={title}>
          {children}
        </button>
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

export default Button;
