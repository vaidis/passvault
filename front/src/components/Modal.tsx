import React from 'react';
import './modal.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Restore scrolling
    };
  }, [isOpen, onClose]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={'modal'}>
      <div
        className={'modal__overlay'}
        onClick={handleOutsideClick}
      />
      <div
        ref={modalRef}
        className={'modal__content'}
      >
        <div className={'modal__header'}>
          <h2 className={'modal__title'}>{title}</h2>
          <div
            className={'modal__close-button'}
            onClick={onClose}
          >
            ✕
          </div>
        </div>
        <div className={'modal__body'}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
