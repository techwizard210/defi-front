import React from 'react';

// libs
import { LSymbols } from './Libs/LSymbols';

// components
import Group from './Controls/Group';
import { Text } from './Controls/Text';
import TokenIcon from './Controls/TokenIcon';

class VaultHeader extends React.Component {
  constructor(props) {
    super(props);

    this.vault = props.vault;

    this.showDetailsLink =
      typeof props.showDetailsLink === 'boolean' ? props.showDetailsLink : true;
  }

  onClick_showInfo() {
    const { refVaultModalManager } = this.props;
    refVaultModalManager.current.showVaultDialog('details', this.vault);
  }

  render() {
    // details
    let details = <></>;
    if (this.showDetailsLink) {
      details = (
        <>
          {LSymbols.info(
            'svgLink Vault_Details',
            () => this.onClick_showInfo(this.vault),
            'View Vault Details'
          )}
        </>
      );
    }

    return (
      <Group className="VaultHeader">
        <TokenIcon token={this.vault.depositToken} {...this.props} />
        <Group className="VaultHeaderGroup">
          <Text className="name" color="1">
            {this.vault.name}
            {details}
          </Text>
          <Text className="platform" color="0">
            Uses: {this.vault.platform.name}
          </Text>
        </Group>
      </Group>
    );
  }
}

export default VaultHeader;
