import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately when route changes
    // Use instant scroll to prevent the "jumping to bottom" issue
    window.scrollTo(0, 0);
    
    // Also ensure document body is scrolled to top
    if (document.body.scrollTop !== 0) {
      document.body.scrollTop = 0;
    }
    
    // For some browsers, also scroll the document element
    if (document.documentElement.scrollTop !== 0) {
      document.documentElement.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
