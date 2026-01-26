"use client";

import React, { useTransition, useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Flex, Spin } from "antd";
import { useTheme } from "next-themes";
import { ThemeSwitch } from "../ui/theme-switch";
import { useNavigation } from "../ui/NavigationContext";
import { metaData } from "../../config";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const { setNavigating } = useNavigation();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only trigger navigation state if navigating to a different page
    if (pathname !== href && !pathname.startsWith(href + "/")) {
      setNavigating(true);
      startTransition(() => {
        // Navigation will happen automatically via Next.js Link
      });
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={isActive ? "ant-menu-item-selected nav-link-active" : "nav-link"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        textDecoration: "none",
      }}
    >
      {isPending && <Spin size="small" />}
      {children}
    </Link>
  );
}

const navItems = [
  { label: <NavLink href="/profile">Profile</NavLink>, key: "/profile" },
  { label: <NavLink href="/blog">Blog</NavLink>, key: "/blog" },
  { label: <NavLink href="/projects">Projects</NavLink>, key: "/projects" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, systemTheme } = useTheme();
  const { setNavigating } = useNavigation();
  const [mounted, setMounted] = useState(false);

  // Find the active key based on the current path
  const activeKey = navItems.find((item) => pathname.startsWith(item.key))?.key;

  // Determine current theme and logo path
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? (systemTheme || "light") : (theme || "light");
  const isDark = currentTheme === "dark";
  const logoPath = isDark ? "/logo-dark.svg" : "/logo-light.svg";

  const handleLogoClick = () => {
    if (pathname !== "/") {
      setNavigating(true);
    }
  };

  return (
    <nav className="mb-8 py-5">
      <Flex justify="space-between" align="center">
        <Link 
          href="/" 
          onClick={handleLogoClick}
          className="text-xl font-sans font-bold text-inherit no-underline flex items-center gap-2 hover:text-inherit transition-opacity duration-200 hover:opacity-70"
        >
          {mounted && (
            <Image
              src={logoPath}
              alt={metaData.title}
              width={24}
              height={24}
              className="w-6 h-6"
            />
          )}
          {!mounted && (
            <div className="w-6 h-6" />
          )}
          {metaData.title}
        </Link>
        <Flex align="center" gap="middle">
          <Menu
            mode="horizontal"
            selectedKeys={activeKey ? [activeKey] : []}
            items={navItems}
            theme={undefined}
            style={{ 
                borderBottom: "none", 
                backgroundColor: "transparent",
                minWidth: "300px",
                justifyContent: "flex-end"
            }}
          />
          <ThemeSwitch />
        </Flex>
      </Flex>
    </nav>
  );
}
