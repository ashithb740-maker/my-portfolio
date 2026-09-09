"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Projects from "./components/Projects";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ================= TYPES =================

type Education = {
  id: string;
  title?: string;
  degree?: string;
  institution?: string;
  year?: string;
  percentage?: string;
  cgpa?: string;
  description?: string;
};

type Certification = {
  id: string;
  title?: string;
  issuer?: string;
  date?: string;
  status?: string;
  certificate_url?: string;
  description?: string;
};

type Achievement = {
  id: string;
  title?: string;
  description?: string;
  date?: string;
};

type Internship = {
  id: string;
  title?: string;
  company?: string;
  duration?: string;
  date?: string;
  description?: string;
  certificate_url?: string;
};

type Course = {
  id: string;
  title?: string;
  provider?: string;
  date?: string;
  description?: string;
  certificate_url?: string;
};

type Skill = {
  id: string;
  name?: string;
  skill?: string;
  category?: string;
};

// ================= HOME =================

export default function Home() {
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  // ================= LOAD DATA =================

  useEffect(() => {
    const loadPortfolioData = async () => {
      // ================= SKILLS =================

      const {
        data: skillsData,
        error: skillsError,
      } = await supabase
        .from("skills")
        .select("id, category, name")
        .order("id", { ascending: true });

      if (skillsError) {
        console.warn("Could not load skills:", skillsError.message);
      } else {
        setSkills(skillsData ?? []);
      }

      // ================= EDUCATION =================

      const {
        data: educationData,
        error: educationError,
      } = await supabase
        .from("education")
        .select("*")
        .order("id", { ascending: true });

      if (educationError) {
        console.warn(
          "Could not load education:",
          educationError.message
        );
      } else {
        setEducation(educationData ?? []);
      }

      // ================= CERTIFICATIONS =================

      const {
        data: certificationData,
        error: certificationError,
      } = await supabase
        .from("certifications")
        .select("*")
        .order("id", { ascending: true });

      if (certificationError) {
        console.warn(
          "Could not load certifications:",
          certificationError.message
        );
      } else {
        setCertifications(certificationData ?? []);
      }

      // ================= ACHIEVEMENTS =================

      const {
        data: achievementData,
        error: achievementError,
      } = await supabase
        .from("achievements")
        .select("*")
        .order("id", { ascending: true });

      if (achievementError) {
        console.warn(
          "Could not load achievements:",
          achievementError.message
        );
      } else {
        setAchievements(achievementData ?? []);
      }

      // ================= INTERNSHIPS =================

      const {
        data: internshipData,
        error: internshipError,
      } = await supabase
        .from("internships")
        .select("*")
        .order("id", { ascending: true });

      if (internshipError) {
        console.warn(
          "Could not load internships:",
          internshipError.message
        );
      } else {
        setInternships(internshipData ?? []);
      }

      // ================= COURSES =================

      const {
        data: courseData,
        error: courseError,
      } = await supabase
        .from("courses")
        .select("*")
        .order("id", { ascending: true });

      if (courseError) {
        console.warn(
          "Could not load courses:",
          courseError.message
        );
      } else {
        setCourses(courseData ?? []);
      }
    };

    loadPortfolioData();
  }, []);

  // ================= GROUP SKILLS =================

  const groupedSkills = skills.reduce(
    (groups: Record<string, Skill[]>, skill) => {
      const category = skill.category || "Other";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(skill);

      return groups;
    },
    {}
  );

  // ================= RETURN =================

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* ================= NAVIGATION ================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          <a
            href="#"
            className="text-xl font-bold tracking-tight"
          >
            Ashith<span className="text-blue-600">.</span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium md:flex">

            <a href="#about" className="transition hover:text-blue-600">
              About
            </a>

            <a href="#skills" className="transition hover:text-blue-600">
              Skills
            </a>

            <a href="#education" className="transition hover:text-blue-600">
              Education
            </a>

            <a
              href="#achievements"
              className="transition hover:text-blue-600"
            >
              Achievements
            </a>

            <a
              href="#internships"
              className="transition hover:text-blue-600"
            >
              Internships
            </a>

            <a href="#courses" className="transition hover:text-blue-600">
              Courses
            </a>

            <a href="#projects" className="transition hover:text-blue-600">
              Projects
            </a>

            <a href="#contact" className="transition hover:text-blue-600">
              Contact
            </a>

          </div>

          <a
            href="#contact"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Let's Talk
          </a>

        </nav>
      </header>

      {/* ================= HERO ================= */}

      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-6 py-20 lg:px-8">

        <div className="grid w-full items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">

          <div>

            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
              Hello, I'm
            </p>

            <h1 className="text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Ashith B
            </h1>

            <h2 className="mt-6 max-w-3xl text-2xl font-semibold leading-tight text-slate-700 sm:text-3xl">
              Computer Science & Engineering Student
              <span className="text-blue-600"> | </span>
              Aspiring Software, Web & App Developer
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              I enjoy exploring new technologies, building meaningful
              projects, and developing solutions that address real-world
              problems.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="#projects"
                className="rounded-full bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                View My Work
              </a>

              <a
                href="#contact"
                className="rounded-full border border-slate-300 px-7 py-3.5 font-semibold text-slate-800 transition hover:border-blue-600 hover:text-blue-600"
              >
                Contact Me
              </a>

            </div>

            <div className="mt-10 flex gap-6 text-sm font-medium">

              <a
                href="https://github.com/ashithb740-maker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 transition hover:text-blue-600"
              >
                GitHub ↗
              </a>

              <a
                href="https://www.linkedin.com/in/ashith-b-26b426346"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 transition hover:text-blue-600"
              >
                LinkedIn ↗
              </a>

            </div>

          </div>

          {/* ================= PROFILE IMAGE ================= */}

          <div className="flex justify-center lg:justify-end">

            <div className="relative">

              <div className="absolute -inset-5 rounded-full bg-blue-100 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-2xl">

                <Image
                  src="/images/profile.jpg"
                  alt="Ashith B"
                  width={420}
                  height={420}
                  className="h-[320px] w-[320px] object-cover object-top sm:h-[390px] sm:w-[390px]"
                  priority
                />

              </div>

              <div className="absolute -bottom-5 -left-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl">

                <p className="text-xs font-medium text-slate-500">
                  Currently pursuing
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  B.E. Computer Science
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section
        id="about"
        className="bg-slate-50 px-6 py-24 lg:px-8"
      >

        <div className="mx-auto max-w-5xl">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            About Me
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Curious about technology. Focused on creating useful solutions.
          </h2>

          <p className="mt-7 max-w-4xl text-lg leading-8 text-slate-600">
            I am a Computer Science & Engineering student with a strong
            interest in software, web, and app development. I enjoy exploring
            new technologies, learning new concepts, and building projects
            that solve real-world problems people face in their everyday
            lives. I am continuously developing my technical and
            problem-solving skills with the goal of becoming a skilled
            software developer and creating technology that can make a
            meaningful contribution to society.
          </p>

        </div>

      </section>

      {/* ================= SKILLS ================= */}

      <section
        id="skills"
        className="px-6 py-24 lg:px-8"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Technical Skills
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Technologies I work with
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            I am continuously improving my skills in programming, web
            development, application development, databases, and modern
            development tools.
          </p>

          {skills.length > 0 ? (

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {Object.entries(groupedSkills).map(
                ([category, categorySkills]) => (

                  <div
                    key={category}
                    className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                  >

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                      💻
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-slate-950">
                      {category}
                    </h3>

                    <div className="mt-6 flex flex-wrap gap-2">

                      {categorySkills.map((item) => (

                        <span
                          key={item.id}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                        >
                          {item.name || item.skill}
                        </span>

                      ))}

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <p className="mt-10 text-slate-500">
              Skills will be added soon.
            </p>

          )}

        </div>

      </section>

      {/* ================= EDUCATION ================= */}

      <section
        id="education"
        className="bg-slate-50 px-6 py-24 lg:px-8"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Education
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            My Academic Journey
          </h2>

          {education.length > 0 ? (

            <div className="relative mt-12">

              <div className="absolute left-3 top-2 hidden h-[calc(100%-16px)] w-px bg-blue-200 sm:block" />

              <div className="space-y-10">

                {education.map((item) => (

                  <div
                    key={item.id}
                    className="relative sm:pl-12"
                  >

                    <div className="absolute left-0 top-2 hidden h-7 w-7 items-center justify-center rounded-full border-4 border-blue-100 bg-blue-600 sm:flex" />

                    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-8">

                      {item.year && (
                        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                          {item.year}
                        </span>
                      )}

                      <h3 className="mt-4 text-2xl font-bold text-slate-950">
                        {item.title || item.degree}
                      </h3>

                      <p className="mt-2 text-lg font-medium text-slate-700">
                        {item.institution}
                      </p>

                      {item.description && (
                        <p className="mt-2 text-slate-500">
                          {item.description}
                        </p>
                      )}

                      {(item.percentage || item.cgpa) && (

                        <div className="mt-5 inline-block rounded-xl bg-slate-50 px-5 py-3">

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {item.cgpa ? "CGPA" : "Percentage"}
                          </p>

                          <p className="mt-1 text-2xl font-bold text-blue-600">
                            {item.cgpa || item.percentage}
                          </p>

                        </div>

                      )}

                    </div>

                  </div>

                ))}

              </div>

            </div>

          ) : (

            <p className="mt-10 text-slate-500">
              Education details will be added soon.
            </p>

          )}

        </div>

      </section>

      {/* ================= ACHIEVEMENTS ================= */}

      <section
        id="achievements"
        className="bg-white px-6 py-24 lg:px-8"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Achievements
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            My achievements
          </h2>

          {achievements.length > 0 ? (

            <div className="mt-12 grid gap-6 md:grid-cols-3">

              {achievements.map((item) => (

                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="text-3xl">
                    🏆
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-950">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-3 leading-7 text-slate-600">
                      {item.description}
                    </p>
                  )}

                  {item.date && (
                    <p className="mt-4 text-sm text-slate-500">
                      {item.date}
                    </p>
                  )}

                </div>

              ))}

            </div>

          ) : (

            <p className="mt-10 text-slate-500">
              Achievements will be added soon.
            </p>

          )}

          {/* ================= CERTIFICATIONS ================= */}

          <div className="mt-20">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Certifications
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
              Courses & credentials
            </h3>

            {certifications.length > 0 ? (

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {certifications.map((item) => (

                  <div
                    key={item.id}
                    className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                  >

                    <div className="flex items-start justify-between">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                        📜
                      </div>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        {item.status || "Completed"}
                      </span>

                    </div>

                    <h4 className="mt-6 text-xl font-bold text-slate-950">
                      {item.title}
                    </h4>

                    {item.issuer && (
                      <p className="mt-3 font-medium text-blue-600">
                        {item.issuer}
                      </p>
                    )}

                    {item.date && (
                      <p className="mt-2 text-sm text-slate-500">
                        {item.date}
                      </p>
                    )}

                    {item.description && (
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>
                    )}

                    {item.certificate_url && (
                      <a
                        href={item.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
                      >
                        View Certificate
                      </a>
                    )}

                  </div>

                ))}

              </div>

            ) : (

              <p className="mt-8 text-slate-500">
                Certifications will be added soon.
              </p>

            )}

          </div>

        </div>

      </section>

      {/* ================= INTERNSHIPS ================= */}

      <section
        id="internships"
        className="bg-slate-50 px-6 py-24 lg:px-8"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Internships
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Professional experience
          </h2>

          {internships.length > 0 ? (

            <div className="mt-12 grid gap-6 md:grid-cols-2">

              {internships.map((item) => (

                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >

                  <div className="text-3xl">
                    💼
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-slate-950">
                    {item.title}
                  </h3>

                  {item.company && (
                    <p className="mt-2 font-semibold text-blue-600">
                      {item.company}
                    </p>
                  )}

                  {item.duration && (
                    <p className="mt-2 text-sm text-slate-500">
                      {item.duration}
                    </p>
                  )}

                  {item.date && (
                    <p className="mt-2 text-sm text-slate-500">
                      {item.date}
                    </p>
                  )}

                  {item.description && (
                    <p className="mt-4 leading-7 text-slate-600">
                      {item.description}
                    </p>
                  )}

                  {item.certificate_url && (
                    <a
                      href={item.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-block rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold transition hover:border-blue-600 hover:text-blue-600"
                    >
                      View Certificate
                    </a>
                  )}

                </div>

              ))}

            </div>

          ) : (

            <p className="mt-10 text-slate-500">
              Internships will be added soon.
            </p>

          )}

        </div>

      </section>

      {/* ================= COURSES ================= */}

      <section
        id="courses"
        className="px-6 py-24 lg:px-8"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Courses
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Additional learning
          </h2>

          {courses.length > 0 ? (

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {courses.map((item) => (

                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >

                  <div className="text-3xl">
                    📚
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-950">
                    {item.title}
                  </h3>

                  {item.provider && (
                    <p className="mt-2 font-medium text-blue-600">
                      {item.provider}
                    </p>
                  )}

                  {item.date && (
                    <p className="mt-2 text-sm text-slate-500">
                      {item.date}
                    </p>
                  )}

                  {item.description && (
                    <p className="mt-4 leading-7 text-slate-600">
                      {item.description}
                    </p>
                  )}

                  {item.certificate_url && (
                    <a
                      href={item.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-block rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold transition hover:border-blue-600 hover:text-blue-600"
                    >
                      View Certificate
                    </a>
                  )}

                </div>

              ))}

            </div>

          ) : (

            <p className="mt-10 text-slate-500">
              Courses will be added soon.
            </p>

          )}

        </div>

      </section>

      {/* ================= PROJECTS ================= */}

      <section
        id="projects"
        className="px-6 py-24 lg:px-8"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Projects
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Things I have built
          </h2>

          <Projects />

        </div>

      </section>

      {/* ================= CONTACT ================= */}

      <section
        id="contact"
        className="px-6 py-24 lg:px-8"
      >

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Contact
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-950 sm:text-5xl">
            Let's connect
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            I'm always interested in learning, building new things, and
            connecting with people who share an interest in technology.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <a
              href="mailto:ashithb740@gmail.com"
              className="rounded-full bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Email Me
            </a>

            <a
              href="https://www.linkedin.com/in/ashith-b-26b426346"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-300 px-7 py-3.5 font-semibold text-slate-800 transition hover:border-blue-600 hover:text-blue-600"
            >
              LinkedIn
            </a>

            <a
              href="https://github.com/ashithb740-maker"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-300 px-7 py-3.5 font-semibold text-slate-800 transition hover:border-blue-600 hover:text-blue-600"
            >
              GitHub
            </a>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-slate-200 bg-slate-950 px-6 py-8 text-center text-sm text-slate-400">

        <p>
          © {new Date().getFullYear()} Ashith B. All rights reserved.
        </p>

      </footer>

    </main>
  );
}