import { getProjectBySlug, getPublishedProjects } from "@/lib/data";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Project van Carmen de Groot";
export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return renderOgImage({
    eyebrow: project?.category?.name ?? "Project",
    title: project?.title ?? "Project",
    footer: "Carmen de Groot — Human-Centered Designer",
  });
}
