import React from 'react';

// css
// import './CheckBox.css';

class CheckBox extends React.Component {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      onChange: props.onChange || null,
    };

    this.refInput = React.createRef();
  }

  onChange(_e) {
    const { onChange } = this.state;
    if (onChange !== null) {
      onChange(_e);
    }
  }

  isChecked() {
    return this.refInput.current.checked;
  }

  render() {
    const { className, id, name, checked } = this.state;
    // build class name
    const cn = `CheckBox ${className || ''}`;

    // render
    return (
      <input
        id={id}
        ref={this.refInput}
        name={name}
        className={cn}
        type="checkbox"
        checked={checked}
        onChange={(e) => this.onChange(e)}
      />
    );
  }
}

export default CheckBox;
