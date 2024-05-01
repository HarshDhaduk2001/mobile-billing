"use client";
import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import DashboardIcon from "@/assets/icons/common/DashboardIcon";
import NewIcon from "@/assets/icons/common/NewIcon";
import OldIcon from "@/assets/icons/common/OldIcon";
import ReportsIcon from "@/assets/icons/common/ReportsIcon";
import SettingsIcon from "@/assets/icons/common/SettingsIcon";

const Sidebar = () => {
  const pathname = usePathname();
  const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
    { name: "Add new", href: "/add-new", icon: <NewIcon /> },
    { name: "Old one", href: "/old-one", icon: <OldIcon /> },
    { name: "Reports", href: "/reports", icon: <ReportsIcon /> },
    { name: "Settings", href: "/", icon: <SettingsIcon /> },
  ];
  return (
    <div className="flex flex-col items-center justify-start w-full h-full gap-5 border-r text-darkCharcoal">
      <span className="flex items-center justify-center w-full h-[10%] mb-[-12px] text-primary font-medium text-[24px] border-b">
        {/* &#128512; */}
        Mobile Billing
      </span>
      {sidebarItems.map((item: { name: string; href: string; icon: any }) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center justify-center lg:justify-start gap-2 w-full h-[10%] px-2 lg:px-4 border-l-[4px] hover:bg-whiteSmoke hover:border-primary ${
            pathname === `${item.href}`
              ? "border-primary bg-whiteSmoke"
              : "border-pureWhite"
          }`}
        >
          {item.icon}
          <span className="hidden lg:block">{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
