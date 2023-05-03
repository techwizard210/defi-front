import React from 'react';

// components
import { Modal } from './Modal';
import { Text } from '../Controls/Text';
import Button from '../Controls/Button';

// vars
let modal_message = null;

class ModalMessage extends React.Component {
  static showModal(_title, _text, _buttonText, _onClose) {
    modal_message.setShow(true);
    modal_message.setState({
      title: _title,
      text: _text,
      buttonText: _buttonText || 'OK',
      onClose: _onClose || null,
    });
  }

  constructor(props) {
    super(props);

    // init state
    this.state = {
      show: props.show || false,
      title: '',
      text: '',
      buttonText: '',
      onClose: null,
    };

    // vars
    modal_message = this;
  }

  async onClick_close() {
    const { onClose } = this.state;
    this.setShow(false);
    if (onClose) {
      onClose();
    }
  }

  setShow(_show) {
    this.setState({
      show: _show,
    });
  }

  render() {
    const { title, buttonText, show, text } = this.state;
    const header = <Text size="1">{title}</Text>;
    const footer = (
      <>
        <Button className="ModalButton" onClick={() => this.onClick_close()}>
          {buttonText}
        </Button>
      </>
    );

    return (
      <Modal
        show={show}
        className="ModalMessage sizeNormal"
        onClose={() => this.setShow(false)}
        header={header}
        footer={footer}
      >
        <Text color="2">{text}</Text>
      </Modal>
    );
  }
}

export default ModalMessage;
