import { getBlogPosts } from "app/lib/posts";
import { BlogListClient } from "./BlogListClient";

export const metadata = {
  title: "Blog",
  description: "Nextfolio Blog",
};

export default function BlogPosts() {
  let allBlogs = getBlogPosts();

  const sortedBlogs = allBlogs.sort((a, b) => {
    if (
      new Date(a.metadata.publishedAt) >
      new Date(b.metadata.publishedAt)
    ) {
      return -1;
    }
    return 1;
  });

  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
        Our Blog
      </h1>
      <BlogListClient posts={sortedBlogs} />
    </section>
  );
}
