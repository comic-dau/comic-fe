import { useNavigate } from 'react-router-dom';
import type { Chapter } from '../types/chapter';

export const useChapterNavigation = (chapterList: Chapter[], id: string | undefined) => {
  const navigate = useNavigate();

  const navigateToChapter = (targetNumber: number) => {
    const targetChapter = chapterList.find((ch) => ch.number === targetNumber);
    if (targetChapter) {
      const urlName = encodeURIComponent(
        targetChapter.comic_info.name.toLowerCase().replace(/\s+/g, "-")
      );
      navigate(
        `/comic/${urlName}/${id}/chapter/${targetChapter.number}/${targetChapter.id}`
      );
    }
  };

  const handlePrevChapter = (currentChapter: Chapter) => {
    const prevChapter = chapterList.find(
      (ch) => ch.number === currentChapter.number - 1
    );
    if (prevChapter) {
      navigateToChapter(prevChapter.number);
    }
  };

  const handleNextChapter = (currentChapter: Chapter) => {
    const nextChapter = chapterList.find(
      (ch) => ch.number === currentChapter.number + 1
    );
    if (nextChapter) {
      navigateToChapter(nextChapter.number);
    }
  };

  return {
    handlePrevChapter,
    handleNextChapter,
  };
};