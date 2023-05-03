import { Modal } from '@pancakeswap/uikit';
import modalCloseBtn from '../../assets/img/modalCloseBtn.svg';

import WalletCard from './WalletCard';
import config from './config';

const ConnectModal = ({ login, onDismiss = () => null }) => {
  return (
    <Modal title="Connect to a wallet" onDismiss={onDismiss}>
      <div className="backdrop">
        <div className="modal">
          <span
            className="modalCloseBtn"
            onClick={onDismiss}
            role="button"
            tabIndex={0}
          >
            <img src={modalCloseBtn} alt="close button" />
          </span>
          <div className="modalHolder">
            <h1 className="modalHeading">CONNECT WALLET</h1>
            <p className="modalSlug">Connect with your favorite wallet.</p>
            <div className="ModalBtnWrapper">
              {config.map((entry, index) => (
                <WalletCard
                  key={entry.title}
                  login={login}
                  walletConfig={entry}
                  onDismiss={onDismiss}
                  mb={index < config.length - 1 ? '8px' : '0'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConnectModal;
