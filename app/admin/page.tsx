"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Project = {
  id: number;
  title: string;
  description: string | null;
  technologies: string | null;
  github_url: string | null;
  live_url: string | null;
};

type Education = {
  id: number;
  level: string;
  institution: string;
  year: string | null;
  percentage: string | null;
};

type Certification = {
  id: number;
  title: string;
  issuer: string | null;
  date: string | null;
  description: string | null;
  certificate_url: string | null;
  status: string | null;
};

type Achievement = {
  id: number;
  title: string;
  description: string | null;
  date: string | null;
  link: string | null;
};

type Internship = {
  id: number;
  title: string;
  company: string | null;
  description: string | null;
  duration: string | null;
  date: string | null;
  certificate_url: string | null;
};

type Course = {
  id: number;
  title: string;
  platform: string | null;
  description: string | null;
  date: string | null;
  certificate_url: string | null;
  status: string | null;
};

type Skill = {
  id: number;
  category: string;
  name: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");

  const [activeSection, setActiveSection] = useState("education");

  // ================= EDUCATION =================

  const [education, setEducation] = useState<Education[]>([]);
  const [educationLevel, setEducationLevel] = useState("");
  const [educationInstitution, setEducationInstitution] = useState("");
  const [educationYear, setEducationYear] = useState("");
  const [educationPercentage, setEducationPercentage] = useState("");
  const [editingEducationId, setEditingEducationId] = useState<number | null>(
    null
  );

  // ================= PROJECTS =================

  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<number | null>(
    null
  );

  // ================= CERTIFICATIONS =================

  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certDescription, setCertDescription] = useState("");
  const [certUrl, setCertUrl] = useState("");
  const [certStatus, setCertStatus] = useState("Completed");
  const [editingCertificationId, setEditingCertificationId] =
    useState<number | null>(null);

  // ================= ACHIEVEMENTS =================

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementTitle, setAchievementTitle] = useState("");
  const [achievementDescription, setAchievementDescription] = useState("");
  const [achievementDate, setAchievementDate] = useState("");
  const [achievementLink, setAchievementLink] = useState("");
  const [editingAchievementId, setEditingAchievementId] =
    useState<number | null>(null);

  // ================= INTERNSHIPS =================

  const [internships, setInternships] = useState<Internship[]>([]);
  const [internshipTitle, setInternshipTitle] = useState("");
  const [internshipCompany, setInternshipCompany] = useState("");
  const [internshipDescription, setInternshipDescription] = useState("");
  const [internshipDuration, setInternshipDuration] = useState("");
  const [internshipDate, setInternshipDate] = useState("");
  const [internshipCertificate, setInternshipCertificate] = useState("");
  const [editingInternshipId, setEditingInternshipId] =
    useState<number | null>(null);

  // ================= COURSES =================

  const [courses, setCourses] = useState<Course[]>([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePlatform, setCoursePlatform] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseDate, setCourseDate] = useState("");
  const [courseCertificate, setCourseCertificate] = useState("");
  const [courseStatus, setCourseStatus] = useState("Completed");
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);

  // ================= SKILLS =================

  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillCategory, setSkillCategory] = useState("");
  const [skillName, setSkillName] = useState("");
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);

  // ================= LOAD EVERYTHING =================

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/admin/login");
        return;
      }

      setUserEmail(data.user.email || "");
      setLoading(false);

      await Promise.all([
        loadEducation(),
        loadProjects(),
        loadCertifications(),
        loadAchievements(),
        loadInternships(),
        loadCourses(),
        loadSkills(),
      ]);
    };

    checkUser();
  }, [router]);

  // ================= EDUCATION =================

  const loadEducation = async () => {
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setEducation(data || []);
  };

  const saveEducation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!educationLevel.trim() || !educationInstitution.trim()) {
      setMessage("Please enter education level and institution.");
      return;
    }

    const values = {
      level: educationLevel.trim(),
      institution: educationInstitution.trim(),
      year: educationYear.trim(),
      percentage: educationPercentage.trim(),
    };

    const result =
      editingEducationId !== null
        ? await supabase
            .from("education")
            .update(values)
            .eq("id", editingEducationId)
        : await supabase.from("education").insert(values);

    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
      return;
    }

    setMessage(
      editingEducationId !== null
        ? "Education updated successfully! ✏️"
        : "Education added successfully! 🎓"
    );

    clearEducation();
    await loadEducation();
  };

  const editEducation = (item: Education) => {
    setEditingEducationId(item.id);
    setEducationLevel(item.level);
    setEducationInstitution(item.institution);
    setEducationYear(item.year || "");
    setEducationPercentage(item.percentage || "");
    setActiveSection("education");
  };

  const deleteEducation = async (id: number) => {
    if (!window.confirm("Delete this education record?")) return;

    const { error } = await supabase
      .from("education")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    setMessage("Education deleted successfully. 🗑️");
    await loadEducation();
  };

  const clearEducation = () => {
    setEditingEducationId(null);
    setEducationLevel("");
    setEducationInstitution("");
    setEducationYear("");
    setEducationPercentage("");
  };

  // ================= PROJECTS =================

  const loadProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false });

    setProjects(data || []);
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage("Please enter a project title.");
      return;
    }

    const values = {
      title: title.trim(),
      description: description.trim(),
      technologies: technologies.trim(),
      github_url: githubUrl.trim(),
      live_url: liveUrl.trim(),
    };

    const result =
      editingProjectId !== null
        ? await supabase
            .from("projects")
            .update(values)
            .eq("id", editingProjectId)
        : await supabase.from("projects").insert(values);

    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
      return;
    }

    setMessage(
      editingProjectId !== null
        ? "Project updated successfully! ✏️"
        : "Project added successfully! 🎉"
    );

    clearProject();
    await loadProjects();
  };

  const editProject = (item: Project) => {
    setEditingProjectId(item.id);
    setTitle(item.title);
    setDescription(item.description || "");
    setTechnologies(item.technologies || "");
    setGithubUrl(item.github_url || "");
    setLiveUrl(item.live_url || "");
    setActiveSection("projects");
  };

  const deleteProject = async (id: number) => {
    if (!window.confirm("Delete this project?")) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    setMessage("Project deleted successfully. 🗑️");
    await loadProjects();
  };

  const clearProject = () => {
    setEditingProjectId(null);
    setTitle("");
    setDescription("");
    setTechnologies("");
    setGithubUrl("");
    setLiveUrl("");
  };

  // ================= CERTIFICATIONS =================

  const loadCertifications = async () => {
    const { data } = await supabase
      .from("certifications")
      .select("*")
      .order("id", { ascending: false });

    setCertifications(data || []);
  };

  const saveCertification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!certTitle.trim()) {
      setMessage("Please enter certificate title.");
      return;
    }

    const values = {
      title: certTitle.trim(),
      issuer: certIssuer.trim(),
      date: certDate.trim(),
      description: certDescription.trim(),
      certificate_url: certUrl.trim(),
      status: certStatus,
    };

    const result =
      editingCertificationId !== null
        ? await supabase
            .from("certifications")
            .update(values)
            .eq("id", editingCertificationId)
        : await supabase.from("certifications").insert(values);

    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
      return;
    }

    setMessage(
      editingCertificationId !== null
        ? "Certification updated! ✏️"
        : "Certification added! 📜"
    );

    clearCertification();
    await loadCertifications();
  };

  const editCertification = (item: Certification) => {
    setEditingCertificationId(item.id);
    setCertTitle(item.title);
    setCertIssuer(item.issuer || "");
    setCertDate(item.date || "");
    setCertDescription(item.description || "");
    setCertUrl(item.certificate_url || "");
    setCertStatus(item.status || "Completed");
    setActiveSection("certifications");
  };

  const deleteCertification = async (id: number) => {
    if (!window.confirm("Delete this certification?")) return;

    const { error } = await supabase
      .from("certifications")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    setMessage("Certification deleted. 🗑️");
    await loadCertifications();
  };

  const clearCertification = () => {
    setEditingCertificationId(null);
    setCertTitle("");
    setCertIssuer("");
    setCertDate("");
    setCertDescription("");
    setCertUrl("");
    setCertStatus("Completed");
  };

  // ================= ACHIEVEMENTS =================

  const loadAchievements = async () => {
    const { data } = await supabase
      .from("achievements")
      .select("*")
      .order("id", { ascending: false });

    setAchievements(data || []);
  };

  const saveAchievement = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!achievementTitle.trim()) {
      setMessage("Please enter achievement title.");
      return;
    }

    const values = {
      title: achievementTitle.trim(),
      description: achievementDescription.trim(),
      date: achievementDate.trim(),
      link: achievementLink.trim(),
    };

    const result =
      editingAchievementId !== null
        ? await supabase
            .from("achievements")
            .update(values)
            .eq("id", editingAchievementId)
        : await supabase.from("achievements").insert(values);

    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
      return;
    }

    setMessage(
      editingAchievementId !== null
        ? "Achievement updated! ✏️"
        : "Achievement added! 🏆"
    );

    clearAchievement();
    await loadAchievements();
  };

  const editAchievement = (item: Achievement) => {
    setEditingAchievementId(item.id);
    setAchievementTitle(item.title);
    setAchievementDescription(item.description || "");
    setAchievementDate(item.date || "");
    setAchievementLink(item.link || "");
    setActiveSection("achievements");
  };

  const deleteAchievement = async (id: number) => {
    if (!window.confirm("Delete this achievement?")) return;

    const { error } = await supabase
      .from("achievements")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    setMessage("Achievement deleted. 🗑️");
    await loadAchievements();
  };

  const clearAchievement = () => {
    setEditingAchievementId(null);
    setAchievementTitle("");
    setAchievementDescription("");
    setAchievementDate("");
    setAchievementLink("");
  };

  // ================= INTERNSHIPS =================

  const loadInternships = async () => {
    const { data } = await supabase
      .from("internships")
      .select("*")
      .order("id", { ascending: false });

    setInternships(data || []);
  };

  const saveInternship = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!internshipTitle.trim()) {
      setMessage("Please enter internship title.");
      return;
    }

    const values = {
      title: internshipTitle.trim(),
      company: internshipCompany.trim(),
      description: internshipDescription.trim(),
      duration: internshipDuration.trim(),
      date: internshipDate.trim(),
      certificate_url: internshipCertificate.trim(),
    };

    const result =
      editingInternshipId !== null
        ? await supabase
            .from("internships")
            .update(values)
            .eq("id", editingInternshipId)
        : await supabase.from("internships").insert(values);

    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
      return;
    }

    setMessage(
      editingInternshipId !== null
        ? "Internship updated! ✏️"
        : "Internship added! 💼"
    );

    clearInternship();
    await loadInternships();
  };

  const editInternship = (item: Internship) => {
    setEditingInternshipId(item.id);
    setInternshipTitle(item.title);
    setInternshipCompany(item.company || "");
    setInternshipDescription(item.description || "");
    setInternshipDuration(item.duration || "");
    setInternshipDate(item.date || "");
    setInternshipCertificate(item.certificate_url || "");
    setActiveSection("internships");
  };

  const deleteInternship = async (id: number) => {
    if (!window.confirm("Delete this internship?")) return;

    const { error } = await supabase
      .from("internships")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    setMessage("Internship deleted. 🗑️");
    await loadInternships();
  };

  const clearInternship = () => {
    setEditingInternshipId(null);
    setInternshipTitle("");
    setInternshipCompany("");
    setInternshipDescription("");
    setInternshipDuration("");
    setInternshipDate("");
    setInternshipCertificate("");
  };

  // ================= COURSES =================

  const loadCourses = async () => {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .order("id", { ascending: false });

    setCourses(data || []);
  };

  const saveCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseTitle.trim()) {
      setMessage("Please enter course title.");
      return;
    }

    const values = {
      title: courseTitle.trim(),
      platform: coursePlatform.trim(),
      description: courseDescription.trim(),
      date: courseDate.trim(),
      certificate_url: courseCertificate.trim(),
      status: courseStatus,
    };

    const result =
      editingCourseId !== null
        ? await supabase
            .from("courses")
            .update(values)
            .eq("id", editingCourseId)
        : await supabase.from("courses").insert(values);

    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
      return;
    }

    setMessage(
      editingCourseId !== null
        ? "Course updated! ✏️"
        : "Course added! 📚"
    );

    clearCourse();
    await loadCourses();
  };

  const editCourse = (item: Course) => {
    setEditingCourseId(item.id);
    setCourseTitle(item.title);
    setCoursePlatform(item.platform || "");
    setCourseDescription(item.description || "");
    setCourseDate(item.date || "");
    setCourseCertificate(item.certificate_url || "");
    setCourseStatus(item.status || "Completed");
    setActiveSection("courses");
  };

  const deleteCourse = async (id: number) => {
    if (!window.confirm("Delete this course?")) return;

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    setMessage("Course deleted. 🗑️");
    await loadCourses();
  };

  const clearCourse = () => {
    setEditingCourseId(null);
    setCourseTitle("");
    setCoursePlatform("");
    setCourseDescription("");
    setCourseDate("");
    setCourseCertificate("");
    setCourseStatus("Completed");
  };

  // ================= SKILLS =================

  const loadSkills = async () => {
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("id", { ascending: false });

    setSkills(data || []);
  };

  const saveSkill = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!skillCategory.trim() || !skillName.trim()) {
      setMessage("Please enter skill category and skill name.");
      return;
    }

    const values = {
      category: skillCategory.trim(),
      name: skillName.trim(),
    };

    const result =
      editingSkillId !== null
        ? await supabase
            .from("skills")
            .update(values)
            .eq("id", editingSkillId)
        : await supabase.from("skills").insert(values);

    if (result.error) {
      setMessage(`Error: ${result.error.message}`);
      return;
    }

    setMessage(
      editingSkillId !== null
        ? "Skill updated! ✏️"
        : "Skill added! 🛠️"
    );

    clearSkill();
    await loadSkills();
  };

  const editSkill = (item: Skill) => {
    setEditingSkillId(item.id);
    setSkillCategory(item.category);
    setSkillName(item.name);
    setActiveSection("skills");
  };

  const deleteSkill = async (id: number) => {
    if (!window.confirm("Delete this skill?")) return;

    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    setMessage("Skill deleted. 🗑️");
    await loadSkills();
  };

  const clearSkill = () => {
    setEditingSkillId(null);
    setSkillCategory("");
    setSkillName("");
  };

  // ================= LOGOUT =================

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p>Loading...</p>
      </main>
    );
  }

  // ================= UI HELPERS =================

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600";

  const navButton = (id: string, label: string, icon: string) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`w-full rounded-lg px-4 py-3 text-left font-semibold transition ${
        activeSection === id
          ? "bg-blue-600 text-white"
          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      }`}
    >
      {icon} {label}
    </button>
  );

  // ================= PAGE =================

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="flex flex-col gap-4 rounded-2xl bg-slate-900 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Welcome, {userEmail}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg bg-red-600 px-5 py-3 font-semibold hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* MESSAGE */}

        {message && (
          <div className="mt-6 rounded-lg bg-slate-800 p-4 text-sm">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">

          {/* SIDEBAR */}

          <aside className="space-y-2">
            {navButton("education", "Education", "🎓")}
            {navButton("projects", "Projects", "💻")}
            {navButton("certifications", "Certifications", "📜")}
            {navButton("achievements", "Achievements", "🏆")}
            {navButton("internships", "Internships", "💼")}
            {navButton("courses", "Courses", "📚")}
            {navButton("skills", "Skills", "🛠️")}
          </aside>

          {/* CONTENT */}

          <div>

            {/* ================= EDUCATION ================= */}

            {activeSection === "education" && (
              <div>
                <section className="rounded-2xl bg-white p-6 text-slate-900 shadow-xl">
                  <h2 className="text-2xl font-bold">
                    {editingEducationId !== null
                      ? "Edit Education"
                      : "Add Education"}
                  </h2>

                  <form
                    onSubmit={saveEducation}
                    className="mt-6 space-y-5"
                  >
                    <input
                      value={educationLevel}
                      onChange={(e) =>
                        setEducationLevel(e.target.value)
                      }
                      placeholder="Education Level - e.g. B.E. Computer Science and Engineering"
                      className={inputClass}
                    />

                    <input
                      value={educationInstitution}
                      onChange={(e) =>
                        setEducationInstitution(e.target.value)
                      }
                      placeholder="Institution"
                      className={inputClass}
                    />

                    <input
                      value={educationYear}
                      onChange={(e) =>
                        setEducationYear(e.target.value)
                      }
                      placeholder="Year / Expected Graduation"
                      className={inputClass}
                    />

                    <input
                      value={educationPercentage}
                      onChange={(e) =>
                        setEducationPercentage(e.target.value)
                      }
                      placeholder="Percentage / CGPA"
                      className={inputClass}
                    />

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                      >
                        {editingEducationId !== null
                          ? "Update Education"
                          : "Add Education"}
                      </button>

                      {editingEducationId !== null && (
                        <button
                          type="button"
                          onClick={clearEducation}
                          className="rounded-lg bg-slate-200 px-5 py-3 font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </section>

                <div className="mt-6 space-y-4">
                  {education.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-white p-6 text-slate-900 shadow"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold">
                            {item.level}
                          </h3>
                          <p className="mt-2">
                            {item.institution}
                          </p>
                          <p className="mt-2 text-sm text-slate-600">
                            {item.year} • {item.percentage}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => editEducation(item)}
                            className="rounded-lg bg-slate-800 px-4 py-2 text-white"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteEducation(item.id)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= PROJECTS ================= */}

            {activeSection === "projects" && (
              <div>
                <section className="rounded-2xl bg-white p-6 text-slate-900 shadow-xl">
                  <h2 className="text-2xl font-bold">
                    {editingProjectId !== null
                      ? "Edit Project"
                      : "Add Project"}
                  </h2>

                  <form
                    onSubmit={saveProject}
                    className="mt-6 space-y-5"
                  >
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Project Title"
                      className={inputClass}
                    />

                    <textarea
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                      placeholder="Description"
                      rows={5}
                      className={inputClass}
                    />

                    <input
                      value={technologies}
                      onChange={(e) =>
                        setTechnologies(e.target.value)
                      }
                      placeholder="Technologies - React, Node.js, MongoDB"
                      className={inputClass}
                    />

                    <input
                      value={githubUrl}
                      onChange={(e) =>
                        setGithubUrl(e.target.value)
                      }
                      placeholder="GitHub URL"
                      className={inputClass}
                    />

                    <input
                      value={liveUrl}
                      onChange={(e) =>
                        setLiveUrl(e.target.value)
                      }
                      placeholder="Live Project URL"
                      className={inputClass}
                    />

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
                      >
                        {editingProjectId !== null
                          ? "Update Project"
                          : "Add Project"}
                      </button>

                      {editingProjectId !== null && (
                        <button
                          type="button"
                          onClick={clearProject}
                          className="rounded-lg bg-slate-200 px-5 py-3 font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </section>

                <div className="mt-6 space-y-4">
                  {projects.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-white p-6 text-slate-900 shadow"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-slate-600">
                            {item.description}
                          </p>

                          <p className="mt-2 text-sm font-semibold">
                            {item.technologies}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => editProject(item)}
                            className="rounded-lg bg-slate-800 px-4 py-2 text-white"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteProject(item.id)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= CERTIFICATIONS ================= */}

            {activeSection === "certifications" && (
              <div>
                <section className="rounded-2xl bg-white p-6 text-slate-900 shadow-xl">
                  <h2 className="text-2xl font-bold">
                    {editingCertificationId !== null
                      ? "Edit Certification"
                      : "Add Certification"}
                  </h2>

                  <form
                    onSubmit={saveCertification}
                    className="mt-6 space-y-5"
                  >
                    <input
                      value={certTitle}
                      onChange={(e) => setCertTitle(e.target.value)}
                      placeholder="Certificate Name"
                      className={inputClass}
                    />

                    <input
                      value={certIssuer}
                      onChange={(e) => setCertIssuer(e.target.value)}
                      placeholder="Issuing Organization"
                      className={inputClass}
                    />

                    <input
                      value={certDate}
                      onChange={(e) => setCertDate(e.target.value)}
                      placeholder="Date / Year"
                      className={inputClass}
                    />

                    <textarea
                      value={certDescription}
                      onChange={(e) =>
                        setCertDescription(e.target.value)
                      }
                      placeholder="Description"
                      rows={4}
                      className={inputClass}
                    />

                    <input
                      value={certUrl}
                      onChange={(e) => setCertUrl(e.target.value)}
                      placeholder="Certificate URL"
                      className={inputClass}
                    />

                    <select
                      value={certStatus}
                      onChange={(e) => setCertStatus(e.target.value)}
                      className={inputClass}
                    >
                      <option>Completed</option>
                      <option>In Progress</option>
                    </select>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
                      >
                        {editingCertificationId !== null
                          ? "Update Certification"
                          : "Add Certification"}
                      </button>

                      {editingCertificationId !== null && (
                        <button
                          type="button"
                          onClick={clearCertification}
                          className="rounded-lg bg-slate-200 px-5 py-3 font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </section>

                <div className="mt-6 space-y-4">
                  {certifications.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-white p-6 text-slate-900 shadow"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-slate-600">
                            {item.issuer}
                          </p>

                          <p className="mt-1 text-sm">
                            {item.date} • {item.status}
                          </p>

                          {item.certificate_url && (
                            <a
                              href={item.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block font-semibold text-blue-600 underline"
                            >
                              View Certificate
                            </a>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => editCertification(item)}
                            className="rounded-lg bg-slate-800 px-4 py-2 text-white"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteCertification(item.id)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= ACHIEVEMENTS ================= */}

            {activeSection === "achievements" && (
              <div>
                <section className="rounded-2xl bg-white p-6 text-slate-900 shadow-xl">
                  <h2 className="text-2xl font-bold">
                    {editingAchievementId !== null
                      ? "Edit Achievement"
                      : "Add Achievement"}
                  </h2>

                  <form
                    onSubmit={saveAchievement}
                    className="mt-6 space-y-5"
                  >
                    <input
                      value={achievementTitle}
                      onChange={(e) =>
                        setAchievementTitle(e.target.value)
                      }
                      placeholder="Achievement Title"
                      className={inputClass}
                    />

                    <textarea
                      value={achievementDescription}
                      onChange={(e) =>
                        setAchievementDescription(e.target.value)
                      }
                      placeholder="Description"
                      rows={5}
                      className={inputClass}
                    />

                    <input
                      value={achievementDate}
                      onChange={(e) =>
                        setAchievementDate(e.target.value)
                      }
                      placeholder="Date / Year"
                      className={inputClass}
                    />

                    <input
                      value={achievementLink}
                      onChange={(e) =>
                        setAchievementLink(e.target.value)
                      }
                      placeholder="Achievement Link (optional)"
                      className={inputClass}
                    />

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
                      >
                        {editingAchievementId !== null
                          ? "Update Achievement"
                          : "Add Achievement"}
                      </button>

                      {editingAchievementId !== null && (
                        <button
                          type="button"
                          onClick={clearAchievement}
                          className="rounded-lg bg-slate-200 px-5 py-3 font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </section>

                <div className="mt-6 space-y-4">
                  {achievements.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-white p-6 text-slate-900 shadow"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-slate-600">
                            {item.description}
                          </p>

                          <p className="mt-2 text-sm">
                            {item.date}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => editAchievement(item)}
                            className="rounded-lg bg-slate-800 px-4 py-2 text-white"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteAchievement(item.id)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= INTERNSHIPS ================= */}

            {activeSection === "internships" && (
              <div>
                <section className="rounded-2xl bg-white p-6 text-slate-900 shadow-xl">
                  <h2 className="text-2xl font-bold">
                    {editingInternshipId !== null
                      ? "Edit Internship"
                      : "Add Internship"}
                  </h2>

                  <form
                    onSubmit={saveInternship}
                    className="mt-6 space-y-5"
                  >
                    <input
                      value={internshipTitle}
                      onChange={(e) =>
                        setInternshipTitle(e.target.value)
                      }
                      placeholder="Internship Title"
                      className={inputClass}
                    />

                    <input
                      value={internshipCompany}
                      onChange={(e) =>
                        setInternshipCompany(e.target.value)
                      }
                      placeholder="Company / Organization"
                      className={inputClass}
                    />

                    <textarea
                      value={internshipDescription}
                      onChange={(e) =>
                        setInternshipDescription(e.target.value)
                      }
                      placeholder="Description"
                      rows={5}
                      className={inputClass}
                    />

                    <input
                      value={internshipDuration}
                      onChange={(e) =>
                        setInternshipDuration(e.target.value)
                      }
                      placeholder="Duration - e.g. 1 Month"
                      className={inputClass}
                    />

                    <input
                      value={internshipDate}
                      onChange={(e) =>
                        setInternshipDate(e.target.value)
                      }
                      placeholder="Date / Year"
                      className={inputClass}
                    />

                    <input
                      value={internshipCertificate}
                      onChange={(e) =>
                        setInternshipCertificate(e.target.value)
                      }
                      placeholder="Certificate URL"
                      className={inputClass}
                    />

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
                      >
                        {editingInternshipId !== null
                          ? "Update Internship"
                          : "Add Internship"}
                      </button>

                      {editingInternshipId !== null && (
                        <button
                          type="button"
                          onClick={clearInternship}
                          className="rounded-lg bg-slate-200 px-5 py-3 font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </section>

                <div className="mt-6 space-y-4">
                  {internships.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-white p-6 text-slate-900 shadow"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold">
                            {item.title}
                          </h3>

                          <p className="mt-1 font-medium">
                            {item.company}
                          </p>

                          <p className="mt-2 text-slate-600">
                            {item.description}
                          </p>

                          <p className="mt-2 text-sm">
                            {item.duration} • {item.date}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => editInternship(item)}
                            className="rounded-lg bg-slate-800 px-4 py-2 text-white"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteInternship(item.id)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= COURSES ================= */}

            {activeSection === "courses" && (
              <div>
                <section className="rounded-2xl bg-white p-6 text-slate-900 shadow-xl">
                  <h2 className="text-2xl font-bold">
                    {editingCourseId !== null
                      ? "Edit Course"
                      : "Add Course"}
                  </h2>

                  <form
                    onSubmit={saveCourse}
                    className="mt-6 space-y-5"
                  >
                    <input
                      value={courseTitle}
                      onChange={(e) =>
                        setCourseTitle(e.target.value)
                      }
                      placeholder="Course Name"
                      className={inputClass}
                    />

                    <input
                      value={coursePlatform}
                      onChange={(e) =>
                        setCoursePlatform(e.target.value)
                      }
                      placeholder="Platform - NPTEL, Infosys Springboard, AWS..."
                      className={inputClass}
                    />

                    <textarea
                      value={courseDescription}
                      onChange={(e) =>
                        setCourseDescription(e.target.value)
                      }
                      placeholder="Course Description"
                      rows={4}
                      className={inputClass}
                    />

                    <input
                      value={courseDate}
                      onChange={(e) =>
                        setCourseDate(e.target.value)
                      }
                      placeholder="Date / Year"
                      className={inputClass}
                    />

                    <input
                      value={courseCertificate}
                      onChange={(e) =>
                        setCourseCertificate(e.target.value)
                      }
                      placeholder="Certificate URL"
                      className={inputClass}
                    />

                    <select
                      value={courseStatus}
                      onChange={(e) => setCourseStatus(e.target.value)}
                      className={inputClass}
                    >
                      <option>Completed</option>
                      <option>In Progress</option>
                    </select>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
                      >
                        {editingCourseId !== null
                          ? "Update Course"
                          : "Add Course"}
                      </button>

                      {editingCourseId !== null && (
                        <button
                          type="button"
                          onClick={clearCourse}
                          className="rounded-lg bg-slate-200 px-5 py-3 font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </section>

                <div className="mt-6 space-y-4">
                  {courses.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-white p-6 text-slate-900 shadow"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-slate-600">
                            {item.platform}
                          </p>

                          <p className="mt-2 text-sm">
                            {item.date} • {item.status}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => editCourse(item)}
                            className="rounded-lg bg-slate-800 px-4 py-2 text-white"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteCourse(item.id)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= SKILLS ================= */}

            {activeSection === "skills" && (
              <div>
                <section className="rounded-2xl bg-white p-6 text-slate-900 shadow-xl">
                  <h2 className="text-2xl font-bold">
                    {editingSkillId !== null
                      ? "Edit Skill"
                      : "Add Skill"}
                  </h2>

                  <form
                    onSubmit={saveSkill}
                    className="mt-6 space-y-5"
                  >
                    <input
                      value={skillCategory}
                      onChange={(e) =>
                        setSkillCategory(e.target.value)
                      }
                      placeholder="Category - Programming, Web Development, Tools..."
                      className={inputClass}
                    />

                    <input
                      value={skillName}
                      onChange={(e) =>
                        setSkillName(e.target.value)
                      }
                      placeholder="Skill - Python, Java, React..."
                      className={inputClass}
                    />

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
                      >
                        {editingSkillId !== null
                          ? "Update Skill"
                          : "Add Skill"}
                      </button>

                      {editingSkillId !== null && (
                        <button
                          type="button"
                          onClick={clearSkill}
                          className="rounded-lg bg-slate-200 px-5 py-3 font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </section>

                <div className="mt-6 space-y-4">
                  {skills.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 rounded-xl bg-white p-6 text-slate-900 shadow sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-blue-600">
                          {item.category}
                        </p>

                        <h3 className="mt-1 text-xl font-bold">
                          {item.name}
                        </h3>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => editSkill(item)}
                          className="rounded-lg bg-slate-800 px-4 py-2 text-white"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteSkill(item.id)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}