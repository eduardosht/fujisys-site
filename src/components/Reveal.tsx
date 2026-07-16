import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const element = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = element.current;
    if (!node || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={element} className={`reveal ${className}`.trim()} data-visible={visible}>{children}</div>;
}
