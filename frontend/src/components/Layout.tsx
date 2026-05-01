import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Layout() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <main style={{ padding: "20px" }}>
        <Outlet context={{ user }} /> {/* pages render here */}
      </main>
    </>
  );
}
