"use client";

import React from "react";
import { ConfigProvider, theme as antTheme } from "antd";
import { useTheme } from "next-themes";

export function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm:
          isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorText: isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.88)",
          colorTextSecondary: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.45)",
          colorTextTertiary: isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.25)",
          colorTextHeading: isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.88)",
        },
        components: {
          Menu: {
            itemColor: isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.88)",
            itemSelectedColor: isDark ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 0.88)",
            itemHoverColor: isDark ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 0.88)",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
