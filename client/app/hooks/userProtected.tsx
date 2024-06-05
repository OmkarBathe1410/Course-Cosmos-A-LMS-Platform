import { redirect } from "next/navigation";
import UserAuth from "./userAuth";

interface ProtectedProps {
  children: JSX.Element;
}

export default function Protected({ children }: ProtectedProps) {
  const isAuthenticated = UserAuth();

  return isAuthenticated ? children : redirect("/");
}
