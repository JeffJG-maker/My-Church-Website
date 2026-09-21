import { useEffect, useRef, useState } from "react";

function ScrollReveal({ children, className = "", delay = 0 }) {
    const elementRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = elementRef.current;

        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(element);
                }
            },
            {
                threshold: 0.15,
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={elementRef}
            style={{ transitionDelay: `${delay}ms` }}
            className={`
        transition-all duration-700 ease-out
        ${visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }
        ${className}
      `}
        >
            {children}
        </div>
    );
}

export default ScrollReveal;