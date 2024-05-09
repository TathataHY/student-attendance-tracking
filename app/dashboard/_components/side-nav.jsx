"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { GraduationCap, Hand, LayoutIcon, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SideNav = () => {
  const menu_list = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutIcon,
      href: "/dashboard",
    },
    {
      id: 2,
      name: "Students",
      icon: GraduationCap,
      href: "/dashboard/students",
    },
    {
      id: 3,
      name: "Attendances",
      icon: Hand,
      href: "/dashboard/attendances",
    },
    {
      id: 4,
      name: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ];

  const pathname = usePathname();
  const { user } = useKindeBrowserClient();

  return (
    <>
      <nav className="border shadow-md h-screen p-5">
        <header>
          <Image
            src="/logoipsum.svg"
            alt="logo"
            width={180}
            height={50}
            className="m-auto"
            style={{ width: "auto", height: "auto" }}
            priority
          />

          <hr className="my-5" />
        </header>

        <main>
          <ul>
            {menu_list.map((menu) => (
              <li key={menu.id}>
                <Link
                  href={menu.href}
                  className={`flex items-center gap-4 p-2 rounded-md ${
                    pathname === menu.href
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <menu.icon />
                  <span>{menu.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <hr className="my-5" />
        </main>

        <footer className="bottom-5 fixed">
          <div className=" p-2 text-right">
            <ModeToggle />
          </div>
          <hr className="my-5" />

          <div className="flex gap-2 items-center p-2">
            <Image src={user?.picture} alt="user" width={35} height={35} />
            <div>
              <span className="block font-bold text-sm">
                {user?.given_name} {user?.family_name}
              </span>
              <span className="block text-xs">{user?.email}</span>
            </div>
          </div>

          <hr className="my-5" />

          <div className="text-sm text-center text-gray-500 dark:text-gray-300">
            Powered by{" "}
            <a
              href="https://kinde.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Kinde
            </a>
          </div>
        </footer>
      </nav>
    </>
  );
};
