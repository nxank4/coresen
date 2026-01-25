import fs from "fs";
import path from "path";
import { getBlogPosts } from "../app/lib/posts";
import { metaData } from "../app/config";
import { formatDate } from "../app/lib/utils";

function generateMarkdownTable(): string {
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

  return markdownTable;
}

function updateReadme() {
  const readmePath = path.join(process.cwd(), "README.md");
  let readmeContent = fs.readFileSync(readmePath, "utf-8");

  // Find the section between "## Recent Blog Posts" and "## License"
  const startMarker = "## Recent Blog Posts";
  const endMarker = "## License";
  
  const startIndex = readmeContent.indexOf(startMarker);
  const endIndex = readmeContent.indexOf(endMarker);
  
  if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find markers in README.md");
    process.exit(1);
  }

  const beforeSection = readmeContent.substring(0, startIndex + startMarker.length);
  const afterSection = readmeContent.substring(endIndex);
  
  const table = generateMarkdownTable();
  const note = "\n\n*Table is auto-generated from blog posts. View full list at [coresen.vercel.app/blog](https://coresen.vercel.app/blog)*";
  
  const newContent = beforeSection + "\n\n" + table + note + "\n\n" + afterSection;
  
  fs.writeFileSync(readmePath, newContent, "utf-8");
  console.log("README.md updated with latest blog posts table");
}

updateReadme();
