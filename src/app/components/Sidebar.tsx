"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChartLine, Dumbbell, Home, PlusCircleIcon } from "lucide-react";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/", // Root URL for home
    icon: Home,
  },
  {
    title: "Routines", // New workouts menu item
    url: "/routines", // Route for workouts
    icon: Dumbbell, // Using a dumbbell icon to represent workouts
  },
  {
    title: "New Routine",
    url: "/routines/new", // Example route for Inbox
    icon: PlusCircleIcon,
  },
  {
    title: "Statistics", // Example route for Statistics
    url: "/statistics", // Example route for Calendar
    icon: ChartLine,
  },
];

export function AppSidebar() {
  const { setOpenMobile } = useSidebar();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
