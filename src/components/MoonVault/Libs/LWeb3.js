/* eslint-disable no-empty */
/* eslint-disable no-param-reassign */
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { MultiCall } from 'eth-multicall';

// libs
import { LLib } from './LLib';

/// ///////////////////////////////////////
// LWeb3
export const LWeb3 = {
  compareAddress(_a, _b) {
    _a = typeof _a !== 'string' ? '' : _a.toLowerCase();
    _b = typeof _b !== 'string' ? '' : _b.toLowerCase();
    if (_a === '' && _b === '') {
      return -1;
    }

    if (_a > _b) {
      return 1;
    }

    if (_a < _b) {
      return -1;
    }

    return 0;
  },

  checkEqualAddress(_a, _b) {
    return this.compareAddress(_a, _b) === 0;
  },

  /// ///////////////////////////////////////
  // convert
  convertTokensToFloatString(_value, _tokenDecimals) {
    // default
    if (_value === undefined) {
      _value = '0';
    }
    if (_tokenDecimals === undefined) {
      _tokenDecimals = 18;
    }

    _value = _value.toString();
    if (_value.length <= _tokenDecimals) {
      _value = _value.padStart(_tokenDecimals + 1, '0');
    }
    _value = `${_value.substring(
      0,
      _value.length - _tokenDecimals
    )}.${_value.substring(_value.length - _tokenDecimals)}`;
    const offset = _value.length - _tokenDecimals;
    _value = _value.substring(0, offset);

    // remove trailing '0' and '.'
    _value = LLib.removeTrailStart(_value, '0');
    if (_value === '') {
      return '0';
    }
    if (_value[0] === '.') {
      _value = `0${_value}`;
    }

    return _value;
  },

  convertTokensToFloat(_value, _tokenDecimals) {
    return parseFloat(this.convertTokensToFloatString(_value, _tokenDecimals));
  },

  /// ///////////////////////////////////////
  // formatting
  formatTokens(_value, _decimals, _shorten, _tokenDecimals) {
    // default
    if (_value === undefined) {
      _value = '0';
    }
    if (_tokenDecimals === undefined) {
      _tokenDecimals = 18;
    }

    if (typeof _tokenDecimals !== 'number') {
      _tokenDecimals = parseInt(_tokenDecimals, 10);
    }

    if (_decimals === undefined) {
      _decimals = Math.min(8, _tokenDecimals);
    }

    _value = _value.toString();
    if (_value.length <= _tokenDecimals) {
      _value = _value.padStart(_tokenDecimals + 1, '0');
    }
    _value = `${_value.substring(
      0,
      _value.length - _tokenDecimals
    )}.${_value.substring(_value.length - _tokenDecimals)}`;
    const offset = _value.length - (_tokenDecimals - _decimals);
    _value = _value.substring(0, offset);

    // remove trailing '0' and '.'
    _value = LLib.removeTrailStart(_value, '0');
    if (_shorten === true) {
      _value = LLib.removeTrailEnd(_value, '0');
      _value = LLib.removeTrailEnd(_value, '.');
    }
    if (_value === '') {
      return '0';
    }
    if (_value[0] === '.') {
      _value = `0${_value}`;
    }

    return _value;
  },

  smartFormatTokensDisplay(_value, _token, _shorten) {
    const unformatted = this.smartFormatTokens(_value, _token, _shorten);
    return LLib.smartFormatFloatDisplay(unformatted, _shorten, 0, 18);
  },

  smartFormatTokens(_value, _token, _shorten) {
    if (_value === undefined) {
      _value = '0';
    }
    const maxDecimals =
      !!_token && _token.decimals !== undefined ? _token.decimals : 18;
    const precision = Math.min(maxDecimals, _value.length <= 18 ? 8 : 4);

    return this.formatTokens(
      _value,
      precision,
      !!_shorten,
      _token ? _token.decimals : undefined
    );
  },

  fullFormatTokens(_value, _token, _shorten) {
    if (_value === undefined) {
      _value = '0';
    }
    const precision =
      !!_token && _token.decimals !== undefined ? _token.decimals : 18;

    return this.formatTokens(
      _value,
      precision,
      !!_shorten,
      _token ? _token.decimals : undefined
    );
  },

  formatFiatDisplay(_value, stableToken, _allowLongerVersion = false) {
    return this.smartFormatFiat(_value, stableToken, true, _allowLongerVersion);
  },

  smartFormatFiat(
    _value,
    _token,
    _asCurrency = false,
    _allowLongerVersion = false
  ) {
    if (_value === undefined) {
      _value = '0';
    }

    let result = this.formatTokens(
      _value,
      2,
      false,
      _token ? _token.decimals : undefined
    );
    if (_allowLongerVersion && result < 1) {
      result = this.formatTokens(
        _value,
        4,
        false,
        _token ? _token.decimals : undefined
      );
    }
    if (_asCurrency) {
      result = LLib.formatFiat(result);
    }

    return result;
  },

  smartFormatBigNumber(_value) {
    const posFP = _value.indexOf('.');
    const iPart = posFP === -1 ? _value.length : posFP + 1;

    if (iPart >= 7) {
      // M + 2
      _value = `${_value.substr(0, iPart - 6)}.${_value.substr(
        iPart - 6,
        iPart - 4
      )}M`;
    } else if (iPart >= 4) {
      // no fp
      _value = _value.substring(0, iPart);
    }

    return _value;
  },

  tokensToUint256String(_value) {
    // fill up with 0, make 18 digits and remove .
    _value = _value.replace(',', '.');
    const o = _value.indexOf('.');
    _value =
      o === -1
        ? _value.padEnd(_value.length + 18, '0')
        : _value.padEnd(19 + o, '0');
    _value = _value.replaceAll('.', '');
    _value = LLib.removeTrailStart(_value, '0');
    if (_value === '') {
      _value = '0';
    }

    return _value;
  },

  formatAddress(_address) {
    if (!_address) {
      return '';
    }

    return `${_address.substring(0, 6)} ... ${_address.substring(
      _address.length - 4
    )}`;
  },
  /// ///////////////////////////////////////

  abiEncodeUint256(_bn) {
    const encoded = window.chef.web3_data.eth.abi.encodeParameter(
      'uint256',
      _bn
    );
    const shortened = encoded.substring(encoded.length - 32);
    return shortened;
  },

  /// ///////////////////////////////////////
  // calls / sends

  async tryCall(_callPromise, _errorMsg, _default) {
    if (_callPromise === undefined && _errorMsg !== undefined) {
    }

    return _callPromise.call().catch((e) => {
      if (_errorMsg !== undefined) {
      }
      if (_default !== undefined) {
        return _default;
      }
      throw e;
    });
  },

  async tryMultiCall(_multiCall, _calls, _errorMsg, _topic, _default) {
    // performance debugging
    // console.log(`[MC] ${_topic} #${_calls.length}`)

    if (_multiCall === undefined && _errorMsg !== undefined) {
    }

    let ret = [];
    try {
      ret = await _multiCall.all([_calls]).catch((e) => {
        throw e;
      });
    } catch (e) {
      if (_errorMsg !== undefined) {
      }
      if (_default !== undefined) {
        return _default;
      }
      throw e;
    }

    // check for failed results
    for (let n = 0; n < ret.length; n += 1) {
      const retChild = ret[n];
      for (let m = 0; m < retChild.length; m += 1) {
        const retRes = retChild[m];

        // eslint-disable-next-line no-restricted-syntax
        for (const [, value] of Object.entries(retRes)) {
          if (value === undefined) {
            if (_errorMsg !== undefined) {
            }
            if (_default !== undefined) {
              return _default;
            }
            throw new Error('MultiCall failed');
          }
        }
      }
    }

    // return result
    return ret;
  },

  async trySend(
    _callPromise,
    _from,
    _errorMsg,
    _default,
    _onTransactionHash,
    _onReceipt,
    _onConfirmation,
    _onError,
    _coinValue
  ) {
    if (_callPromise === undefined && _errorMsg !== undefined) {
    }

    const data = {
      from: _from,
    };
    if (_coinValue !== undefined) {
      data.value = _coinValue;
    }

    return _callPromise
      .send(data)
      .once('transactionHash', (txHash) => {
        if (_onTransactionHash) _onTransactionHash(txHash);
      })
      .once('receipt', (receipt) => {
        if (_onReceipt) _onReceipt(receipt);
      })
      .once('confirmation', (confNumber, receipt) => {
        if (_onConfirmation) _onConfirmation(confNumber, receipt);
      })
      .on('error', (error) => {
        if (_onError) _onError(error);
      })
      .catch((e) => {
        if (_errorMsg !== undefined) {
        }
        if (_default !== undefined) {
          return _default;
        }
        throw e;
      });
  },

  async scanEvent(_contract, _name, _fromBlock, _toBlock) {
    // defaulting
    if (_fromBlock === undefined) {
      _fromBlock = window.chef.currentBlock - 5000;
    }
    if (_toBlock === undefined) {
      _toBlock = 'latest';
    }

    // get logs
    let result = null;
    const options = {
      fromBlock: _fromBlock,
      toBlock: _toBlock,
    };
    try {
      result = await _contract.getPastEvents(_name, options);
    } catch (e) {}

    return result;
  },

  /// ///////////////////////////////////////

  /// ///////////////////////////////////////
  // connection handling
  web3Data: {
    connections: [],
    multiCalls: [],
    web3RPCs: [],
  },

  initWeb3Data(_data) {
    this.web3Data = _data;
  },

  createWeb3Connection(_id) {
    if (this.findWeb3Connection(_id) === null) {
      this.web3Data.connections.push({
        id: _id,
        web3: null,
        currentRPC: '',
        chain: -1,
      });
    }
  },

  async createAndConnectWeb3Connection(_id, _chain) {
    if (this.findWeb3Connection(_id) === null) {
      this.web3Data.connections.push({
        id: _id,
        web3: null,
        currentRPC: '',
        chain: -1,
      });
    }
    return this.connectWeb3(_id, _chain);
  },

  findWeb3Connection(_id) {
    for (let n = 0; n < this.web3Data.connections.length; n += 1) {
      const c = this.web3Data.connections[n];
      if (c.id === _id) {
        return c;
      }
    }

    return null;
  },

  findWeb3RPCs(_chain) {
    for (let n = 0; n < this.web3Data.web3RPCs.length; n += 1) {
      const c = this.web3Data.web3RPCs[n];
      if (c.chain === _chain) {
        return c.nodes;
      }
    }

    return [];
  },

  findMultiCall(_chain) {
    for (let n = 0; n < this.web3Data.multiCalls.length; n += 1) {
      const c = this.web3Data.multiCalls[n];
      if (c.chain === _chain) {
        return c.multiCall;
      }
    }

    return null;
  },

  async selectProvider(_providerName) {
    // select provider
    if (_providerName === 'MetaMask') {
      Web3.currentProvider = new Web3.providers.HttpProvider(
        'http://localhost:7545'
      );
    } else if (_providerName === 'WalletConnect') {
      Web3.currentProvider = new WalletConnectProvider({
        infuraId: '27e484dcd9e3efcfd25a83a78777cdf1',
      });
      await Web3.currentProvider.enable();
    }

    // reconnect all wallet based connections
    for (let n = 0; n < this.web3Data.web3RPCs.length; n += 1) {
      const c = this.web3Data.web3RPCs[n];
      if (c.currentRPC === '') {
        this.connectWeb3(c.id);
      }
    }
  },

  disconnectWeb3: async (_id) => {
    const c = this.findWeb3Connection(_id);
    if (c === null) {
      return false;
    }
    return true;
  },

  async connectWeb3(_id, _chain) {
    if (_chain === undefined) {
      _chain = -1;
    }

    const c = this.findWeb3Connection(_id);
    if (c === null) {
      return null;
    }

    // make new web3
    if (_chain === -1) {
      if (Web3.currentProvider || Web3.givenProvider) {
        c.web3 = new Web3(Web3.currentProvider || Web3.givenProvider);
        c.chain = await c.web3.eth.net.getId();
      }
    } else {
      const nodes = this.findWeb3RPCs(_chain);
      if (nodes.length === 0) {
        return null;
      }

      c.web3 = new Web3(new Web3.providers.HttpProvider(nodes[0]));
      c.chain = await c.web3.eth.net.getId();
      // eslint-disable-next-line prefer-destructuring
      c.currentRPC = nodes[0];
    }

    return c.web3;
  },

  async switchRPCWeb3(_id) {
    // find connection
    const c = this.findWeb3Connection(_id);
    if (c === null) {
      return null;
    }

    // find nodes
    const nodes = this.findWeb3RPCs(c.chain);
    if (nodes.length <= 1) {
      return null;
    }

    // find current node
    const idx = nodes.indexOf(c.currentRPC);
    if (idx === -1) {
      return null;
    }

    c.currentRPC = nodes[(idx + 1) % nodes.length];
    c.web3 = new Web3(new Web3.providers.HttpProvider(c.currentRPC));

    return c.web3;
  },

  makeMultiCall(_id) {
    // find connection
    const c = this.findWeb3Connection(_id);
    if (c === null) {
      return null;
    }

    // find multicall
    const mc = this.findMultiCall(c.chain);
    if (mc === null) {
      return null;
    }

    // make multicall
    const multicall = new MultiCall(c.web3, mc);

    return multicall;
  },

  async switchChain(_chainID) {
    let c = null;
    const rpcs = this.findWeb3RPCs(_chainID);
    if (rpcs.length === 0) {
      return;
    }
    const rpc = rpcs[0];
    switch (_chainID) {
      case 25:
        c = {
          chainId: '0x'.concat(parseInt('25', 10).toString(16)),
          chainName: 'Cronos Mainnet',
          nativeCurrency: {
            name: 'Cronos Coin',
            symbol: 'CRO',
            decimals: 18,
          },
          rpcUrls: [rpc],
          blockExplorerUrls: ['https://cronos.crypto.org/explorer'],
        };
        break;

      case 56:
        c = {
          chainId: '0x'.concat(parseInt('56', 10).toString(16)),
          chainName: 'Binance Smart Chain Mainnet',
          nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18,
          },
          rpcUrls: [rpc],
          blockExplorerUrls: ['https://bscscan.com'],
        };
        break;

      case 137:
        c = {
          chainId: '0x'.concat(parseInt('137', 10).toString(16)),
          chainName: 'Polygon Mainnet',
          nativeCurrency: {
            name: 'Polygon',
            symbol: 'MATIC',
            decimals: 18,
          },
          rpcUrls: [rpc],
          blockExplorerUrls: ['https://polygonscan.com'],
        };
        break;

      case 250:
        c = {
          chainId: '0x'.concat(parseInt('250', 10).toString(16)),
          chainName: 'Fantom Mainnet',
          nativeCurrency: {
            name: 'Fantom',
            symbol: 'FTM',
            decimals: 18,
          },
          rpcUrls: [rpc],
          blockExplorerUrls: ['https://ftmscan.com'],
        };
        break;

      case 1666600000:
        c = {
          chainId: '0x'.concat(parseInt('1666600000', 10).toString(16)),
          chainName: 'Harmony Mainnet',
          nativeCurrency: {
            name: 'Harmony',
            symbol: 'ONE',
            decimals: 18,
          },
          rpcUrls: [rpc],
          blockExplorerUrls: ['https://explorer.harmony.one'],
        };
        break;

      default:
        return;
    }

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [c],
    });
  },
  /// ///////////////////////////////////////
};
/// ///////////////////////////////////////
