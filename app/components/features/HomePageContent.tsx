"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Typography, Card, Flex, Button, Space, Spin } from "antd";
import { formatDate } from "app/lib/utils";
import { useNavigation } from "../ui/NavigationContext";

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
    image?: string;
  };
}

interface HomePageProps {
  recentBlogs: BlogPost[];
}

export function HomePageContent({ recentBlogs }: HomePageProps) {
  const [isPending, setIsPending] = useState(false);
  const [cardLoadingSlug, setCardLoadingSlug] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { setNavigating } = useNavigation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (href: string) => {
    if (pathname !== href && !pathname.startsWith(href + "/")) {
      setNavigating(true);
    }
    setIsPending(true);
    router.push(href);
  };

  const handleCardClick = (slug: string) => {
    const href = `/blog/${slug}`;
    if (pathname !== href && !pathname.startsWith(href + "/")) {
      setNavigating(true);
    }
    setCardLoadingSlug(slug);
    router.push(href);
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
              <Link href="/blog" className="link-animated font-medium">
                writing
              </Link>{" "}
              and{" "}
              <Link href="/projects" className="link-animated font-medium">
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
          {recentBlogs.map((post) => {
            const isCardLoading = cardLoadingSlug === post.slug;
            const initials =
              post.metadata.title
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("") || "BL";

            return (
              <div key={post.slug}>
                <Card
                  hoverable
                  size="small"
                  style={{ width: "100%", cursor: "pointer", opacity: isCardLoading ? 0.6 : 1, backgroundColor: "transparent", minHeight: "120px" }}
                  className="card-shadow-offset"
                  onClick={() => handleCardClick(post.slug)}
                >
                  <div className="flex gap-4 items-center h-full">
                    <div
                      className="relative w-32 h-32 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      {post.metadata.image ? (
                        <Image
                          src={post.metadata.image}
                          alt={post.metadata.title}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-neutral-700 dark:text-neutral-200 font-semibold text-lg">
                          {initials}
                        </span>
                      )}
                    </div>

                    <Flex
                      vertical
                      justify="space-between"
                      style={{ width: "100%", minHeight: "96px" }}
                    >
                      <Text
                        strong
                        style={{ fontSize: 16, lineHeight: 1.4 }}
                        className="text-neutral-900 dark:text-neutral-100"
                      >
                        {post.metadata.title}
                      </Text>
                      <Text
                        type="secondary"
                        className="text-neutral-600 dark:text-neutral-400"
                        style={{ fontSize: 14 }}
                      >
                        {formatDate(post.metadata.publishedAt, false)}
                      </Text>
                    </Flex>
                  </div>
                  {isCardLoading && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
                      <Spin size="small" />
                      <span>Loading...</span>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </Flex>
      </div>
    </section>
  );
}
