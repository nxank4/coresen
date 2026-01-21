"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { Flex, Typography, Segmented, Card } from "antd";

const { Text, Paragraph } = Typography;

interface Project {
  title: string;
  year: number | string;
  description: string;
  url: string;
}

interface ProjectsListClientProps {
  projects: Project[];
}

export function ProjectsListClient({ projects }: ProjectsListClientProps) {
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isSwitchingView, setIsSwitchingView] = useState(false);
  const switchTimerRef = useRef<number | null>(null);

  const handleClick = (url: string, e: React.MouseEvent) => {
    startTransition(() => {
      window.open(url, "_blank", "noopener,noreferrer");
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
        {projects.map((project, index) => {
          const thumbClassName = "w-32 h-32";
          const initials = project.title
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0]?.toUpperCase())
            .join("");

          return (
            <a
              key={index}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleClick(project.url, e)}
              style={{ width: "100%", textDecoration: "none" }}
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
                    <span className="text-neutral-700 dark:text-neutral-200 font-semibold text-lg">
                      {initials || "PR"}
                    </span>
                  </div>

                  <Flex
                    vertical
                    justify="space-between"
                    style={{ width: "100%", minHeight: "96px" }}
                  >
                    <div>
                      <Flex
                        justify="space-between"
                        align="baseline"
                        wrap="wrap"
                        gap="small"
                        style={{ width: "100%" }}
                      >
                        <Text
                          strong
                          className="text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-950 dark:group-hover:text-neutral-50 transition-colors"
                          style={{ fontSize: 16, lineHeight: 1.4 }}
                        >
                          {project.title}
                        </Text>
                        <Text
                          type="secondary"
                          className="text-neutral-600 dark:text-neutral-400"
                          style={{ fontSize: 14 }}
                        >
                          {String(project.year)}
                        </Text>
                      </Flex>
                      <Paragraph
                        className="text-neutral-700 dark:text-neutral-300"
                        style={{ marginTop: 12, marginBottom: 0 }}
                      >
                        {project.description}
                      </Paragraph>
                    </div>
                  </Flex>
                </div>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}
