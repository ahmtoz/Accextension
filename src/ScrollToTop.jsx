import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  // Helper to parse pathname and hash from link href (supports HashRouter and BrowserRouter)
  const getHashAndPath = (href) => {
    let targetPathname = "";
    let targetHash = "";

    if (href.startsWith("#/")) {
      // HashRouter style link (e.g. #/about#section or #/#section)
      const pathAndHash = href.substring(1); // Remove the leading '#' -> "/about#section"
      const parts = pathAndHash.split("#");
      targetPathname = parts[0] || "/";
      targetHash = parts[1] ? `#${parts[1]}` : "";
    } else {
      // Standard or relative links
      try {
        const url = new URL(href, window.location.origin);
        targetPathname = url.pathname;
        targetHash = url.hash;
      } catch (e) {
        const parts = href.split("#");
        targetPathname = parts[0] || window.location.pathname;
        targetHash = parts[1] ? `#${parts[1]}` : "";
      }
    }

    return { pathname: targetPathname, hash: targetHash };
  };

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  useEffect(() => {
    const handleGlobalClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      if (anchor.target === "_blank") return;

      try {
        const url = new URL(anchor.href, window.location.origin);
        // Only handle internal links
        if (url.origin !== window.location.origin) return;

        const target = getHashAndPath(href);

        // If user clicks a link pointing to the exact current pathname and hash,
        // force scroll manually since React Router location won't change
        if (target.pathname === pathname && target.hash === hash) {
          if (target.hash) {
            const targetId = target.hash.replace("#", "");
            const el = document.getElementById(targetId);
            if (el) {
              e.preventDefault();
              el.scrollIntoView({ behavior: "smooth" });
            }
          } else {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      } catch (err) {
        // Ignore URL parsing errors
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;