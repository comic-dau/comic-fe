import { useEffect, useState } from 'react';

// Cache for storing preloaded images
const imageCache = new Map<string, HTMLCanvasElement>();

export const preloadImages = async (imageUrls: string[]): Promise<void> => {
  const loadPromises = imageUrls.map(async (url) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      await restoreShuffledImage(ctx, canvas, url);
      imageCache.set(url, canvas);
    } catch (error) {
      console.error(`Error preloading image ${url}:`, error);
    }
  });

  await Promise.all(loadPromises);
};

export const getPreloadedImage = (url: string): HTMLCanvasElement | undefined => {
  return imageCache.get(url);
};

export const restoreShuffledImage = async (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  imageUrl: string
) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = `https://${imageUrl}`;
  });

  canvas.width = img.width;
  canvas.height = img.height;
  
  const w = Math.floor(img.width / 4);
  const h = Math.floor(img.height / 4);
  
  // const indices = [0, 7, 6, 2, 13, 12, 9, 1, 10, 15, 4, 5, 8, 11, 14, 3];
  const indices = [0, 5, 15, 13, 3, 12, 9, 6, 11, 1, 4, 2, 14, 7, 8, 10];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parts: { x: any; y: any; }[] = [];
  
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      parts.push({ x: i * w, y: j * h });
    }
  }

  const restoreIndices = new Array(indices.length);
  indices.forEach((val, idx) => restoreIndices[val] = idx);

  ctx.imageSmoothingEnabled = false;
  restoreIndices.forEach((origIdx, newIdx) => {
    const { x: sx, y: sy } = parts[origIdx];
    const { x: dx, y: dy } = parts[newIdx];
    ctx.drawImage(img, sx, sy, w, h, dx, dy, w, h);
  });
};

export const loadOriginalImage = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  imageUrl: string
) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
  img.src = `https://${imageUrl}`;
};

export const useImagePreloader = (imageUrls: string[] | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!imageUrls?.length) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    const loadImages = async () => {
      const total = imageUrls.length;
      let loaded = 0;

      const loadPromises = imageUrls.map(async (url) => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          await restoreShuffledImage(ctx, canvas, url);
          imageCache.set(url, canvas);
          
          if (mounted) {
            loaded++;
            setProgress(Math.round((loaded / total) * 100));
          }
        } catch (error) {
          console.error(`Error preloading image ${url}:`, error);
        }
      });

      await Promise.all(loadPromises);
      if (mounted) {
        setIsLoading(false);
      }
    };

    loadImages();

    return () => {
      mounted = false;
    };
  }, [imageUrls]);

  return { isLoading, progress };
};