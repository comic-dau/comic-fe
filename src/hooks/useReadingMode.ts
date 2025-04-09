import { useState, useEffect } from 'react';

type ReadingMode = 'phone' | 'classic';

export const useReadingMode = () => {
  const [readingMode, setReadingMode] = useState<ReadingMode>(() => {
    // Lấy giá trị từ localStorage nếu có
    const savedMode = localStorage.getItem('readingMode');
    return (savedMode as ReadingMode) || 'phone'; // Mặc định là 'phone'
  });

  // Lưu giá trị vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('readingMode', readingMode);
  }, [readingMode]);

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
