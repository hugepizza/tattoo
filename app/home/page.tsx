"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const bgWidth = 1920;
      const diff = bgWidth - containerWidth;

      const animationStyle = `
        @keyframes horizontalScroll {
          0% { background-position: 0 0; }
          100% { background-position: -${diff}px 0; }
        }
      `;

      const styleEl = document.createElement("style");
      document.head.appendChild(styleEl);
      styleEl.textContent = animationStyle;

      return () => {
        document.head.removeChild(styleEl);
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-grow flex-col w-full h-screen"
      style={{
        backgroundImage: "url(http://localhost:3000/logo@2.png)",
        backgroundRepeat: "repeat",
        backgroundSize: "contain",
        animation: "horizontalScroll 10s infinite alternate", // 10s means it will take 10 seconds to complete one animation cycle
      }}
    >
      <div
        className="flex justify-center items-center w-full h-full"
        // style={{
        //   backgroundColor: "rgba(0,0,0,0.1)",
        // }}
      >
        <div className="card flex-col items-center justify-start py-16 p-4 space-y-6">
          <h1 className="text-3xl font-semibold text-blue-600">
            Welcome To AI-TATTOO
          </h1>
          <h2 className="text-2xl text-gray-700">
            <Link href={"/workspace"}>Get Started</Link>
          </h2>
        </div>
      </div>
    </div>
  );
}
