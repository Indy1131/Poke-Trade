import { ReactNode } from "react";

type props = {
  children: ReactNode;
  className: string;
};

export default function Card({ children, className }: props) {
  return (
    <div
      className={`bg-white z-4 rounded-2xl flex flex-col items-center p-8 ${className}`}
      style={{boxShadow: "0 0px 30px 0px #ECB5BC"}}
    >
      {children}
    </div>
  );
}
