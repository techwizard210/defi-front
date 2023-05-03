import React from 'react';

// components
import { Modal } from './Modal';
import Button from '../Controls/Button';
import { Text } from '../Controls/Text';
import Group from '../Controls/Group';
import ProfitCalculator from '../Controls/ProfitCalculator';

// css
// import './ModalProfitCalculator.css';

class ModalProfitCalculator extends React.Component {
  constructor(props) {
    super(props);

    this.vault = props.vault;
    this.onClose = props.onClose;
  }

  close() {
    if (this.onClose) {
      this.onClose();
    }
  }

  render() {
    const header = <Text size="1">Profit Calculator</Text>;
    const footer = (
      <>
        <Button className="ModalButton" onClick={() => this.reset()}>
          reset
        </Button>
        <Button className="ModalButton" onClick={() => this.close()}>
          close
        </Button>
      </>
    );

    const { show } = this.props;

    return (
      <Modal
        show={show}
        className="ModalProfitCalculator sizeNormal"
        onClose={() => this.close()}
        header={header}
        footer={footer}
      >
        <Group className="content">
          <ProfitCalculator
            version="1"
            vault={this.vault}
            showReset={false}
            // eslint-disable-next-line no-return-assign
            reset={(r) => (this.reset = r)}
            {...this.props}
          />
        </Group>
      </Modal>
    );
  }
}

export default ModalProfitCalculator;
