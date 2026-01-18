import React from "react";
import { getBlogPosts } from "app/lib/posts";

import { HomePageContent } from "app/components/features/HomePageContent";

export default function Page() {
  let allBlogs = getBlogPosts();
  let recentBlogs = allBlogs
    .sort((a, b) => {
      if (
        new Date(a.metadata.publishedAt) >
        new Date(b.metadata.publishedAt)
      ) {
        return -1;
      }
      return 1;
    })
    .slice(0, 3); // Top 3 posts

  return (
    <HomePageContent 
        recentBlogs={recentBlogs}
    />
  );
}
