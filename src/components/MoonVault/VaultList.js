/* eslint-disable no-continue */
import React from 'react';

// components
import Group from './Controls/Group';
import { Text } from './Controls/Text';
import VaultModalManager from './VaultModalManager';
import VaultView from './VaultView';

class VaultList extends React.Component {
  constructor(props) {
    super(props);
    this.vaultinator3000 = props.vaultinator3000;
    this.vaults = this.vaultinator3000.vaults;
    // init state
    this.state = {
      updateRevision: 0,
      filter: {
        platformName: '',
        name: '',
        onlyDeposit: false,
        vaultType: '',
        asset: '',
      },
    };

    this.updateList = this.updateList.bind(this);
    this.refVaultModalManager = React.createRef();
  }

  componentDidMount() {
    this.updateList();
    document.addEventListener('chef_dataLoaded', this.updateList);
  }

  componentWillUnmount() {
    document.removeEventListener('chef_dataLoaded', this.updateList);
  }

  setFilter(_filter) {
    this.setState({ filter: _filter });
  }

  updateList() {
    const { updateRevision } = this.state;
    this.setState({ updateRevision: updateRevision + 1 });
  }

  filterVaults() {
    const filteredVaults = [];
    // filter
    const { filter } = this.state;

    for (let n = 0; n < this.vaults.length; n += 1) {
      const vault = this.vaults[n];

      // platformName
      if (
        filter.platformName !== '' &&
        filter.platformName !== vault.platform.name
      ) {
        continue;
      }

      // name
      if (
        filter.name !== '' &&
        !vault.name.includes(filter.name.toUpperCase())
      ) {
        continue;
      }

      // vaultType
      if (
        (filter.vaultType === 'Pool' && vault.isFarm()) ||
        (filter.vaultType === 'Farm' && !vault.isFarm()) ||
        (filter.vaultType === 'Stable' && !vault.hasStable())
      ) {
        continue;
      }

      // deposit / balance
      if (
        (filter.hideZeroBalance && !vault.userHasBalance()) ||
        (filter.onlyDeposit && !vault.userHasDeposit())
      ) {
        continue;
      }

      // asset
      if (filter.asset !== '' && !vault.hasDepositAsset(filter.asset)) {
        continue;
      }

      // push
      filteredVaults.push(vault);
    }

    return filteredVaults;
  }

  renderFilterResultEmpty = () => {
    return (
      <Group className="VaultList">
        <Text className="emptyFilter">
          {this.vaultinator3000.vaultsFetched ? (
            <>There are no results that match your current filter!</>
          ) : (
            <>Fetching vaults..</>
          )}
        </Text>
      </Group>
    );
  };

  render() {
    const vaults = this.filterVaults();
    if (vaults.length === 0) {
      return this.renderFilterResultEmpty();
    }

    const vaultList = vaults.map((v, index) => {
      const even = index % 2 === 0;
      return (
        <React.Fragment key={v.id.toString()}>
          <VaultView
            {...this.props}
            refVaultModalManager={this.refVaultModalManager}
            id={v.id}
            className={even ? 'even' : 'odd'}
            vault={v}
          />
        </React.Fragment>
      );
    });

    return (
      <>
        <VaultModalManager
          ref={this.refVaultModalManager}
          vaultinator3000={this.vaultinator3000}
        />
        <Group className="VaultList">{vaultList}</Group>
      </>
    );
  }
}

export default VaultList;
