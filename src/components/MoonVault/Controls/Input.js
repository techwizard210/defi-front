import React from 'react';

// css
// import './Input.css';

class Input extends React.Component {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      onChange: props.onChange || null,
      onBlur: props.onBlur || null,
    };

    this.refInput = React.createRef();
  }

  onChange(_e) {
    const { onChange } = this.state;
    if (onChange !== null) {
      onChange(_e);
    }
  }

  onBlur(_e) {
    const { onBlur } = this.state;
    if (onBlur !== null) {
      onBlur(_e);
    }
  }

  getValue() {
    return this.refInput.current.value;
  }

  setValue(_value) {
    this.refInput.current.value = _value;
  }

  focus() {
    this.refInput.current.focus();

    const { length } = this.refInput.current.value;
    this.refInput.current.setSelectionRange(length, length);
  }

  render() {
    const {
      className,
      id,
      type,
      name,
      min,
      max,
      inputMode,
      pattern,
      title,
      step,
      value,
      style,
      placeholder,
      readOnly,
    } = this.props;

    const cn = `Input ${className || ''}`;

    return (
      <input
        className={cn}
        id={id}
        ref={this.refInput}
        type={type || 'text'}
        name={name}
        min={min}
        max={max}
        inputMode={inputMode}
        pattern={pattern}
        title={title}
        step={step}
        value={value}
        style={style}
        placeholder={placeholder}
        onChange={(_e) => this.onChange(_e)}
        onBlur={(_e) => this.onBlur(_e)}
        readOnly={readOnly || false}
      />
    );
  }
}

export default Input;
