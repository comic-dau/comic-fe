import { useState } from 'react';

type ReadingMode = 'phone' | 'classic';

export const useReadingMode = () => {
  const [readingMode, setReadingModeState] = useState<ReadingMode>(() => {
    // Lấy giá trị từ localStorage nếu có
    const savedMode = localStorage.getItem('readingMode');
    return (savedMode as ReadingMode) || 'phone'; // Mặc định là 'phone'
  });

  // Tạo hàm setReadingMode mới để lưu giá trị vào localStorage ngay lập tức
  const setReadingMode = (mode: ReadingMode | ((prevMode: ReadingMode) => ReadingMode)) => {
    if (typeof mode === 'function') {
      setReadingModeState(prevMode => {
        const newMode = mode(prevMode);
        localStorage.setItem('readingMode', newMode);
        return newMode;
      });
    } else {
      localStorage.setItem('readingMode', mode);
      setReadingModeState(mode);
    }
  };

  const toggleReadingMode = () => {
    setReadingMode(prevMode => prevMode === 'phone' ? 'classic' : 'phone');
  };

  return {
    readingMode,
    setReadingMode,
    toggleReadingMode,
    isPhoneMode: readingMode === 'phone',
    isClassicMode: readingMode === 'classic'
  };
};
