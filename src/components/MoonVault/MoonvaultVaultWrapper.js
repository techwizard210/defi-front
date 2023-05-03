/* eslint-disable no-empty */
// libs
import { LLib } from './Libs/LLib';
import { LWeb3 } from './Libs/LWeb3';

// classes
import VaultChef from './VaultChef';
import MoonChef from './MoonChef';
import Vault from './Vault';

// components

import BaseMoonvaultWrapper from './BaseMoonvaultWrapper';

// css
import './bootstrap-grid.min.css';
import './MoonVault.css';

class MoonvaultVaultWrapper extends BaseMoonvaultWrapper {
  constructor(props) {
    super(props);

    // init
    this.moonConfig = null;
    this.platforms = [];
    this.user = null;
    this.config = props.config;
    this.vaultsFetched = false;

    // classes
    this.vaultChef = null;
    this.moonChef = null;
    this.vaults = [];

    // runtime data
    this.userVotingPower = 0;

    // stats
    this.minAPR = 0;
    this.maxAPR = 0;
    this.totalDepositUSD = 0;
    this.totalPendingUSD = 0;
    this.userDepositUSD = 0;
    this.userPendingUSD = 0;
    this.roiDailyAPR = 0;
    this.roiWeeklyAPR = 0;
    this.roiMonthlyAPR = 0;
    this.roiYearlyAPR = 0;
    this.roiDailyAPY = 0;
    this.roiWeeklyAPY = 0;
    this.roiMonthlyAPY = 0;
    this.roiYearlyAPY = 0;
    this.avgDailyAPR = 0;
    this.avgYearlyAPR = 0;
    this.avgYearlyAPY = 0;
    this.totalDailyROI = 0;
    this.totalDailyUSD = 0;
    this.totalDailyProtocolUSD = 0;

    // APIs
    this.baseUrl = 'https://app.moon-vault.com';
    this.api_url = `${this.baseUrl}/api.php`;
  }

  async refreshChainData() {
    // user login (just keep alive every 5 minutes)
    if (this.user !== null && !window.location.hostname.includes('localhost')) {
      this.refreshUserData();
    }

    // base
    await super.refreshChainData();

    // vaults
    await this.refreshData_vaults();

    // moon chef
    if (this.moonChef !== null) {
      await this.moonChef.reloadData();
    }
  }

  async refreshData_vaults() {
    // init vaults
    let vaultsInit;
    await LLib.measureTime(
      `TM: VaultInit ${this.vaults.length}`,
      async () => {
        vaultsInit = await Vault.batchInit(this.vaults, this);
      },
      this.config.debugMode
    );

    // load vault info
    await LLib.measureTime(
      `TM: VaultData ${vaultsInit.length}`,
      async () => {
        await Vault.batchLoadVaultInfo(vaultsInit, this);
      },
      this.config.debugMode
    );

    // get DB infos
    await LLib.measureTime(
      `TM: VaultDB ${vaultsInit.length}`,
      async () => {
        await Vault.batchReloadDBInfo(this);
      },
      this.config.debugMode
    );

    // load user info
    if (this.account !== null) {
      await LLib.measureTime(
        `TM: VaultUserData ${vaultsInit.length}`,
        async () => {
          await Vault.batchLoadUserInfo(vaultsInit, this);
        },
        this.config.debugMode
      );
    }

    // calc
    this.calculateVaultStats();
  }

