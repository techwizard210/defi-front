import React from 'react';

// components
import { Modal } from './Modal';
import Group from '../Controls/Group';
import Button from '../Controls/Button';
import { Text } from '../Controls/Text';

class ModalVaultApprove extends React.Component {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      vault: props.vault || null,
      onClose: props.onClose || null,
    };
  }

  async onClick_approve() {
    this.close();
    // eslint-disable-next-line react/destructuring-assignment
    await this.state.vault.approve();
  }

  close() {
    const { onClose } = this.state;
    if (onClose) {
      onClose();
    }
  }

  render() {
    const { vault } = this.state;
    const { show } = this.props;
    const header = <Text size="1">Approve {vault.depositToken?.symbol}</Text>;
    const footer = (
      <>
        <Button
          className="ModalButton"
          buttonStyle="1"
          onClick={() => this.onClick_approve()}
        >
          approve
        </Button>
      </>
    );

    return (
      <Modal
        show={show}
        className="ModalVaultApprove sizeNormal"
        onClose={() => this.close()}
        header={header}
        footer={footer}
      >
        <Group className="content">
          <Text color="2">
            To interact with this Vault, you must allow the vault to access your{' '}
            {vault.depositToken?.symbol} tokens.
          </Text>
        </Group>
      </Modal>
    );
  }
}

export default ModalVaultApprove;
