"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";

export const Header = () => {
  const { user } = useKindeBrowserClient();

  return (
    <>
      <header className="w-full shadow-sm p-4 border flex justify-between items-center">
        <div></div>
        <div>
          <Image src={user?.picture} alt="logo" width={35} height={35} />
        </div>
      </header>
    </>
  );
};
