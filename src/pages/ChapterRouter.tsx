import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReadingMode } from "../hooks/useReadingMode";
import { useChapterData } from "../hooks/useChapterData";

// Biến toàn cục để theo dõi trạng thái ẩn header
let isHeaderHidden = false;

export function ChapterRouter() {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const { readingMode } = useReadingMode();
  const { chapter } = useChapterData(chapterId, id, {
    view: false,
  });

  // Ẩn header ngay khi ChapterRouter được render
  useEffect(() => {
    const header = document.querySelector("header");
    if (header && !isHeaderHidden) {
      header.style.display = "none";
      isHeaderHidden = true;
    }

    return () => {
      // Chỉ hiện lại header khi rời khỏi tất cả các trang chapter
      // Kiểm tra URL hiện tại để biết liệu chúng ta có đang chuyển đến một trang chapter khác hay không
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/chapter/")) {
        const header = document.querySelector("header");
        if (header) {
          header.style.display = "";
          isHeaderHidden = false;
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!chapter || !id || !chapterId) return;

    const urlName = encodeURIComponent(
      chapter.comic_info.name.toLowerCase().replace(/\\s+/g, "-")
    );

    if (readingMode === "classic") {
      navigate(
        `/comic/${urlName}/${id}/chapter/${chapter.number}/${chapterId}/classic`,
        { replace: true }
      );
    } else {
      navigate(
        `/comic/${urlName}/${id}/chapter/${chapter.number}/${chapterId}/view`,
        { replace: true }
      );
    }
  }, [chapter, id, chapterId, readingMode, navigate]);

  // Hiển thị loading trong khi điều hướng
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
      <div className="text-white text-center">
        <p>Đang tải...</p>
      </div>
    </div>
  );
}
