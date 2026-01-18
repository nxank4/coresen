"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Flex } from "antd";
import { ThemeSwitch } from "../ui/theme-switch";
import { metaData } from "../../config";

const navItems = [
  { label: <Link href="/profile">Profile</Link>, key: "/profile" },
  { label: <Link href="/blog">Blog</Link>, key: "/blog" },
  { label: <Link href="/projects">Projects</Link>, key: "/projects" },
  { label: <Link href="/photos">Photos</Link>, key: "/photos" },
];

export function Navbar() {
  const pathname = usePathname();

  // Find the active key based on the current path
  const activeKey = navItems.find((item) => pathname.startsWith(item.key))?.key;

  return (
    <nav className="mb-8 py-5">
      <Flex justify="space-between" align="center">
        <Link href="/" className="text-xl font-heading font-bold text-inherit no-underline">
          {metaData.title}
        </Link>
        <Flex align="center" gap="middle">
          <Menu
            mode="horizontal"
            selectedKeys={activeKey ? [activeKey] : []}
            items={navItems}
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
