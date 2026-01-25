import { NextResponse } from "next/server";
import { getBlogPosts } from "app/lib/posts";
import { metaData } from "app/config";
import { formatDate } from "app/lib/utils";

export async function GET() {
  const allPosts = getBlogPosts();
  
  // Sort posts by published date (newest first)
  const sortedPosts = allPosts.sort((a, b) => {
    const dateA = new Date(a.metadata.publishedAt).getTime();
    const dateB = new Date(b.metadata.publishedAt).getTime();
    return dateB - dateA;
  });

  // Generate markdown table
  let markdownTable = "| Title | Categories | Date |\n";
  markdownTable += "|-------|------------|------|\n";

  sortedPosts.forEach((post) => {
    const title = `[${post.metadata.title}](${metaData.baseUrl}blog/${post.slug})`;
    const categories = post.metadata.tags
      ? post.metadata.tags
          .split(",")
          .map((tag) => tag.trim())
          .join(", ")
      : "-";
    const date = formatDate(post.metadata.publishedAt, false);

    // Escape pipe characters in title and categories
    const escapedTitle = title.replace(/\|/g, "\\|");
    const escapedCategories = categories.replace(/\|/g, "\\|");

    markdownTable += `| ${escapedTitle} | ${escapedCategories} | ${date} |\n`;
  });

  return new NextResponse(markdownTable, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
