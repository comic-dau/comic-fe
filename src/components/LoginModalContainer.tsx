import { useModal } from "../contexts/ModalContext";
import { LoginModal } from "./LoginModal";

export function LoginModalContainer() {
  const { isLoginModalOpen, closeLoginModal } = useModal();

  return (
    <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
  );
}
