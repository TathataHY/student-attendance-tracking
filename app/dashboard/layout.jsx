import { Header } from "./_components/header";
import { SideNav } from "./_components/side-nav";

export const revalidate = 10 * 60;

export default function DashboardLayout({ children }) {
  return (
    <>
      <div className="md:w-64 fixed hidden md:block">
        <SideNav />
      </div>
      <div className="md:ml-64">
        <Header />
        {children}
      </div>
    </>
  );
}
