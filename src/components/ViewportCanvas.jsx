import { useRef, Suspense } from "react";
import { useInView } from "framer-motion";
import CyberSkeleton from "./CyberSkeleton";

export default function ViewportCanvas({ children, title }) {
  const ref = useRef(null);
  // Checked when element is close to viewport. Margin ensures it loads slightly ahead of scroll.
  const isInView = useInView(ref, { margin: "400px 0px 400px 0px", once: true });

  return (
    <div ref={ref} className="w-full h-full min-h-[380px] relative">
      {isInView ? (
        <Suspense fallback={<CyberSkeleton title={title} />}>
          {children}
        </Suspense>
      ) : (
        <CyberSkeleton title={title} />
      )}
    </div>
  );
}
