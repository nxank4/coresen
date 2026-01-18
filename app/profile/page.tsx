"use client";

import React from "react";
import Link from "next/link";
import { Typography, Avatar, Flex, Space } from "antd";
import {
  FaGithub,
  FaLinkedinIn,
  FaKaggle,
  FaYoutube,
} from "react-icons/fa6";
import { TbMailFilled } from "react-icons/tb";
import { socialLinks, metaData } from "../config";

const { Title, Text, Paragraph } = Typography;

function SocialLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
      aria-label={label}
    >
      <Icon className="text-xl" />
    </a>
  );
}

export default function Profile() {
  return (
    <section>
      <Flex
        align="center"
        justify="space-between"
        wrap="wrap-reverse"
        style={{ marginBottom: 64 }}
        gap="large"
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <Title level={1} style={{ marginTop: 0, marginBottom: 16 }} className="text-neutral-900 dark:text-neutral-100">
            {metaData.name}
          </Title>
          <Text
            type="secondary"
            style={{ display: "block", marginBottom: 24, fontSize: 18 }}
            className="text-neutral-600 dark:text-neutral-300"
          >
            Data Scientist & Machine Learning Engineer
          </Text>
          <Paragraph
            style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}
            className="text-neutral-800 dark:text-neutral-200"
          >
            Explaining complex AI topics through{" "}
            <Link href="/blog" className="link-animated text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200">
              writing
            </Link>{" "}
            and{" "}
            <a
              href={socialLinks.youtube || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="link-animated text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              video
            </a>
            .
          </Paragraph>
          <Space size="large" wrap>
            <SocialLink href={socialLinks.github} icon={FaGithub} label="GitHub" />
            <SocialLink href={socialLinks.linkedin} icon={FaLinkedinIn} label="LinkedIn" />
            <SocialLink href={socialLinks.kaggle} icon={FaKaggle} label="Kaggle" />
            <SocialLink href={socialLinks.youtube} icon={FaYoutube} label="YouTube" />
            <SocialLink href={socialLinks.email} icon={TbMailFilled} label="Email" />
          </Space>
        </div>
        <div
          style={{ marginBottom: 16 }}
          onMouseEnter={(e) => {
            const img = e.currentTarget.querySelector(".ant-avatar img") as HTMLImageElement;
            if (img) img.style.filter = "grayscale(0%)";
          }}
          onMouseLeave={(e) => {
            const img = e.currentTarget.querySelector(".ant-avatar img") as HTMLImageElement;
            if (img) img.style.filter = "grayscale(100%)";
          }}
        >
          <Avatar
            size={140}
            src="/profile.png"
            alt={metaData.name}
            style={{ filter: "grayscale(100%)", transition: "filter 0.3s" }}
          />
        </div>
      </Flex>
    </section>
  );
}
