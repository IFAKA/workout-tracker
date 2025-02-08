"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const AppDynamicHeader = () => {
  const isMobile = useIsMobile();

  // Define titles based on routes
  const routeTitles: { [key: string]: string } = {
    "/": "Home",
    "/routines/new": "New Routine",
    "/routines": "All Routines",
    "/statistics": "Workout Statistics",
  };

  // Get the title based on the current route
  const pathname = usePathname();
  const title = pathname ? routeTitles[pathname] : "Default Title";

  return (
    <header className="flex justify-between items-center gap-2 mb-2">
      {isMobile ? (
        <>
          <SidebarTrigger />
          <h1 className="font-bold">{title}</h1>
        </>
      ) : (
        <h1 className="font-bold">{title}</h1>
      )}
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};

export default AppDynamicHeader;
