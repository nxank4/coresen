import Image from "next/image";
import { socialLinks } from "./config";

export default function Page() {
  return (
    <section>
      <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
        <Image
          src="/profile.png"
          alt="Nguyen Xuan An's Profile Photo"
          className="rounded-full bg-gray-100 block lg:mt-5 mt-0 lg:mb-5 mb-10 mx-auto sm:float-right sm:ml-5 sm:mb-5 grayscale hover:grayscale-0"
          unoptimized
          width={160}
          height={160}
          priority
        />
      </a>

      <h1 className="mb-8 text-2xl font-medium tracking-tight">
        Welcome to Nguyen Xuan An's Portfolio!
      </h1>

      <div className="prose prose-neutral dark:prose-invert">
        <p>
          Explore insights in AI, data analytics, and machine learning. Dive
          into my projects and achievements as a Data Scientist and Machine
          Learning Engineer.
        </p>
        <p>
          Featured projects include <strong>REColor</strong>,{" "}
          <strong>AI Tool for Room Decoration</strong>, and{" "}
          <strong>ANAug</strong>, showcasing innovation and impact in AI-driven
          solutions.
        </p>
        <p>
          This portfolio is{" "}
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            open-source
          </a>{" "}
          and built using Next.js and Tailwind CSS for a seamless experience.
        </p>
        <p>
          Feel free to connect with me via{" "}
          <a href={socialLinks.email} target="_blank" rel="noopener noreferrer">
            email
          </a>{" "}
          or explore my work on{" "}
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
        <p>
          Created and maintained by{" "}
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            Nguyen Xuan An
          </a>
          .
        </p>
      </div>
    </section>
  );
}
