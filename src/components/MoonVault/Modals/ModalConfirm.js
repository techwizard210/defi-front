import React from 'react';

// components
import { Modal } from './Modal';
import { Text } from '../Controls/Text';
import Button from '../Controls/Button';

// vars
let modal_confirm = null;

class ModalConfirm extends React.Component {
  static showModal_Confirm(_title, _text, _onConfirm) {
    modal_confirm.setShow(true);
    modal_confirm.setState({
      title: _title,
      text: _text,
      onConfirm: _onConfirm,
    });
  }

  constructor(props) {
    super(props);

    // init state
    this.state = {
      show: props.show || false,
      title: '',
      text: '',
      onConfirm: null,
    };

    // vars
    modal_confirm = this;
  }

  async onClick_confirm() {
    const { onConfirm } = this.state;
    this.setShow(false);
    if (onConfirm) {
      onConfirm();
    }
  }

  setShow(_show) {
    this.setState({
      show: _show,
    });
  }

  render() {
    const { title, show, text } = this.state;
    const header = <Text size="1">{title}</Text>;
    const footer = (
      <>
        <Button className="ModalButton" onClick={() => this.setShow(false)}>
          No
        </Button>
        <Button
          buttonStyle="1"
          className="ModalButton"
          onClick={() => this.onClick_confirm()}
        >
          Yes
        </Button>
      </>
    );

    return (
      <Modal
        show={show}
        className="ModalConfirm sizeNormal"
        onClose={() => this.setShow(false)}
        header={header}
        footer={footer}
      >
        <Text color="2">{text}</Text>
      </Modal>
    );
  }
}

export default ModalConfirm;
