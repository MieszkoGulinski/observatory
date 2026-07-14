import { NavLink } from "react-router";
import { buttonVariants } from "./components/ui/button";

function NavButton({ to, children }: { to: string; children: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? buttonVariants({ variant: "default", size: "sm" })
          : buttonVariants({ variant: "secondary", size: "sm" })
      }
    >
      {children}
    </NavLink>
  );
}

function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="max-w-screen-2xl mx-auto p-4">
      <div className="flex gap-2 pb-4">
        <NavButton to={"/"}>Scheduler</NavButton>
        <NavButton to={"/status"}>Status</NavButton>
        <NavButton to={"/catalog"}>Catalog</NavButton>
      </div>
      {children}
    </div>
  );
}

export default Layout;
