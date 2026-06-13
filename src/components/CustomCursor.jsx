import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const followerRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const followerPos = useRef({ x: -100, y: -100 });
  const isHovered = useRef(false);
  const isOverInput = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const follower = followerRef.current;

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    function animate() {
      // 1. Move custom-cursor dot instantly using hardware-accelerated translate3d (gentle scale=1.5 on hover)
      if (dot) {
        dot.style.transform = `translate3d(${posRef.current.x - 4}px, ${posRef.current.y - 4}px, 0) scale(${isHovered.current ? 1.5 : 1})`;
        dot.style.opacity = isOverInput.current ? "0" : "1";
      }
      
      // 2. Smoothly interpolate follower position and scale up gently to 1.2 on hover
      followerPos.current.x += (posRef.current.x - followerPos.current.x) * 0.18;
      followerPos.current.y += (posRef.current.y - followerPos.current.y) * 0.18;
      
      if (follower) {
        follower.style.transform = `translate3d(${followerPos.current.x - 14}px, ${followerPos.current.y - 14}px, 0) scale(${isHovered.current ? 1.2 : 1})`;
        follower.style.opacity = isOverInput.current ? "0" : "1";
      }
      
      rafRef.current = requestAnimationFrame(animate);
    }

    // Dynamic event delegation for input visibility hiding and button hover glows
    const onMouseOver = (e) => {
      const target = e.target;
      if (target && target.closest("input, textarea, select")) {
        isOverInput.current = true;
      } else if (target && target.closest("a, button, [role='button']")) {
        isHovered.current = true;
        if (follower) {
          follower.style.borderColor = "rgba(57, 255, 20, 0.8)";
          follower.style.boxShadow = "0 0 6px rgba(57, 255, 20, 0.25)";
        }
      }
    };

    const onMouseOut = (e) => {
      const target = e.target;
      if (target && target.closest("input, textarea, select")) {
        isOverInput.current = false;
      } else if (target && target.closest("a, button, [role='button']")) {
        isHovered.current = false;
        if (follower) {
          follower.style.borderColor = "rgba(57, 255, 20, 0.4)";
          follower.style.boxShadow = "0 0 8px rgba(0, 229, 255, 0.15)";
        }
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    window.addEventListener("mouseout", onMouseOut, { passive: true });
    
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}
