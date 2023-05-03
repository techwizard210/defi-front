import React from 'react';

// components
import Group from './Group';

// css
// import './Toggle.css';

class Toggle extends React.Component {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      checked: props.checked,
      onChange: props.onChange || null,
    };
  }

  onCheckChanged() {
    const { checked, onChange } = this.state;
    const newState = !checked;
    this.setState({ checked: newState });
    if (onChange !== null) {
      onChange(newState);
    }
  }

  render() {
    const { id, labelOn, labelOff } = this.props;
    const { checked } = this.state;

    const calculatedId = id || 'myOnOffSwitch';
    const calculatedLabelOn = labelOn ?? 'On';
    const calculatedLabelOff = labelOff ?? 'Off';
    const labels = {
      '--onoffswitch-on-var': `"${calculatedLabelOn}"`,
      '--onoffswitch-off-var': `"${calculatedLabelOff}"`,
    };

    return (
      <Group className="onoffswitch">
        <input
          type="checkbox"
          name="onoffswitch"
          className="onoffswitch-checkbox"
          id={calculatedId}
          tabIndex="0"
          defaultChecked={checked}
          onClick={() => this.onCheckChanged()}
        />
        <label className="onoffswitch-label" htmlFor={calculatedId}>
          <span className="onoffswitch-inner" style={labels} />
          <span className="onoffswitch-switch" />
        </label>
      </Group>
    );
  }
}

export default Toggle;
