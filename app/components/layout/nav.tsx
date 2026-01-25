"use client";

import React, { useTransition } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Flex, Spin } from "antd";
import { useTheme } from "next-themes";
import { ThemeSwitch } from "../ui/theme-switch";
import { metaData } from "../../config";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [isPending] = useTransition();
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    const updateMenuColors = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const selectedLinks = document.querySelectorAll(
        ".ant-menu-item-selected .ant-menu-title-content a, .ant-menu-title-content a.ant-menu-item-selected"
      );
      
      selectedLinks.forEach((link) => {
        const element = link as HTMLElement;
        if (isDark) {
          element.style.setProperty("color", "rgba(255, 255, 255, 1)", "important");
        } else {
          element.style.setProperty("color", "rgba(0, 0, 0, 0.88)", "important");
        }
      });
    };

    const timer = setTimeout(updateMenuColors, 0);
    updateMenuColors();
    
    const observer = new MutationObserver(() => {
      setTimeout(updateMenuColors, 0);
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <Link
      href={href}
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
  const [mounted, setMounted] = useState(false);

  // Find the active key based on the current path
  const activeKey = navItems.find((item) => pathname.startsWith(item.key))?.key;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine current theme (considering system theme)
  // Default to light mode if theme is not yet determined
  const currentTheme = theme === "system" ? (systemTheme || "light") : (theme || "light");
  const isDark = currentTheme === "dark";
  
  // Get logo path based on theme
  const logoPath = isDark ? "/logo-dark.svg" : "/logo-light.svg";

  useEffect(() => {
    const updateMenuColors = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const selectedLinks = document.querySelectorAll(
        ".ant-menu-item-selected .ant-menu-title-content a, .ant-menu-title-content a.ant-menu-item-selected"
      );
      
      selectedLinks.forEach((link) => {
        const element = link as HTMLElement;
        if (isDark) {
          element.style.setProperty("color", "rgba(255, 255, 255, 1)", "important");
        } else {
          element.style.setProperty("color", "rgba(0, 0, 0, 0.88)", "important");
        }
      });
    };

    updateMenuColors();
    const observer = new MutationObserver(updateMenuColors);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true, 
      attributeFilter: ["class"] 
    });

    const themeObserver = new MutationObserver(updateMenuColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, [pathname]);

  return (
    <nav className="mb-8 py-5">
      <Flex justify="space-between" align="center">
        <Link href="/" className="text-xl font-sans font-bold text-inherit no-underline flex items-center gap-2">
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
