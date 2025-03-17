import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cookies = params.get('cookies');

    if (cookies) {
      document.cookie = decodeURIComponent(cookies);
      localStorage.setItem('cookies', decodeURIComponent(cookies)); // Save cookies to local storage
    }

    console.log('cookies', cookies);

    navigate('/');
  }, [navigate]);

  return null;
}
