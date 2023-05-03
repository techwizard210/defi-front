import React from 'react';

// modals
import ModalVaultWithdraw from './Modals/ModalVaultWithdraw';
import ModalVaultDeposit from './Modals/ModalVaultDeposit';
import ModalVaultApprove from './Modals/ModalVaultApprove';
import ModalProfitCalculator from './Modals/ModalProfitCalculator';
import ModalVaultDetails from './Modals/ModalVaultDetails';

class VaultModalManager extends React.Component {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      showDialog_deposit: false,
      showDialog_withdraw: false,
      showDialog_approve: false,
      showDialog_profitCalculator: false,
      showDialog_vaultDetails: false,
      dialogVault: null,
    };
  }

  closeVaultDialog() {
    this.setState({
      showDialog_deposit: false,
      showDialog_withdraw: false,
      showDialog_approve: false,
      showDialog_profitCalculator: false,
      showDialog_vaultDetails: false,
      dialogVault: null,
    });
  }

  showVaultDialog(_type, _vault) {
    this.setState({
      showDialog_deposit: _type === 'deposit',
      showDialog_withdraw: _type === 'withdraw',
      showDialog_approve: _type === 'approve',
      showDialog_profitCalculator: _type === 'calculator',
      showDialog_vaultDetails: _type === 'details',
      dialogVault: _vault,
    });
  }

  render() {
    const {
      showDialog_approve,
      showDialog_deposit,
      showDialog_withdraw,
      showDialog_profitCalculator,
      showDialog_vaultDetails,
      dialogVault,
    } = this.state;
    if (showDialog_withdraw) {
      return (
        <ModalVaultWithdraw
          vault={dialogVault}
          show={showDialog_withdraw}
          onClose={() => this.closeVaultDialog()}
          {...this.props}
        />
      );
    }
    if (showDialog_deposit) {
      return (
        <ModalVaultDeposit
          vault={dialogVault}
          show={showDialog_deposit}
          onClose={() => this.closeVaultDialog()}
          {...this.props}
        />
      );
    }
    if (showDialog_approve) {
      return (
        <ModalVaultApprove
          vault={dialogVault}
          show={showDialog_approve}
          onClose={() => this.closeVaultDialog()}
          {...this.props}
        />
      );
    }
    if (showDialog_profitCalculator) {
      return (
        <ModalProfitCalculator
          vault={dialogVault}
          show={showDialog_profitCalculator}
          onClose={() => this.closeVaultDialog()}
          {...this.props}
        />
      );
    }
    if (showDialog_vaultDetails) {
      return (
        <ModalVaultDetails
          vault={dialogVault}
          show={showDialog_vaultDetails}
          onClose={() => this.closeVaultDialog()}
          {...this.props}
        />
      );
    }

    return null;
  }
}

export default VaultModalManager;
