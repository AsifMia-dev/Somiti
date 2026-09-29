import Sidebar from "../Sidebar";

function Layout({ children }) {
  return (
    <div className="w-full min-h-screen grid grid-cols-[232px_1fr]">
      <Sidebar />
      <main className="p-8 px-11 overflow-auto">{children}</main>
    </div>
  );
}

export default Layout;