"use client";

import { Typography, Flex } from "antd";
import { formatDate } from "app/lib/utils";

const { Title, Text } = Typography;

interface BlogPostHeaderProps {
  title: string;
  publishedAt: string;
}

export function BlogPostHeader({ title, publishedAt }: BlogPostHeaderProps) {
  return (
    <>
      <Title
        level={1}
        className="text-neutral-900 dark:text-neutral-100"
        style={{ marginBottom: 12, fontWeight: 500 }}
      >
        {title}
      </Title>
      <Flex justify="space-between" align="center" style={{ marginTop: 8, marginBottom: 32 }}>
        <Text type="secondary" className="text-neutral-600 dark:text-neutral-400" style={{ fontSize: 14 }}>
          {formatDate(publishedAt)}
        </Text>
      </Flex>
    </>
  );
}
