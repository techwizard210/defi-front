import React from 'react';

// css
// import './Text.css';

export const Text = (props) => {
  const { size, weight, italic, color, className, children } = props;

  const buildPropsClassName = () => {
    // build props name
    let propsClassName = '';

    // size
    const fontSize = parseInt(size || 0, 10);
    switch (fontSize) {
      case -3:
        propsClassName += 'sizeSuperSmall';
        break;

      case -2:
        propsClassName += 'sizeVerySmall';
        break;

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

    // italic
    if (italic === 'true') {
      propsClassName += 'font-italic ';
    }

    // color
    if (color === undefined || typeof color === 'number') {
      const fontColor = parseInt(color || 1, 10);
      switch (fontColor) {
        case 0:
          propsClassName += 'colorDisabled';
          break;

        case 2:
          propsClassName += 'colorSecondary';
          break;
        default:
          propsClassName += 'colorPrimary';
      }
    }
    propsClassName += ' ';

    return propsClassName;
  };

  // build class name
  const cn = `Text ${buildPropsClassName()}${className || ''}`;

  // style
  let style = {};
  if (typeof color !== 'number') {
    style = {
      color,
    };
  }

  // render
  return (
    <span className={cn} style={style}>
      {children}
    </span>
  );
};

export default Text;
