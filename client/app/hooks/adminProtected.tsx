import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

interface ProtectedProps {
  children: JSX.Element;
}

export default function AdminProtected({ children }: ProtectedProps) {
  const { user } = useSelector((state: any) => state.auth);
  let isAdmin = false;
  if (user) {
    isAdmin = user?.role === "admin";
  }
  return isAdmin ? children : redirect("/");
}
