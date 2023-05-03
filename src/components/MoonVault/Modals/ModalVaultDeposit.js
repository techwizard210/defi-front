import React from 'react';

// libs
import { LWeb3 } from '../Libs/LWeb3';
import { LLib } from '../Libs/LLib';

// components
import { Modal } from './Modal';
import { Text } from '../Controls/Text';
import Button from '../Controls/Button';
import Group from '../Controls/Group';
import InputTokenAmount from '../Controls/InputTokenAmount';
import ButtonBuySellToken from '../Controls/ButtonBuySellToken';
import ProgressBarVaultBreakEven from '../Controls/ProgressBarVaultBreakEven';

// css
// import './ModalVaultDeposit.css';

class ModalVaultDeposit extends React.Component {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      vault: props.vault || null,
      onClose: props.onClose || null,
    };

    this.vaultinator3000 = props.vaultinator3000;
  }

  async onClick_deposit() {
    this.close();
    // eslint-disable-next-line react/destructuring-assignment
    await this.state.vault.deposit(this.getDialogTokensUint256());
  }

  getDialogTokensUint256 = () => {
    const i = document.getElementById('dialog_tokenInput');
    const v = LWeb3.tokensToUint256String(i.value);
    const val = this.vaultinator3000.web3_data.eth.abi.encodeParameter(
      'uint256',
      v
    );

    return val;
  };

  close() {
    const { onClose } = this.state;
    if (onClose) {
      onClose();
    }
  }

  render() {
    const { vault } = this.state;
    const { show } = this.props;
    const { showBreakevenPanel } = this.vaultinator3000.config;
    const header = <Text size="1">Deposit {vault.depositToken?.symbol}</Text>;

    // fee disclaimer
    let disclaimer = <></>;
    if (this.vaultinator3000.vaultChef.withdrawFee > 0) {
      disclaimer = (
        <Text size="-2" color="2" italic="true">
          (*){' '}
          {LLib.smartFormatPercent(
            this.vaultinator3000.vaultChef.withdrawFee * 100,
            true
          )}{' '}
          withdraw fee from Moon Vault
        </Text>
      );
    }

    const footer = (
      <>
        <div>
          <div className="row">
            <ButtonBuySellToken
              token={vault.depositToken}
              sell={false}
              showLabel={false}
              vaultinator3000={this.vaultinator3000}
            />
            <Button
              className="ModalButton"
              buttonStyle="1"
              onClick={() => this.onClick_deposit()}
            >
              deposit
            </Button>
          </div>
          {!showBreakevenPanel && (
            <div className="row disclaimerFooter">{disclaimer}</div>
          )}
        </div>
      </>
    );

    return (
      <Modal
        show={show}
        className="ModalVaultDeposit sizeNormal"
        onClose={() => this.close()}
        header={header}
        footer={footer}
      >
        <Group className="content">
          <Text color="2">
            Input how much {vault.depositToken?.symbol} you want to deposit.
          </Text>
          <InputTokenAmount
            token={vault.depositToken}
            max={vault.depositToken?.userBalance}
            vaultinator3000={this.vaultinator3000}
          />
          {showBreakevenPanel && (
            <ProgressBarVaultBreakEven
              vault={vault}
              withdraw={false}
              showLabels
            />
          )}
        </Group>
      </Modal>
    );
  }
}

export default ModalVaultDeposit;
