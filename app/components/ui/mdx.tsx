import React, { Children } from "react";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { highlight } from "sugar-high";
import { TweetComponent } from "../features/tweet";
import { CaptionComponent } from "./caption";
import { YouTubeComponent } from "../features/youtube";
import { hoverBrightness } from "../../lib/utils/animations";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";


function CustomLink(props) {
  let href = props.href;
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }
  if (href.startsWith("#")) {
    return <a {...props} />;
  }
  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index} className="text-neutral-900 dark:text-neutral-100">{header}</th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex} className="text-neutral-800 dark:text-neutral-200">{cell}</td>
      ))}
    </tr>
  ));
  return (
    <table className="w-full border-collapse my-4">
      <thead>
        <tr className="text-left border-b border-neutral-300 dark:border-neutral-700">{headers}</tr>
      </thead>
      <tbody className="border-b border-neutral-200 dark:border-neutral-800">{rows}</tbody>
    </table>
  );
}

function Strikethrough(props) {
  return <del {...props} />;
}

function Callout(props) {
  return (
    <div className="px-4 py-3 bg-[#F7F7F7] dark:bg-[#181818] rounded p-1 text-sm flex items-center text-neutral-900 dark:text-neutral-100 mb-8">
      <div className="flex items-center w-4 mr-4">{props.emoji}</div>
      <div className="w-full callout leading-relaxed">{props.children}</div>
    </div>
  );
}

function Tags(props) {
  const extractText = (children) => {
    if (typeof children === "string") {
      return children;
    }
    if (typeof children === "number") {
      return String(children);
    }
    if (!children) {
      return "";
    }
    
    return Children.toArray(children)
      .map((child) => {
        if (typeof child === "string" || typeof child === "number") {
          return String(child);
        }
        if (typeof child === "object" && child !== null && "props" in child) {
          return extractText(child.props.children);
        }
        return "";
      })
      .join("");
  };

  const text = extractText(props.children);
  const trimmedText = text.trim();
  
  if (!trimmedText || !trimmedText.toLowerCase().startsWith("tags:")) {
    return <p {...props} />;
  }

  const tagsText = trimmedText.replace(/^tags:\s*/i, "");
  const tags = tagsText
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (tags.length === 0) {
    return <p {...props} />;
  }

  return (
    <div className="my-6 flex flex-wrap gap-2 justify-center">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children);
    const baseTextColor = "text-neutral-900 dark:text-neutral-100";
    const animationClasses = hoverBrightness.classes;
    
    const headingClasses = {
      1: `${baseTextColor} text-4xl md:text-5xl font-bold mt-8 mb-4 inline-block ${animationClasses}`,
      2: `${baseTextColor} text-[30px] md:text-4xl font-semibold mt-8 mb-4 inline-block ${animationClasses}`,
      3: `${baseTextColor} text-[25px] font-semibold mt-6 mb-3 inline-block ${animationClasses}`,
      4: `${baseTextColor} text-xl font-semibold mt-6 mb-3 inline-block ${animationClasses}`,
      5: `${baseTextColor} text-lg font-semibold mt-4 mb-2 inline-block ${animationClasses}`,
      6: `${baseTextColor} text-base font-semibold mt-4 mb-2 inline-block ${animationClasses}`,
    };
    return React.createElement(
      `h${level}`,
      { id: slug, className: headingClasses[level] || `${baseTextColor} inline-block ${animationClasses}` },
      [
        children,
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: `anchor ${hoverBrightness.classes}`,
          "aria-label": `Link to ${slug}`,
        }),
      ]
    );
  };
  Heading.displayName = `Heading${level}`;
  return Heading;
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  StaticTweet: TweetComponent,
  Caption: CaptionComponent,
  YouTube: YouTubeComponent,
  code: Code,
  Table,
  del: Strikethrough,
  Callout,
  p: Tags,
};

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
      }}
    />
  );
}
