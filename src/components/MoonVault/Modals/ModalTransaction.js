import React from 'react';

// libs
import { LSymbols } from '../Libs/LSymbols';

// components
import { Modal } from './Modal';
import { Text } from '../Controls/Text';
import Button from '../Controls/Button';

// css
// import './ModalTransaction.css';

// vars
let modal_transaction = null;

class ModalTransaction extends React.Component {
  static showModal(_txID) {
    modal_transaction.setState({
      stage: 0,
      txID: _txID,
    });
    modal_transaction.setShow(true);
  }

  static setTransactionStage(_txID, _stage, _data) {
    if (_txID === modal_transaction.state.txID) {
      modal_transaction.setState({
        stage: _stage,
        data: _data,
      });
    }
  }

  constructor(props) {
    super(props);
    this.vaultinator3000 = props.vaultinator3000;
    // init state
    this.state = {
      show: props.show || false,
      stage: 0,
      data: null,
      txID: -1,
    };

    // vars
    modal_transaction = this;
  }

  // eslint-disable-next-line class-methods-use-this
  handleErrorData(_error) {
    let autoClose = false;
    switch (_error.code) {
      case 4001:
        // user denied transaction
        autoClose = true;
        break;

      default:
      // do nothing
    }

    return {
      message: _error.message,
      reason: _error.data?.reason,
      autoClose,
    };
  }

  setShow(_show) {
    this.setState({
      show: _show,
    });
  }

  getStageData() {
    const { txID, stage, data } = this.state;
    const tx = this.vaultinator3000.findTransaction(txID);
    const description = tx?.description || '';

    switch (stage) {
      case -1: {
        const err = this.handleErrorData(data);
        return {
          title: 'Failed',
          text: (
            <>
              The transaction failed with error:
              <br />
              {err.message}
            </>
          ),
          description,
          icon: LSymbols.error('svgError'),
        };
      }

      case 0:
        return {
          title: 'Waiting for Confirmation',
          text: 'Confirm transaction in your wallet',
          description,
          icon: LSymbols.loading('svgLoading'),
        };

      case 1:
      case 2:
        return {
          title: 'Pending Transaction',
          text: 'Waiting for transaction to be processed',
          description: <>{description}</>,
          icon: LSymbols.submitted('svgSubmitted'),
        };

      case 3:
        return {
          title: 'Complete',
          text: 'Transaction successful',
          description: <>{description}</>,
          icon: LSymbols.success('svgSuccess'),
        };

      default:
        return null;
    }
  }

  render() {
    // get stage data
    const contentData = this.getStageData();

    // heaer & footer
    const header = <Text size="1">{contentData.title}</Text>;
    const footer = (
      <>
        <Button className="ModalButton" onClick={() => this.setShow(false)}>
          dismiss
        </Button>
      </>
    );

    // content
    return (
      <Modal
        // eslint-disable-next-line react/destructuring-assignment
        show={this.state.show}
        className="ModalTransaction sizeNormal"
        onClose={() => this.setShow(false)}
        header={header}
        footer={footer}
      >
        {contentData.icon}
        <Text color="2">{contentData.text}</Text>
        <Text color="1" size="-1">
          {contentData.description}
        </Text>
      </Modal>
    );
  }
}

export default ModalTransaction;
