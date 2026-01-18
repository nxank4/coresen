"use client";

import { useTransition } from "react";
import { Flex, Typography, Space, Spin } from "antd";

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

  const handleClick = (url: string, e: React.MouseEvent) => {
    startTransition(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    });
  };

  return (
    <Space orientation="vertical" size="large" style={{ width: "100%" }}>
      {projects.map((project, index) => (
        <div key={index} style={{ padding: "24px 0" }}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleClick(project.url, e)}
            style={{ width: "100%", textDecoration: "none" }}
            className="group transition-colors"
            aria-busy={isPending}
          >
            <Flex
              justify="space-between"
              align="baseline"
              wrap="wrap"
              gap="small"
              style={{ width: "100%" }}
            >
              <Text
                strong
                className="text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors"
                style={{ fontSize: 16 }}
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
              className="text-neutral-800 dark:text-neutral-200"
              style={{ marginTop: 12, marginBottom: 0 }}
            >
              {project.description}
            </Paragraph>
          </a>
        </div>
      ))}
    </Space>
  );
}
