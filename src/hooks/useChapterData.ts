import { useState, useEffect } from "react";
import type { Chapter } from "../types/chapter";
import { API_BASE_URL } from "../config/env";

export const useChapterData = (
  chapterId: string | undefined,
  id: string | undefined,
  options?: {
    view?: boolean;
  }
) => {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chapterList, setChapterList] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chapterId) return;

    const abortController = new AbortController();

    const fetchChapterData = async () => {
      try {
        const [chapterResponse, viewResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/chapter/${chapterId}`, {
            signal: abortController.signal,
          }),
          (async () => {
            console.log("callt his");

            if (!options?.view) return;
            return await fetch(`${API_BASE_URL}/chapter/${chapterId}/view/`, {
              method: "PUT",
              headers: {
                accept: "application/json",
              },
              credentials: "include",
              signal: abortController.signal,
            });
          })(),
        ]);

        if (!chapterResponse.ok) {
          throw new Error("Failed to fetch chapter data");
        }

        console.log(viewResponse);

        const data = await chapterResponse.json();
        const parsedData = {
          ...data,
          src_image: JSON.parse(data.src_image.replace(/'/g, '"')),
        };
        setChapter(parsedData);

        if (options?.view && viewResponse)
          console.log(`View response: ${viewResponse.status}`);

        const chaptersResponse = await fetch(
          `${API_BASE_URL}/chapter/?comic=${id}`,
          {
            headers: {
              accept: "application/json",
            },
            signal: abortController.signal,
          }
        );
        if (!chaptersResponse.ok) {
          throw new Error("Failed to fetch chapter list");
        }
        const chaptersData = await chaptersResponse.json();
        setChapterList(chaptersData);

        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError("Error loading chapter. Please try again later.");
        console.error("Error fetching chapter:", err);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchChapterData();

    return () => {
      abortController.abort();
    };
  }, [chapterId, id]);

  return {
    chapter,
    chapterList,
    loading,
    error,
  };
};
