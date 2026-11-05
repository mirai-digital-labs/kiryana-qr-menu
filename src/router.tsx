import { useEffect, useState, type ReactNode } from "react";

export function navigate(to: string, replace = false) {
  if (replace) history.replaceState({}, "", to);
  else history.pushState({}, "", to);
  window.dispatchEvent(new Event("navigate"));
  window.scrollTo(0, 0);
}

export function usePath() {
  const [path, setPath] = useState(location.pathname);
  useEffect(() => {
    const f = () => setPath(location.pathname);
    window.addEventListener("popstate", f);
    window.addEventListener("navigate", f);
    return () => {
      window.removeEventListener("popstate", f);
      window.removeEventListener("navigate", f);
    };
  }, []);
  return path;
}

export function Link({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}
