import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const followerRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const followerPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const follower = followerRef.current;

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (dot) {
        dot.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
      }
    };

    function animate() {
      followerPos.current.x +=
        (posRef.current.x - followerPos.current.x) * 0.12;
      followerPos.current.y +=
        (posRef.current.y - followerPos.current.y) * 0.12;
      if (follower) {
        follower.style.transform = `translate(${followerPos.current.x - 18}px, ${followerPos.current.y - 18}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    }

    const onEnterLink = () => {
      if (dot) dot.style.transform += " scale(5.5)";
      if (follower) follower.style.opacity = "10";
    };
    const onLeaveLink = () => {
      if (follower) follower.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    const links = document.querySelectorAll("a, button");
    links.forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      links.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}
