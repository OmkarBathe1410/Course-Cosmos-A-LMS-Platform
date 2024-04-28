import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

interface ProtectedProps {
  children: JSX.Element;
}

export default function AdminProtected({ children }: ProtectedProps) {
  const { user } = useSelector((state: any) => state.auth);
  if (user) {
    const isAdmin = user?.role === "admin";
    return isAdmin ? children : redirect("/");
  }
}
