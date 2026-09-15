"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Project = {
  id: number;
  title: string;
  description: string | null;
  technologies: string | null;
  github_url: string | null;
  live_url: string | null;
};

type CertificationMedia = {
  id: string | number;
  title: string | null;
  image_url: string | null;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading projects:", error);
      } else {
        setProjects(data || []);
      }

      setLoading(false);
    };

    loadProjects();
  }, []);

  /*
   * Connect the existing Certifications section to certificate images
   * uploaded from the admin dashboard. The observer is used because the
   * certification cards are rendered asynchronously after Supabase loads.
   */
  useEffect(() => {
    let cancelled = false;

    const enhanceCertifications = async () => {
      const { data, error } = await supabase
        .from("certifications")
        .select("id, title, image_url");

      if (error) {
        console.warn("Could not load certificate images:", error.message);
        return;
      }

      if (cancelled) return;

      const certifications = (data || []) as CertificationMedia[];

      const applyEnhancements = () => {
        // Restore Certifications in the existing desktop navigation.
        const textElements = Array.from(
          document.querySelectorAll<HTMLElement>("p, h2, h3, h4")
        );

        const heading = textElements.find(
          (element) => element.textContent?.trim() === "Certifications"
        );

        let section: HTMLElement | null = null;

        if (heading) {
          section =
            heading.closest<HTMLElement>("div.mt-20") ||
            heading.parentElement?.parentElement?.parentElement ||
            null;

          if (section) {
            section.id = "certifications";
          }
        }

        const navLinks = document.querySelector<HTMLElement>("header nav > div");

        if (
          navLinks &&
          !navLinks.querySelector('a[href="#certifications"]')
        ) {
          const link = document.createElement("a");
          link.href = "#certifications";
          link.textContent = "Certifications";
          link.className = "transition hover:text-blue-600";

          const achievementsLink = navLinks.querySelector(
            'a[href="#achievements"]'
          );

          if (achievementsLink) {
            navLinks.insertBefore(link, achievementsLink);
          } else {
            navLinks.appendChild(link);
          }
        }

        certifications.forEach((certificate) => {
          if (!certificate.image_url || !certificate.title) return;

          const title = certificate.title.trim();
          if (!title) return;

          // Search the whole page so this still works when the section is
          // rendered after this component's first effect execution.
          const titleElement = Array.from(
            document.querySelectorAll<HTMLElement>("h3, h4, p, span")
          ).find((element) => element.textContent?.trim() === title);

          if (!titleElement) return;

          const card = titleElement.closest<HTMLElement>("div.rounded-3xl");
          if (!card) return;

          // Always replace the old certificate_url (for example "bvvg")
          // with the actual uploaded Supabase Storage image URL.
          const certificateLinks = Array.from(
            card.querySelectorAll<HTMLAnchorElement>("a")
          ).filter((anchor) =>
            anchor.textContent?.toLowerCase().includes("view certificate")
          );

          certificateLinks.forEach((certificateLink) => {
            certificateLink.href = certificate.image_url!;
            certificateLink.target = "_blank";
            certificateLink.rel = "noopener noreferrer";
          });

          // Add the uploaded certificate image only once.
          if (card.dataset.certificateImageEnhanced !== "true") {
            const imageWrapper = document.createElement("div");
            imageWrapper.className =
              "mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50";

            const image = document.createElement("img");
            image.src = certificate.image_url;
            image.alt = `${title} certificate`;
            image.loading = "lazy";
            image.className =
              "h-64 w-full cursor-pointer object-contain bg-white p-2 transition duration-300 hover:scale-[1.02]";

            imageWrapper.appendChild(image);

            const firstButtonOrLink = card.querySelector("a, button");

            if (firstButtonOrLink) {
              card.insertBefore(imageWrapper, firstButtonOrLink);
            } else {
              card.appendChild(imageWrapper);
            }

            card.dataset.certificateImageEnhanced = "true";
          }

          // If the original button was not present when the card first
          // appeared, create a correct View Certificate link.
          const hasCertificateLink = Array.from(
            card.querySelectorAll<HTMLAnchorElement>("a")
          ).some((anchor) =>
            anchor.textContent?.toLowerCase().includes("view certificate")
          );

          if (!hasCertificateLink) {
            const viewLink = document.createElement("a");
            viewLink.href = certificate.image_url;
            viewLink.target = "_blank";
            viewLink.rel = "noopener noreferrer";
            viewLink.textContent = "View Certificate ↗";
            viewLink.className =
              "mt-6 block w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700";
            card.appendChild(viewLink);
          }
        });
      };

      applyEnhancements();

      const observer = new MutationObserver(() => {
        applyEnhancements();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return observer;
    };

    let observer: MutationObserver | undefined;

    enhanceCertifications().then((createdObserver) => {
      observer = createdObserver;
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);

  return (
    <section
      id="projects"
      className="bg-slate-50 px-6 py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Projects
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            Things I'm building
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A collection of projects I have built while learning and exploring
            software development.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mx-auto mt-10 max-w-2xl rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-700">
              Loading projects...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && projects.length === 0 && (
          <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="text-4xl">💻</div>

            <p className="mt-4 text-lg font-semibold text-slate-800">
              Projects coming soon
            </p>

            <p className="mt-3 text-slate-500">
              Completed projects will be showcased here as I continue building
              and learning.
            </p>
          </div>
        )}

        {/* Projects */}
        {!loading && projects.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  💻
                </div>

                {/* Title */}
                <h3 className="mt-6 text-2xl font-bold text-slate-950">
                  {project.title}
                </h3>

                {/* Description */}
                {project.description && (
                  <p className="mt-3 leading-7 text-slate-600">
                    {project.description}
                  </p>
                )}

                {/* Technologies */}
                {project.technologies && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies
                      .split(",")
                      .map((technology) => (
                        <span
                          key={technology.trim()}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                        >
                          {technology.trim()}
                        </span>
                      ))}
                  </div>
                )}

                {/* Links */}
                <div className="mt-auto flex gap-3 pt-7">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
                    >
                      GitHub ↗
                    </a>
                  )}

                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Live Demo ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
