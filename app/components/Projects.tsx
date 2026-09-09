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