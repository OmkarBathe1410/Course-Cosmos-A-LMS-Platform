import { redirect } from "next/navigation";
import userAuth from "./userAuth";

interface ProtectedProps {
  children: JSX.Element;
}

export default function Protected({ children }: ProtectedProps) {
  const isAuthenticated = userAuth();

  return isAuthenticated ? children : redirect("/");
}
