import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import { ReactElement } from "react";
import Footer from "../components/Footer";

export default function Layout({ children }: { children?: ReactElement }) {
  return (
    <div className="w-full h-screen flex flex-col font-family-main">
      <Nav />
      <div className="overflow-hidden flex flex-1 flex-col">
        <div className="overflow-scroll flex-1 flex flex-col">
          {children ? children : <Outlet />}
          <Footer />
        </div>
      </div>
    </div>
  );
}
