"use client";

import React from "react";
import {
  FaGithub,
  FaInstagram,
  FaRss,
  FaLinkedinIn,
  FaKaggle,
} from "react-icons/fa6";
import { TbMailFilled } from "react-icons/tb";
import { metaData, socialLinks } from "../../config";
import { Layout, Space, Typography } from "antd";

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const YEAR = new Date().getFullYear();

function SocialLink({ href, icon: Icon }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: "1.2rem", color: "inherit" }}>
      <Icon />
    </a>
  );
}

function SocialLinks() {
  return (
    <Space size="middle">
      <SocialLink href={socialLinks.github} icon={FaGithub} />
      <SocialLink href={socialLinks.instagram} icon={FaInstagram} />
      <SocialLink href={socialLinks.linkedin} icon={FaLinkedinIn} />
      <SocialLink href={socialLinks.kaggle} icon={FaKaggle} />
      <SocialLink href={socialLinks.email} icon={TbMailFilled} />
      <a href="/rss.xml" target="_self" style={{ fontSize: "1.2rem", color: "inherit" }}>
        <FaRss />
      </a>
    </Space>
  );
}

export default function Footer() {
  return (
    <AntFooter style={{ background: "transparent", textAlign: "center", padding: "24px 0" }}>
      <Space orientation="vertical" size="small" style={{ width: "100%" }}>
        <SocialLinks />
        <Text type="secondary" className="text-neutral-600 dark:text-neutral-300">
          © {YEAR} <Link href="/" className="text-inherit">{metaData.title}</Link>
        </Text>
      </Space>
    </AntFooter>
  );
}
