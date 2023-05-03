/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import React from 'react';
import { toast } from 'react-toastify';

// config
import { config } from './config';

// libs
import { LLib } from './Libs/LLib';
import { LWeb3 } from './Libs/LWeb3';

// classes
import Token from './Token';
import Router from './Router';
import Oracle from './Oracle';

// components
import Group from './Controls/Group';
import { Text } from './Controls/Text';
import VaultList from './VaultList';

// modals
import { ModalManager } from './Modals/ModalManager';
import ModalTransaction from './Modals/ModalTransaction';

class BaseMoonvaultWrapper extends React.Component {
  constructor(props) {
    super(props);

    // init
    this.refreshCount = 0;
    this.template = null;
    this.walletInstalled = false;
    this.chainID = 0;
    this.web3_data = null;
    this.web3_user = null;
    this.account = null;
    this.currentChain = null;
    this.currentBlock = 0;
    this.chains = [];
    this.depositTokens = [];
    this.depositAssets = [];
    this.user = null;
    this.stableToken = null;
    this.wrappedCoin = null;
    this.transactionCounter = 1;
    this.transactions = [];
    this.dataVersion = new Date().getTime() / 1000;

    // config
    this.defaultChain = props.defaultChain;

    // classes
    this.oracle = new Oracle(this);
    this.tokens = [];
    this.routers = [];

    // runtime data
    this.userCoinBalance = '0';
    this.userCoinBalanceUSD = 0;
    this.avgGasPrice = 0;

    // vars
    this.interval_refresh = null;
  }

  async componentDidMount() {
    await this.initApp();

    // intervals
    this.interval_refresh = setInterval(() => this.refreshData(), 10000); // 10 secs (data will check caching on its own)
  }

  componentWillUnmount() {
    if (this.interval_refresh !== null) {
      clearInterval(this.interval_refresh);
    }
  }

  async refreshChainData() {
    // token prices
    await this.refreshData_tokens();
  }

  async refreshData() {
    if (this.web3_data !== null) {
      // gas price & current block
      this.avgGasPrice = parseFloat(
        this.web3_data.utils
          .fromWei(await this.web3_data.eth.getGasPrice(), 'gwei')
          .toString()
      ).toFixed(2);
      this.currentBlock = await this.web3_data.eth.getBlockNumber();

      // chain data
      await LLib.measureTime(
        `TM: AppRefresh #${this.refreshCount}`,
        async () => {
          await this.refreshChainData();
        }
      );
    } else if (this.web3_user !== null) {
      // user selected unsupported chain
      // gas price & current block
      this.avgGasPrice = parseFloat(
        this.web3_user.utils
          .fromWei(await this.web3_user.eth.getGasPrice(), 'gwei')
          .toString()
      ).toFixed(2);
      this.currentBlock = await this.web3_user.eth.getBlockNumber();
    }

    // complete
    this.refreshCount += 1;

    // event
    document.dispatchEvent(new CustomEvent('app_reload'));
  }

