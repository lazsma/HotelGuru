import Header, { type HeaderProps } from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout({ user }: HeaderProps) {
  return (
    <>
      <Header user={user} />
      <main style={{ padding: "20px" }}>
        <Outlet /> {/* pages render here */}
      </main>
    </>
  );
}
