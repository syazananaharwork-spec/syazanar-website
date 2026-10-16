import Image from "next/image";
import type { Project } from "@/lib/content";

export function ProjectMedia({ project, priority = false, className = "" }: { project: Project; priority?: boolean; className?: string }) {
  return (
    <div className={`project-media ${className}`}>
      <Image
        src={project.image}
        alt={project.imageAlt}
        fill
        loading={priority ? "eager" : "lazy"}
        sizes="(max-width: 767px) 92vw, (max-width: 1199px) 82vw, 78vw"
      />
    </div>
  );
}
