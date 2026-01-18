"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Flex, Typography, Space } from "antd";

const { Text } = Typography;

interface BlogPost {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
  };
}

interface BlogListClientProps {
  posts: BlogPost[];
}

function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  let fullDate = targetDate.toLocaleString("en-us", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}

export function BlogListClient({ posts }: BlogListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
      {posts.map((post) => (
        <div key={post.slug} style={{ padding: "16px 0" }}>
          <Link
            href={`/blog/${post.slug}`}
            onClick={(e) => handleClick(`/blog/${post.slug}`, e)}
            style={{ width: "100%", textDecoration: "none" }}
            className="group transition-colors"
            aria-busy={isPending}
          >
            <Flex
              justify="space-between"
              align="center"
              wrap="wrap"
              gap="small"
              style={{ width: "100%" }}
            >
              <Text
                strong
                className="text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors"
                style={{ fontSize: 16 }}
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
          </Link>
        </div>
      ))}
    </Space>
  );
}
