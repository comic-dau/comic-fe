export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const SRC_GITHUB_PUBLIC_URL = import.meta.env.SRC_GITHUB_PUBLIC_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is not defined');
}
