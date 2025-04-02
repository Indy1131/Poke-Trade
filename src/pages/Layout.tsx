import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import { ReactElement } from "react";
import Footer from "../components/Footer";

export default function Layout({ children }: { children?: ReactElement }) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Nav />
      {children ? children : <Outlet />}
      <Footer />
    </div>
  );
}
