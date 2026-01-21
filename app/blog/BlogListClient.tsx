"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { Flex, Typography, Segmented, Card } from "antd";

const { Text } = Typography;

interface BlogPost {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    image?: string;
  };
}

interface BlogListClientProps {
  posts: BlogPost[];
}

function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

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

  const fullDate = targetDate.toLocaleString("en-us", {
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
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isSwitchingView, setIsSwitchingView] = useState(false);
  const switchTimerRef = useRef<number | null>(null);

  const handleClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  };

  const containerClassName = useMemo(() => {
    return view === "grid"
      ? "grid gap-6 md:grid-cols-2 w-full"
      : "grid gap-4 grid-cols-1 w-full";
  }, [view]);

  const handleViewChange = (nextView: "grid" | "list") => {
    if (nextView === view) return;
    if (switchTimerRef.current) {
      window.clearTimeout(switchTimerRef.current);
    }

    setIsSwitchingView(true);
    switchTimerRef.current = window.setTimeout(() => {
      setView(nextView);
      // allow layout to paint before fading in
      window.setTimeout(() => setIsSwitchingView(false), 20);
    }, 120);
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Segmented<"grid" | "list">
          size="small"
          value={view}
          onChange={(val) => handleViewChange(val)}
          options={[
            { label: "Grid", value: "grid" },
            { label: "List", value: "list" },
          ]}
        />
      </div>

      <div
        className={`${containerClassName} transition-all duration-200 ease-out ${
          isSwitchingView ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
        }`}
      >
        {posts.map((post) => {
          const thumbClassName = "w-32 h-32";

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              onClick={(e) => handleClick(`/blog/${post.slug}`, e)}
              style={{ textDecoration: "none" }}
              aria-busy={isPending}
            >
              <Card
                hoverable
                size="small"
                style={{ width: "100%", cursor: "pointer", backgroundColor: "transparent", minHeight: "120px" }}
                className="card-shadow-offset"
              >
                <div className="flex gap-4 items-center h-full">
                  <div
                    className={`relative ${thumbClassName} rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 flex items-center justify-center`}
                    aria-hidden="true"
                  >
                    {post.metadata.image ? (
                      <Image
                        src={post.metadata.image}
                        alt={post.metadata.title}
                        fill
                        sizes="(min-width: 1024px) 128px, 33vw"
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-neutral-700 dark:text-neutral-200 font-semibold text-lg">
                        {post.metadata.title
                          .split(/\s+/)
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((w) => w[0]?.toUpperCase())
                          .join("") || "BL"}
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
                      className="text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-950 dark:group-hover:text-neutral-50 transition-colors"
                      style={{ fontSize: 16, lineHeight: 1.4 }}
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
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
