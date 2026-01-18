"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Typography, Card, Flex } from "antd";
import { formatDate } from "app/lib/utils";

const { Title, Text } = Typography;

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
  return (
    <section>
      {/* Hero Section */}
      <div style={{ marginBottom: 80 }}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-8">
          {/* Text Content */}
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-neutral-900 dark:text-neutral-100 tracking-tight">
              core_sen
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
              Exploring the depths of AI, data science, and machine learning through{" "}
              <Link href="/blog" className="text-neutral-900 dark:text-neutral-100 hover:underline font-medium">
                writing
              </Link>{" "}
              and{" "}
              <Link href="/projects" className="text-neutral-900 dark:text-neutral-100 hover:underline font-medium">
                projects
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/profile"
                className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                View Profile
              </Link>
              <Link
                href="/blog"
                className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Read Blog
              </Link>
            </div>
          </div>

          {/* Morphing Blob 3D - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:block flex-shrink-0">
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
          <Link href="/blog">
            <Text className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              View all →
            </Text>
          </Link>
        </div>
        <Flex vertical gap="middle">
          {recentBlogs.map((post) => (
            <div key={post.slug}>
              <Link href={`/blog/${post.slug}`} style={{ width: "100%", textDecoration: "none" }}>
                <Card
                  hoverable
                  size="small"
                  style={{ width: "100%" }}
                  className="bg-white dark:!bg-white dark:!border-neutral-200 transition-all hover:shadow-md"
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
              </Link>
            </div>
          ))}
        </Flex>
      </div>
    </section>
  );
}
