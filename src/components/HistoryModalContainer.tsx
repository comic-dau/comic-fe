import { useModal } from "../contexts/ModalContext";
import { HistoryModal } from "./HistoryModal";
import { User } from "../types/user";

interface HistoryModalContainerProps {
  userInfo: User | null;
}

export function HistoryModalContainer({ userInfo }: HistoryModalContainerProps) {
  const { isHistoryModalOpen, closeHistoryModal } = useModal();

  return (
    <HistoryModal 
      isOpen={isHistoryModalOpen} 
      onClose={closeHistoryModal} 
      userInfo={userInfo} 
    />
  );
}
