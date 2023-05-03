import React from 'react';

// modals
import ModalConfirm from './ModalConfirm';
import ModalTransaction from './ModalTransaction';
import ModalMessage from './ModalMessage';

import ModalVaultStrategySettings from './ModalVaultStrategySettings';

export const ModalManager = (props) => {
  return (
    <>
      <ModalConfirm {...props} />
      <ModalTransaction {...props} />
      <ModalMessage {...props} />

      <ModalVaultStrategySettings {...props} />
    </>
  );
};

export default ModalManager;
