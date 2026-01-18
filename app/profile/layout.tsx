import type { Metadata } from "next";
import { metaData } from "../config";

export const metadata: Metadata = {
  title: "Profile",
  description: `Profile of ${metaData.name} - ${metaData.description}`,
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
