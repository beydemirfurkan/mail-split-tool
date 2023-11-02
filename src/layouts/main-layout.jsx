import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">  
        <Sidebar />
        <main className="flex-1 flex items-center justify-center p-6">
            <div className="w-full flex justify-center mx-auto">
                <Outlet />
            </div>
        </main>
    </div>
  );
}