  async refreshData_tokens() {
    this.tokens.sort(
      (
        _a,
        _b // ensure correct order for oracle
      ) => {
        const oracleTypeOrder = [
          'Stable',
          'LPStable',
          'LPCoin',
          'LPMirror',
          'Alias',
          'LP',
        ];

        const idxA = oracleTypeOrder.indexOf(_a.oracleType);
        const idxB = oracleTypeOrder.indexOf(_b.oracleType);
        if (idxA === idxB) {
          return _a.address > _b.address ? 1 : -1;
        }
        return idxA > idxB ? 1 : -1;
      }
    );

    // init all
    let tokensInit = [];
    await LLib.measureTime(`TM: TokenInit ${this.tokens.length}`, async () => {
      tokensInit = await Token.batchInit(this.tokens, this);
    });

    // load price & pair info
    const tokensGetPrice = tokensInit.filter((t) => !this.isSpecialToken(t));
    await LLib.measureTime(
      `TM: TokenPairInfo ${tokensGetPrice.length}`,
      async () => {
        await Token.batchLoadPairInfo(tokensGetPrice, this);
      }
    );
    await LLib.measureTime(
      `TM: OracleTokenPairs ${tokensGetPrice.length}`,
      async () => {
        await Oracle.batchLoadPricePairs(tokensGetPrice, this);
      }
    );
    await LLib.measureTime(
      `TM: TokenPrice ${tokensGetPrice.length}`,
      async () => {
        await Token.batchReloadPrice(tokensGetPrice);
      }
    );

    // load user balance
    if (this.account !== null) {
      await LLib.measureTime(
        `TM: TokenUser ${tokensGetPrice.length}`,
        async () => {
          const tokensUserBalance = tokensInit.filter(
            (t) => this.isSpecialToken(t) || this.depositTokens.includes(t)
          );
          await Token.batchLoadUserData(tokensUserBalance, this);
        }
      );

      // coin balance
      if (this.currentChain !== null) {
        this.userCoinBalance = await this.web3_user.eth.getBalance(
          this.account
        );
        this.userCoinBalanceUSD = this.wrappedCoin.getPriceUSDForAmount(
          this.userCoinBalance
        );
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  isSpecialToken(_token) {
    return _token.address === window.chef.moonChef?.moonToken?.address;
  }

  selectWeb3Connection(_user) {
    const { web3 } = LWeb3.findWeb3Connection(
      this.selectWeb3ConnectionID(_user)
    );
    return web3;
  }

  selectWeb3ConnectionID(_user) {
    let conID = _user ? 'user' : 'data';
    if (config.settings.alwaysUseUserWeb3 && this.web3_user !== null) {
      conID = 'user';
    }

    return conID;
  }

  makeMultiCall(_user) {
    return LWeb3.makeMultiCall(this.selectWeb3ConnectionID(_user));
  }

  async initWeb3() {
    // connect web3
    LWeb3.initWeb3Data(config.web3Data);
    this.web3_user = null;
    if (!LLib.getStorage_bool(false, 'web3_disconnected', false)) {
      this.web3_user = await LWeb3.createAndConnectWeb3Connection('user', -1);
    }
    this.chainID =
      this.web3_user === null
        ? LLib.getStorage_int(false, 'web3_selectedChain', this.defaultChain)
        : await this.web3_user.eth.net.getId();
    try {
      this.web3_data = await LWeb3.createAndConnectWeb3Connection(
        'data',
        this.chainID
      );
    } catch (_e) {
      // try fallback to user connection
      console.error('Web3 [data] failed to connect');
      this.web3_data = this.web3_user;
    }

    // init web3
    if (window.ethereum) {
      this.walletInstalled = true;

      // add event listener [account change]
      window.ethereum.on('accountsChanged', function () {
        window.location.reload();
      });

      // add event listener [chain change]
      window.ethereum.on('chainChanged', function () {
        window.location.reload();
      });

      // add event listener [disconnect]
      window.ethereum.on('disconnect', function () {
        window.location.reload();
      });

      // connect to wallet
      await this.connectToWallet();
    }

    // event
    document.dispatchEvent(new CustomEvent('chef_connectedToWeb3'));
  }

  async initChainData() {
    // init router
    const jsonRouters = await LLib.fetchJSON(
      `${this.baseUrl}/data/${this.currentChain.name}/routers.json?v=${this.dataVersion}`
    );
    for (let n = 0; n < jsonRouters.length; n += 1) {
      const r = jsonRouters[n];
      this.routers.push(new Router(r, this));
    }

    // init tokens
    const jsonTokens = await LLib.fetchJSON(
      `${this.baseUrl}/data/${this.currentChain.name}/tokens.json?v=${this.dataVersion}`
    );

    for (let n = 0; n < jsonTokens.length; n += 1) {
      const t = jsonTokens[n];
      this.tokens.push(new Token(t, this));
    }
    this.stableToken = this.findToken(this.currentChain.stableCoin);
    this.wrappedCoin = this.findToken(this.currentChain.wrappedCoin);
  }

  async initApp() {
    await this.initWeb3();

    // load data
    this.chains = await LLib.fetchJSON(
      `${this.baseUrl}/data/chains.json?v=${this.dataVersion}`
    );

    this.currentChain = this.findChain(this.chainID);
    if (this.currentChain === null) {
      this.error('Invalid System', true);
    } else {
      await this.initChainData();
    }

    await this.initComplete();

    // event
    document.dispatchEvent(new CustomEvent('chef_dataLoaded'));
  }

  async initComplete() {
    await this.refreshData();
  }

  async connectToWallet(_askAgain) {
    // get user accounts
    if (!LLib.getStorage_bool(false, 'web3_disconnected', false)) {
      if (_askAgain) {
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
      } else {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (e) {
          // user rejected connection, so let him logged out
          LLib.setStorage(false, 'web3_disconnected', true);
        }
      }
    }

    // get account
    if (this.web3_user !== null) {
      const accounts = await this.web3_user.eth.getAccounts();
      if (accounts.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        this.account = accounts[0];
      }
    }
  }

  error(_text, _throw) {
    if (_throw === undefined) {
      // eslint-disable-next-line no-param-reassign
      _throw = false;
    }

    // build text
    const et = `[AppChef] ${_text}`;

    // error
    if (_throw) {
      console.error(et);
    } else {
      throw et;
    }
  }

  addDepositAsset(_token) {
    if (
      _token !== null &&
      !this.depositAssets.includes(_token) &&
      !this.isSpecialToken(_token)
    ) {
      this.depositAssets.push(_token);
      this.depositAssets.sort((_a, _b) =>
        // eslint-disable-next-line no-nested-ternary
        _a.symbol < _b.symbol ? -1 : _a.symbol > _b.symbol ? 1 : 0
      );
    }
  }

  addDepositToken(_token) {
    if (_token !== null && !this.depositTokens.includes(_token)) {
      this.depositTokens.push(_token);
      if (_token.isLPToken()) {
        this.addDepositAsset(this.findToken(_token.token0));
        this.addDepositAsset(this.findToken(_token.token1));
      } else {
        this.addDepositAsset(_token);
      }
    }
  }

  findChain(_id) {
    const chain = this.chains.find((c) => c.id === _id);
    return chain === undefined ? null : chain;
  }

  findRouter(_idOrContract) {
    if (!_idOrContract) {
      return null;
    }
    const router = this.routers.find(
      (r) =>
        r.id === _idOrContract ||
        r.address.toLowerCase() === _idOrContract.toLowerCase()
    );
    return router || null;
  }

  findRouterForToken(_token) {
    return this.findRouter(_token.router);
  }

  findToken(_contractOrSymbol) {
    if (!_contractOrSymbol) {
      return null;
    }
    _contractOrSymbol = _contractOrSymbol.toLowerCase();

    const token = this.tokens.find(
      (t) =>
        t.address.toLowerCase() === _contractOrSymbol ||
        t.symbol.toLowerCase() === _contractOrSymbol
    );
    return token || null;
  }

  findTransaction(_txHashOrId) {
    if (!_txHashOrId) {
      return null;
    }
    if (typeof _txHashOrId === 'string') {
      _txHashOrId = _txHashOrId.toLowerCase();
    }

    const tx = this.transactions.find(
      (t) => t.hash.toLowerCase() === _txHashOrId || t.id === _txHashOrId
    );
    return tx || null;
  }

  makeToast(_text, _success) {
    if (_success === undefined) {
      _success = true;
    }

    const opts = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: 'dark',
    };
    if (_success) {
      toast.success(_text, opts);
    } else {
      toast.error(_text, opts);
    }
  }

  async trySend(
    _callPromise,
    _from,
    _errorMsg,
    _default,
    _transactionDescription,
    _coinValue
  ) {
    // create transaction
    const transID = this.transactionCounter;
    this.transactionCounter += 1;
    this.transactions.push({
      id: transID,
      hash: '',
      stage: 1,
      description: _transactionDescription || '',
      receipt: null,
      error: null,
    });

    // show modal
    ModalTransaction.showModal(transID);

    // send
    return LWeb3.trySend(
      _callPromise,
      _from,
      _errorMsg,
      _default,
      (_txHash) => {
        // transaction was confirmed from user and is send to blockchain
        const tx = this.findTransaction(transID);
        tx.hash = _txHash;
        ModalTransaction.setTransactionStage(transID, 1, _txHash);
      },
      (_receipt) => {
        // a receipt is available to check the state
        const tx = this.findTransaction(transID);
        tx.receipt = _receipt;
        // ModalTransaction.setTransactionStage(transID, 2, _receipt)
      },
      (_confirmations, _receipt) => {
        // it was mined and confirmed
        const tx = this.findTransaction(transID);
        tx.stage = 3;
        tx.receipt = _receipt;
        ModalTransaction.setTransactionStage(transID, 3, _receipt);
        this.makeToast(
          <>
            Transaction complete!
            <br />
            <Text size="-1">{tx.description}</Text>
          </>,
          true
        );
      },
      (_error) => {
        // error occured
        const tx = this.findTransaction(transID);
        tx.stage = -1;
        tx.error = _error;
        ModalTransaction.setTransactionStage(transID, -1, _error);
        // this.makeToast(<>Transaction failed!<br /><Text size="-1">{tx.description}</Text></>, false)
      },
      _coinValue
    );
  }

  toBN(_number) {
    return this.web3_data === null
      ? this.web3_user.utils.toBN(_number)
      : this.web3_data.utils.toBN(_number);
  }

  render() {
    return (
      <Group className="Page_Vaults">
        <ModalManager vaultinator3000={this} />
        <VaultList ref={this.refVaultList} vaultinator3000={this} />
      </Group>
    );
  }
}

export default BaseMoonvaultWrapper;
