import { Outlet } from "react-router-dom";
import BackgroundFX from "../fx/BackgroundFX";

export default function AuthShellLayout() {
  return (
    <div className="min-h-dvh relative overflow-hidden">
      <BackgroundFX />
      <main className="relative z-10 mx-auto w-full max-w-[1100px] px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

