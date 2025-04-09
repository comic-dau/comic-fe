import { Monitor, Smartphone } from "lucide-react";

interface UIModeSwitcherProps {
  currentMode: 'phone' | 'classic';
  onSwitchToPhone: () => void;
  onSwitchToClassic: () => void;
}

export function UIModeSwitcher({ currentMode, onSwitchToPhone, onSwitchToClassic }: UIModeSwitcherProps) {
  const isPhoneMode = currentMode === 'phone';
  const isClassicMode = currentMode === 'classic';

  return (
    <div className="flex justify-center gap-4 mb-4">
      <button
        onClick={onSwitchToPhone}
        className={`flex items-center gap-2 px-4 py-2 rounded ${isPhoneMode ? 'bg-blue-500' : 'bg-gray-700'} text-white hover:${isPhoneMode ? 'bg-blue-600' : 'bg-gray-600'} transition-colors`}
      >
        <Smartphone size={20} />
        Phone UI
      </button>
      <button
        onClick={onSwitchToClassic}
        className={`flex items-center gap-2 px-4 py-2 rounded ${isClassicMode ? 'bg-blue-500' : 'bg-gray-700'} text-white hover:${isClassicMode ? 'bg-blue-600' : 'bg-gray-600'} transition-colors`}
      >
        <Monitor size={20} />
        Classic UI
      </button>
    </div>
  );
}
