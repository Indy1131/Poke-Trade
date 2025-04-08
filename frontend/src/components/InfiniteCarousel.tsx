import { ReactNode, useEffect } from "react";

type props = {
  children: ReactNode;
  className: string;
};

export default function InfiniteCarousel({ children, className }: props) {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      .infinite-scroll {
        transform: translateX(0);
        animation: scroll 35s linear infinite;
        width: max-content;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className={`flex relative overflow-hidden ${className}`}>
      <div className="absolute h-full w-[100px] bg-gradient-to-r from-white to-transparent z-2" />
      <div className="w-full">
        <div className="flex infinite-scroll">
          {children}
          {children}
        </div>
      </div>
      <div className="absolute right-0 h-full w-[100px] bg-gradient-to-l from-white to-transparent z-2" />
    </div>
  );
}
