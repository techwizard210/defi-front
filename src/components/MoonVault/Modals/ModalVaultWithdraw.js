import React from 'react';
// libs
import { LWeb3 } from '../Libs/LWeb3';

// components
import { Modal } from './Modal';
import { Text } from '../Controls/Text';
import Button from '../Controls/Button';
import Group from '../Controls/Group';
import InputTokenAmountMoonVault from '../Controls/InputTokenAmountMoonVault';
import ButtonBuySellToken from '../Controls/ButtonBuySellToken';
import ProgressBarVaultBreakEven from '../Controls/ProgressBarVaultBreakEven';

class ModalVaultWithdraw extends React.Component {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      vault: props.vault || null,
      onClose: props.onClose || null,
    };

    this.vaultinator3000 = props.vaultinator3000;
  }

  async onClick_withdraw() {
    this.close();
    const { vault } = this.state;
    await vault.withdraw(this.getDialogTokensUint256());
  }

  async onClick_withdrawAll() {
    this.close();
    const { vault } = this.state;
    await vault.withdrawAll();
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
    const header = <Text size="1">Withdraw {vault.depositToken?.symbol}</Text>;
    const footer = (
      <>
        <ButtonBuySellToken
          token={vault.depositToken}
          sell
          showLabel={false}
          vaultinator3000={this.vaultinator3000}
        />
        <Button
          className="ModalButton"
          buttonStyle="1"
          onClick={() => this.onClick_withdraw()}
        >
          withdraw
        </Button>
        <Button buttonStyle="1" onClick={() => this.onClick_withdrawAll()}>
          all
        </Button>
      </>
    );

    return (
      <Modal
        show={show}
        className="ModalVaultWithdraw sizeNormal"
        onClose={() => this.close()}
        header={header}
        footer={footer}
      >
        <Group className="content">
          <Text color="2">
            Input how much {vault.depositToken?.symbol} you want to withdraw.
          </Text>
          <InputTokenAmountMoonVault
            balanceLabel="Deposit"
            token={vault.depositToken}
            max={vault.userDeposit}
            vault={vault}
            onChangeVault={() => vault.userDeposit}
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

export default ModalVaultWithdraw;