  calculateVaultStats() {
    // init
    let minAPR = 0;
    let maxAPR = 0;
    let totalDepositUSD = this.toBN(0);
    let totalPendingUSD = this.toBN(0);
    let userDepositUSD = this.toBN(0);
    let userPendingUSD = this.toBN(0);
    let roiDailyAPR = 0;
    let roiWeeklyAPR = 0;
    let roiMonthlyAPR = 0;
    let roiYearlyAPR = 0;
    let roiDailyAPY = 0;
    let roiWeeklyAPY = 0;
    let roiMonthlyAPY = 0;
    let roiYearlyAPY = 0;
    let totalDailyUSD = this.toBN(0);

    // handle vaults
    for (let n = 0; n < this.vaults.length; n += 1) {
      const v = this.vaults[n];

      // process apr
      maxAPR = Math.max(maxAPR, v.dailyAPR);
      minAPR = minAPR === 0 ? v.dailyAPR : Math.min(minAPR, v.dailyAPR);

      // process total
      totalDepositUSD = totalDepositUSD.add(this.toBN(v.totalDepositUSD));
      totalPendingUSD = totalPendingUSD.add(this.toBN(v.totalPendingUSD));
      const vaultDailyUSD = this.toBN(v.totalDepositUSD)
        .mul(this.toBN(parseInt(v.dailyAPR * this.vaultChef.percentFactor, 10)))
        .div(this.toBN(this.vaultChef.percentFactor));
      totalDailyUSD = totalDailyUSD.add(vaultDailyUSD);

      // process user
      userDepositUSD = userDepositUSD.add(this.toBN(v.userDepositUSD));
      userPendingUSD = userPendingUSD.add(this.toBN(v.userPendingUSD));
      roiDailyAPR += v.roiDailyAPR;
      roiWeeklyAPR += v.roiWeeklyAPR;
      roiMonthlyAPR += v.roiMonthlyAPR;
      roiYearlyAPR += v.roiYearlyAPR;
      roiDailyAPY += v.roiDailyAPY;
      roiWeeklyAPY += v.roiWeeklyAPY;
      roiMonthlyAPY += v.roiMonthlyAPY;
      roiYearlyAPY += v.roiYearlyAPY;
    }

    // set values
    this.maxAPR = maxAPR;
    this.minAPR = minAPR;
    this.totalDepositUSD = totalDepositUSD.toString(10);
    this.totalPendingUSD = totalPendingUSD.toString(10);
    this.userDepositUSD = userDepositUSD.toString(10);
    this.userPendingUSD = userPendingUSD.toString(10);
    this.roiDailyAPR = roiDailyAPR;
    this.roiWeeklyAPR = roiWeeklyAPR;
    this.roiMonthlyAPR = roiMonthlyAPR;
    this.roiYearlyAPR = roiYearlyAPR;
    this.roiDailyAPY = roiDailyAPY;
    this.roiWeeklyAPY = roiWeeklyAPY;
    this.roiMonthlyAPY = roiMonthlyAPY;
    this.roiYearlyAPY = roiYearlyAPY;

    const uDeposit = parseFloat(
      LWeb3.fullFormatTokens(this.userDepositUSD, this.stableToken)
    );
    this.avgDailyAPR = this.roiDailyAPR / (uDeposit === 0 ? 1 : uDeposit);
    this.avgYearlyAPR = this.roiYearlyAPR / (uDeposit === 0 ? 1 : uDeposit);
    this.avgYearlyAPY = this.roiYearlyAPY / (uDeposit === 0 ? 1 : uDeposit);

    // total profits
    if (totalDailyUSD.cmp(this.toBN(0)) === 0) {
      this.totalDailyUSD = '0';
      this.totalDailyProtocolUSD = '0';
      this.totalDailyROI = 0;
    } else {
      const protocolFee = this.toBN(
        parseInt(
          (this.vaultChef.nativeLiquidityFee + this.vaultChef.nativePoolFee) *
            this.vaultChef.percentFactor,
          10
        )
      );
      const pDailyROI = totalDailyUSD
        .mul(this.toBN(this.vaultChef.percentFactor))
        .div(totalDepositUSD)
        .toString(10);
      this.totalDailyProtocolUSD = totalDailyUSD
        .mul(protocolFee)
        .div(this.toBN(this.vaultChef.percentFactor))
        .toString(10);
      this.totalDailyUSD = totalDailyUSD.toString(10);
      this.totalDailyROI = parseFloat(pDailyROI) / this.vaultChef.percentFactor;
    }
  }

  async initChainData() {
    // init vault chef
    this.vaultChef = new VaultChef(this.currentChain.vaultChef, this);
    try {
      await this.vaultChef.init();
      await this.vaultChef.reloadUserData();
    } catch (e) {}

    // base
    await super.initChainData();

    // init vaults
    const jsonVaults = await LLib.fetchJSON(
      `${this.baseUrl}/data/${this.currentChain.name}/vaults.json?v=${this.dataVersion}`
    );
    const { compatibleVaults } = this.config;
    for (let n = 0; n < jsonVaults.length; n += 1) {
      const p = jsonVaults[n];

      const platform = {
        ...p,
        vaults: [],
      };

      const platformVaults = [];
      let addPlatform = false;
      for (let m = 0; m < p.vaults.length; m += 1) {
        const v = p.vaults[m];
        if (!compatibleVaults.includes(v.id)) {
          // eslint-disable-next-line no-continue
          continue;
        }

        addPlatform = true;
        const vault = new Vault(v, platform, this);
        platformVaults.push(vault);
      }
      if (addPlatform) {
        platform.vaults = platformVaults;
        // needs to be done in state proprely, doing this for the moment.
        for (let v = 0; v < platformVaults.length; v += 1) {
          this.vaults.push(platformVaults[v]);
        }
        this.platforms.push(platform);
      }
    }

    this.vaultsFetched = true;
  }

  async initApp() {
    // get config
    this.moonConfig = await LLib.fetchJSON(
      `${this.baseUrl}/data/moonConfig.json?v=${this.dataVersion}`
    );

    this.defaultChain = this.moonConfig.moonChain;

    await super.initApp();
  }

  async initComplete() {
    // init moon chef
    this.moonChef = new MoonChef(this);
    try {
      await this.moonChef.init();
    } catch (e) {}

    // complete
    await super.initComplete();
  }

  isSpecialToken(_token) {
    return LWeb3.checkEqualAddress(
      _token.address,
      this.moonChef?.moonToken?.address
    );
  }

  findVault(_id) {
    const vault = this.vaults.find((v) => v.id === _id);
    return vault || null;
  }

  findVaultPlatform(_id) {
    const platform = this.platforms.find((p) => p.name === _id);
    return platform || null;
  }
}

export default MoonvaultVaultWrapper;
