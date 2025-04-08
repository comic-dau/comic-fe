import { useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useChapterData } from "../hooks/useChapterData";
import { useChapterNavigation } from "../hooks/useChapterNavigation";
import { useImageNavigation } from "../hooks/useImageNavigation";
import { useImagePreloader, getPreloadedImage } from "../utils/imageUtils";

export function ChapterDetail() {
  const { name, id, number, chapterId } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { chapter, chapterList, loading, error } = useChapterData(chapterId, id);
  const { isLoading: isLoadingImages, progress } = useImagePreloader(chapter?.src_image);
  const { handlePrevChapter, handleNextChapter } = useChapterNavigation(chapterList, id);
  const {
    currentImageIndex,
    isHeaderVisible,
    toggleHeaderVisibility,
    handlePrevImage,
    handleNextImage,
    startReading,
    setCurrentImageIndex,
  } = useImageNavigation(chapter, containerRef);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "none";
    }
    return () => {
      if (header) {
        header.style.display = "";
      }
    };
  }, []);

  useEffect(() => {
    if (!chapter || currentImageIndex === -1 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const preloadedCanvas = getPreloadedImage(chapter.src_image[currentImageIndex]);
    if (preloadedCanvas) {
      canvas.width = preloadedCanvas.width;
      canvas.height = preloadedCanvas.height;
      ctx.drawImage(preloadedCanvas, 0, 0);
    }
  }, [chapter, currentImageIndex]);

  const urlName = encodeURIComponent(
    chapter?.comic_info.name.toLowerCase().replace(/\s+/g, "-") ?? ""
  );
  const hasPrevChapter = chapterList.some(
    (ch) => ch.number === (chapter?.number ?? 1) - 1
  );
  const hasNextChapter = chapterList.some(
    (ch) => ch.number === (chapter?.number ?? 1) + 1
  );

  console.log(`Start reading ${name} - Chapter ${number}`);
  const isInitialLoading = loading || (chapter && isLoadingImages);

  function handelMouseClickImage(e: React.MouseEvent<HTMLDivElement>) {
    const containerWidth = e.currentTarget.offsetWidth;
    const clickX = e.clientX;

    if (clickX < containerWidth / 3) {
      handleNextImage();
    } else if (clickX > (2 * containerWidth) / 3) {
      handlePrevImage();
    } else {
      toggleHeaderVisibility();
    }
  }

  return (
    <>
      {isInitialLoading && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          {isLoadingImages && (
            <div className="text-white text-center">
              <p>Đang tải ảnh... {progress}%</p>
              <div className="w-64 h-2 bg-gray-700 rounded-full mt-2">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
      {(error || !chapter) && !isInitialLoading && (
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
      )}

      <div className={`min-h-screen bg-gray-900 text-white ${(!isInitialLoading && chapter) ? "" : "hidden"}`} ref={containerRef}>
        {!isInitialLoading &&
          chapter &&
          (currentImageIndex === -1 ? (
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center mb-8">
                <Link
                  to={`/comic/${urlName}/${chapter?.comic_info.id}`}
                  state={{ comicId: chapter?.comic_info.id }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <ChevronLeft size={20} />
                  Quay lại
                </Link>
              </div>

              <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-2">
                  {chapter?.comic_info.name}
                </h1>
                <h2 className="text-xl mb-8">
                  Chapter {chapter?.number}: {chapter?.title}
                </h2>

                <div className="space-y-4">
                  <button
                    onClick={startReading}
                    className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
                  >
                    Bắt đầu đọc
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => chapter && handlePrevChapter(chapter)}
                      className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      disabled={!hasPrevChapter}
                    >
                      <ChevronLeft size={20} />
                      Chương trước
                    </button>
                    <button
                      onClick={() => chapter && handleNextChapter(chapter)}
                      className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      disabled={!hasNextChapter}
                    >
                      Chương sau
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div
                className={`fixed top-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm p-2 z-10 transition-transform duration-300 ${
                  isHeaderVisible ? "translate-y-0" : "-translate-y-full"
                }`}
              >
                <div className="container mx-auto flex items-center justify-between">
                  <button
                    onClick={() => setCurrentImageIndex(-1)}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Quay lại
                  </button>
                  <div className="text-center">
                    <h1 className="text-sm font-bold">
                      {chapter?.comic_info.name}
                    </h1>
                    <p className="text-xs">Chapter {chapter?.number}</p>
                  </div>
                </div>
              </div>

              <div
                className="mx-auto flex justify-center items-center min-h-[calc(100vh-2.5rem)]"
                onClick={(e) => handelMouseClickImage(e)}
                onContextMenu={(e) => e.preventDefault()}
              >
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[calc(100vh-3px)] object-contain"
                />
              </div>

              <div
                className={`fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm transition-transform duration-300 hover:p-4 z-10 ${
                  isHeaderVisible ? "translate-y-0" : "translate-y-full"
                }`}
              >
                <div className="container mx-auto flex justify-center items-center gap-4">
                  <button
                    onClick={handleNextImage}
                    disabled={
                      currentImageIndex === (chapter?.src_image.length ?? 1) - 1
                    }
                    className="p-2 bg-blue-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                    title="Previous page"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <div className="text-sm font-medium">
                    {currentImageIndex + 1}/{chapter?.src_image.length}
                  </div>
                  <button
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                    className="p-2 bg-blue-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                    title="Next page"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </>
          ))}
      </div>
    </>
  );
}