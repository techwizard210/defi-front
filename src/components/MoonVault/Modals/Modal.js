import ReactModal from 'react-modal';

// components
import Group from '../Controls/Group';
import Button from '../Controls/Button';

// css
// import './Modal.css';

export const Modal = (props) => {
  const { onClose, raw, children, header, footer, show, className } = props;
  // close button
  let closeBtn = <></>;
  if (onClose) {
    closeBtn = (
      <Button className="close" buttonStyle="1" onClick={() => onClose()}>
        X
      </Button>
    );
  }

  // conent
  let content = children;
  if (!raw) {
    content = (
      <Group className="ModalContainer">
        <Group className="Header">
          {header}
          {closeBtn}
        </Group>
        <Group className="Content">{children}</Group>
        <Group className="Footer">{footer}</Group>
      </Group>
    );
  }

  return (
    <ReactModal
      isOpen={show}
      contentLabel="SwitchNetwork"
      className={`ModalContent ${className}`}
      overlayClassName="ModalOverlay"
      ariaHideApp={false}
    >
      {content}
    </ReactModal>
  );
};

export default Modal;
