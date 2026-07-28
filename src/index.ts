import { injectStyles } from './inject';
import { styles } from './styles';

injectStyles(styles);

export { default as Modal } from './Modal';
export { default as ModalTrigger } from './ModalTrigger';
export { default as ModalContent } from './ModalContent';
export { default as ModalClose } from './ModalClose';
export { default as ModalHeader } from './ModalHeader';
export { default as ModalBody } from './ModalBody';
export { default as ModalFooter } from './ModalFooter';

export type { ModalProps } from './Modal';
export type { ModalTriggerProps } from './ModalTrigger';
export type { ModalContentProps } from './ModalContent';
export type { ModalCloseProps } from './ModalClose';
export type { ModalHeaderProps } from './ModalHeader';
export type { ModalBodyProps } from './ModalBody';
export type { ModalFooterProps } from './ModalFooter';

export type { SpringConfig, SpringPreset, AnimationVariant } from './spring';
export type { AnimateConfig } from './animate';
