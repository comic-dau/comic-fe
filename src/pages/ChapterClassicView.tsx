// Không cần import useEffect nữa
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useChapterData } from "../hooks/useChapterData";
import { useChapterNavigation } from "../hooks/useChapterNavigation";
import { useReadingMode } from "../hooks/useReadingMode";
import { useImagePreloader, getPreloadedImage } from "../utils/imageUtils";
import { UIModeSwitcher } from "../components/UIModeSwitcher";
import { ChapterNavigation } from "../components/ChapterNavigation";

export function ChapterClassicView() {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const { chapter, chapterList, loading, error } = useChapterData(chapterId, id);
  const { isLoading: isLoadingImages, progress } = useImagePreloader(chapter?.src_image);
  const { handlePrevChapter, handleNextChapter } = useChapterNavigation(chapterList, id);
  const { setReadingMode } = useReadingMode();

  // Header đã được ẩn trong ChapterRouter

  // Không cần tự động chuyển hướng nữa vì đã có ChapterRouter

  // Chuyển đến chế độ Phone và chuyển hướng đến trang ChapterDetail
  const switchToPhoneMode = () => {
    if (chapter) {
      setReadingMode('phone');
      const urlName = encodeURIComponent(
        chapter.comic_info.name.toLowerCase().replace(/\s+/g, "-")
      );
      // Điều hướng trực tiếp đến trang Phone UI
      navigate(`/comic/${urlName}/${id}/chapter/${chapter.number}/${chapterId}/view`);
    }
  };

  const urlName = encodeURIComponent(
    chapter?.comic_info.name.toLowerCase().replace(/\s+/g, "-") ?? ""
  );
  const hasPrevChapter = chapterList.some(
    (ch) => ch.number === (chapter?.number ?? 1) - 1
  );
  const hasNextChapter = chapterList.some(
    (ch) => ch.number === (chapter?.number ?? 1) + 1
  );

  const isInitialLoading = loading || (chapter && isLoadingImages);

  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <div className="text-white text-center">
          <p>Đang tải dữ liệu...</p>
          {isLoadingImages && (
            <>
              <p className="mt-2">Đang tải ảnh... {progress}%</p>
              <div className="w-64 h-2 bg-gray-700 rounded-full mt-2">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">
            {error || "Chapter not found"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Link
              to={`/comic/${urlName}/${chapter.comic_info.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <ChevronLeft size={20} />
              Quay lại
            </Link>

            <button
              onClick={() => handlePrevChapter(chapter)}
              disabled={!hasPrevChapter}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Chương trước"
            >
              <ChevronLeft size={20} />
              Chương trước
            </button>

            <button
              onClick={() => handleNextChapter(chapter)}
              disabled={!hasNextChapter}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Chương sau"
            >
              Chương sau
              <ChevronRight size={20} />
            </button>
          </div>

          <UIModeSwitcher
            currentMode="classic"
            onSwitchToPhone={switchToPhoneMode}
            onSwitchToClassic={() => {}}
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 p-4 rounded-lg mb-8">
            <h1 className="text-2xl font-bold mb-2 text-center">
              {chapter.comic_info.name}
            </h1>
            <h2 className="text-xl mb-4 text-center">
              Chapter {chapter.number}: {chapter.title}
            </h2>

            <ChapterNavigation
              chapter={chapter}
              hasPrevChapter={hasPrevChapter}
              hasNextChapter={hasNextChapter}
              onPrevChapter={handlePrevChapter}
              onNextChapter={handleNextChapter}
            />
          </div>

          {/* Hiển thị tất cả ảnh theo chiều dọc */}
          <div className="space-y-4">
            {chapter.src_image.map((imgUrl, index) => {
              const preloadedCanvas = getPreloadedImage(imgUrl);
              return (
                <div key={index} className="flex justify-center">
                  {preloadedCanvas ? (
                    <img
                      src={preloadedCanvas.toDataURL()}
                      alt={`Trang ${index + 1}`}
                      className="max-w-full"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-gray-800 p-4 rounded-lg mt-8">
            <ChapterNavigation
              chapter={chapter}
              hasPrevChapter={hasPrevChapter}
              hasNextChapter={hasNextChapter}
              onPrevChapter={handlePrevChapter}
              onNextChapter={handleNextChapter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
