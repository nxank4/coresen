"use client";

import React, { Suspense, useTransition, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Typography, Card, Flex, Button, Space, Spin } from "antd";
import { formatDate } from "app/lib/utils";

const { Title, Text, Paragraph } = Typography;

// Lazy load MorphingBlob3D to avoid blocking initial render
const MorphingBlob3D = dynamic(
  () => import("./MorphingBlob3D").then((mod) => ({ default: mod.MorphingBlob3D })),
  {
    ssr: false,
    loading: () => (
      <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      </div>
    ),
  }
);

interface BlogPost {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
  };
}

interface HomePageProps {
  recentBlogs: BlogPost[];
}

export function HomePageContent({ recentBlogs }: HomePageProps) {
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  if (!mounted) {
    return (
      <section>
        <div style={{ marginBottom: 80 }}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12" style={{ marginBottom: 32 }}>
            <div style={{ flex: 1 }}>
              <h1
                className="text-neutral-900 dark:text-neutral-100"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
                  marginBottom: 24,
                  fontWeight: 700,
                }}
              >
                core_sen
              </h1>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section suppressHydrationWarning>
      {/* Hero Section */}
      <div style={{ marginBottom: 80 }}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12" style={{ marginBottom: 32 }}>
          {/* Text Content */}
          <div style={{ flex: 1 }}>
            <Title
              level={1}
              className="text-neutral-900 dark:text-neutral-100"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
                marginBottom: 24,
                fontWeight: 700,
              }}
            >
              core_sen
            </Title>
            <Paragraph
              className="text-neutral-600 dark:text-neutral-300"
              style={{
                fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
                marginBottom: 32,
                lineHeight: 1.6,
              }}
            >
              Exploring the depths of AI, data science, and machine learning through{" "}
              <Link href="/blog" className="link-animated text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium">
                writing
              </Link>{" "}
              and{" "}
              <Link href="/projects" className="link-animated text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium">
                projects
              </Link>
              .
            </Paragraph>
            <Space size="middle" wrap>
              <Button
                type="primary"
                size="large"
                loading={isPending}
                onClick={() => handleNavigation("/blog")}
              >
                Read Blog
              </Button>
              <Button
                type="default"
                size="large"
                loading={isPending}
                onClick={() => handleNavigation("/profile")}
              >
                View Profile
              </Button>
            </Space>
          </div>

          {/* Morphing Blob 3D - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:block" style={{ flexShrink: 0 }}>
            <Suspense
              fallback={
                <div className="w-[300px] h-[300px] flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                </div>
              }
            >
              <MorphingBlob3D
                width={300}
                height={300}
                className="relative z-0"
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Recent Writings */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <Title level={2} style={{ margin: 0 }} className="text-neutral-900 dark:text-neutral-100">
            Recent Writings
          </Title>
                <Button
                  type="link"
                  onClick={() => handleNavigation("/blog")}
                  loading={isPending}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                  style={{ padding: 0, height: "auto" }}
                >
                  View all →
                </Button>
        </div>
        <Flex vertical gap="middle">
          {recentBlogs.map((post) => (
            <div key={post.slug}>
              <Card
                hoverable
                size="small"
                style={{ width: "100%", cursor: "pointer" }}
                className="card-border-animated bg-white dark:!bg-white dark:!border-neutral-200 transition-all hover:shadow-md"
                onClick={() => handleNavigation(`/blog/${post.slug}`)}
              >
                <Flex justify="space-between" align="center" wrap="wrap" gap="small">
                  <Text strong style={{ fontSize: 16 }} className="!text-neutral-900 dark:!text-neutral-900">
                    {post.metadata.title}
                  </Text>
                  <Text type="secondary" className="!text-neutral-600 dark:!text-neutral-600 text-sm">
                    {formatDate(post.metadata.publishedAt, false)}
                  </Text>
                </Flex>
              </Card>
            </div>
          ))}
        </Flex>
      </div>
    </section>
  );
}
