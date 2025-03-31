import { useState, useEffect, RefObject } from 'react';
import type { Chapter } from '../types/chapter';

export const useImageNavigation = (chapter: Chapter | null, containerRef: RefObject<HTMLDivElement>) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  const toggleHeaderVisibility = () => {
    setIsHeaderVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!chapter) return;

      switch (e.key) {
        case "ArrowLeft":
          setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "ArrowRight":
          setCurrentImageIndex((prev) =>
            prev < chapter.src_image.length - 1 ? prev + 1 : prev
          );
          break;
        case "Home":
          setCurrentImageIndex(0);
          break;
        case "End":
          setCurrentImageIndex(chapter.src_image.length - 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [chapter]);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (!chapter) return;

      e.preventDefault();
      if (e.deltaY > 0) {
        setCurrentImageIndex((prev) => {
          if (prev === -1) return 0;
          return prev < chapter.src_image.length - 1 ? prev + 1 : prev;
        });
      } else {
        setCurrentImageIndex((prev) => (prev > -1 ? prev - 1 : prev));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleScroll, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleScroll);
      }
    };
  }, [chapter, containerRef]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    if (!chapter) return;
    setCurrentImageIndex((prev) => {
      if (prev === -1) return 0;
      return prev < chapter.src_image.length - 1 ? prev + 1 : prev;
    });
  };

  const startReading = () => {
    setCurrentImageIndex(0);
  };

  return {
    currentImageIndex,
    isHeaderVisible,
    toggleHeaderVisibility,
    handlePrevImage,
    handleNextImage,
    startReading,
    setCurrentImageIndex,
  };
};