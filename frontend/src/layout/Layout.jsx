import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p className="mb-0">&copy; 2025 SailGo. All rights reserved.</p>
      </footer>
    </>
  );
}
