import { ChevronLeft, ChevronRight } from "lucide-react";
import { Chapter } from "../types/chapter";

interface ChapterNavigationProps {
  chapter: Chapter;
  hasPrevChapter: boolean;
  hasNextChapter: boolean;
  onPrevChapter: (chapter: Chapter) => void;
  onNextChapter: (chapter: Chapter) => void;
  className?: string;
}

export function ChapterNavigation({
  chapter,
  hasPrevChapter,
  hasNextChapter,
  onPrevChapter,
  onNextChapter,
  className = ""
}: ChapterNavigationProps) {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <button
        onClick={() => onPrevChapter(chapter)}
        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        disabled={!hasPrevChapter}
      >
        <ChevronLeft size={20} />
        Chương trước
      </button>
      <button
        onClick={() => onNextChapter(chapter)}
        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        disabled={!hasNextChapter}
      >
        Chương sau
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
