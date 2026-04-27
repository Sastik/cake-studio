import { Outlet } from "react-router-dom";
import Shell from "./Shell";

export default function ShellLayout() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}

