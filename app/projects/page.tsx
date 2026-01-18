import React from "react";
import type { Metadata } from "next";
import { projects } from "./project-data";
import { ProjectsListClient } from "./ProjectsListClient";

export const metadata: Metadata = {
  title: "Projects",
  description: "My Projects",
};

export default function Projects() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
        Projects
      </h1>
      <ProjectsListClient projects={projects} />
    </section>
  );
}
