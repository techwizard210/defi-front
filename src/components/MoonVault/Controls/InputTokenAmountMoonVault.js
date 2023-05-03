// libs
import { LWeb3 } from '../Libs/LWeb3';

// components
import InputTokenAmount from './InputTokenAmount';

class InputTokenAmountMoonVault extends InputTokenAmount {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      ...this.state,
      onChangeMoonChef: props.onChangeMoonChef || null,
      onChangeVault: props.onChangeVault || null,
      onChangePool: props.onChangePool || null,
      vault: props.vault,
      pool: props.pool,
    };

    this.checkUpdate_moonChef = this.checkUpdate_moonChef.bind(this);
    this.checkUpdate_vault = this.checkUpdate_vault.bind(this);
    this.checkUpdate_pool = this.checkUpdate_pool.bind(this);
    this.checkUpdate_token = this.checkUpdate_token.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    document.addEventListener('moonChef_info', this.checkUpdate_moonChef);
    document.addEventListener('vault_userInfo', this.checkUpdate_vault);
    document.addEventListener('pool_userInfo', this.checkUpdate_pool);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    document.removeEventListener('moonChef_info', this.checkUpdate_moonChef);
    document.removeEventListener('vault_userInfo', this.checkUpdate_vault);
    document.removeEventListener('pool_userInfo', this.checkUpdate_pool);
  }

  checkUpdate_token(_data) {
    if (
      LWeb3.checkEqualAddress(_data.detail.address, this.state.token?.address)
    ) {
      if (
        !this.state.onChangeMoonChef &&
        !this.state.onChangeVault &&
        !this.state.onChangePool
      ) {
        super.checkUpdate_token(_data);
      }
    }
  }

  checkUpdate_vault(_data) {
    if (
      this.props.vault &&
      LWeb3.checkEqualAddress(_data.detail.address, this.props.vault?.address)
    ) {
      if (this.state.onChangeVault) {
        this.setState({ max: this.state.onChangeVault() });
      }
    }
  }

  checkUpdate_pool(_data) {
    if (
      this.props.pool &&
      LWeb3.checkEqualAddress(_data.detail.address, this.props.pool?.address)
    ) {
      if (this.state.onChangePool) {
        this.setState({ max: this.state.onChangePool() });
      }
    }
  }

  checkUpdate_moonChef() {
    if (this.state.onChangeMoonChef) {
      this.setState({ max: this.state.onChangeMoonChef() });
    }
  }
}

export default InputTokenAmountMoonVault;
