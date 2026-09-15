"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const STORAGE_BUCKET = "portfolio-media";

type Section = {
  key: string;
  label: string;
  icon: string;
  table: string;
  fields: { key: string; label: string; type?: "textarea" | "select"; options?: string[]; required?: boolean }[];
};

const sections: Section[] = [
  {
    key: "education", label: "Education", icon: "🎓", table: "education",
    fields: [
      { key: "level", label: "Education Level", required: true },
      { key: "institution", label: "Institution", required: true },
      { key: "year", label: "Year / Expected Graduation" },
      { key: "percentage", label: "Percentage / CGPA" },
    ],
  },
  {
    key: "projects", label: "Projects", icon: "💻", table: "projects",
    fields: [
      { key: "title", label: "Project Title", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "technologies", label: "Technologies" },
      { key: "github_url", label: "GitHub URL" },
      { key: "live_url", label: "Live Project URL" },
    ],
  },
  {
    key: "certifications", label: "Certifications", icon: "📜", table: "certifications",
    fields: [
      { key: "title", label: "Certificate Name", required: true },
      { key: "issuer", label: "Issuing Organization" },
      { key: "date", label: "Date / Year" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "certificate_url", label: "Certificate URL" },
      { key: "status", label: "Status", type: "select", options: ["Completed", "In Progress"] },
    ],
  },
  {
    key: "achievements", label: "Achievements", icon: "🏆", table: "achievements",
    fields: [
      { key: "title", label: "Achievement Title", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "date", label: "Date / Year" },
      { key: "link", label: "Achievement Link" },
    ],
  },
  {
    key: "internships", label: "Internships", icon: "💼", table: "internships",
    fields: [
      { key: "title", label: "Internship Title", required: true },
      { key: "company", label: "Company / Organization" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "duration", label: "Duration" },
      { key: "date", label: "Date / Year" },
      { key: "certificate_url", label: "Certificate URL" },
    ],
  },
  {
    key: "courses", label: "Courses", icon: "📚", table: "courses",
    fields: [
      { key: "title", label: "Course Name", required: true },
      { key: "platform", label: "Platform" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "date", label: "Date / Year" },
      { key: "certificate_url", label: "Certificate URL" },
      { key: "status", label: "Status", type: "select", options: ["Completed", "In Progress"] },
    ],
  },
  {
    key: "skills", label: "Skills", icon: "🛠️", table: "skills",
    fields: [
      { key: "category", label: "Category", required: true },
      { key: "name", label: "Skill", required: true },
    ],
  },
];

const emptyValues = (section: Section) =>
  Object.fromEntries(section.fields.map((field) => [field.key, field.options?.[0] ?? ""]));

export default function AdminPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [activeKey, setActiveKey] = useState("education");
  const [rows, setRows] = useState<Record<string, Record<string, unknown>[]>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [projectImageUrls, setProjectImageUrls] = useState<string[]>([]);
  const [certificateImage, setCertificateImage] = useState<File | null>(null);
  const [certificateImageUrl, setCertificateImageUrl] = useState("");

  const active = useMemo(
    () => sections.find((section) => section.key === activeKey) ?? sections[0],
    [activeKey]
  );

  const loadSection = async (section: Section) => {
    const { data, error } = await supabase
      .from(section.table)
      .select("*")
      .order("id", { ascending: false });
    if (error) {
      setMessage(`Error loading ${section.label}: ${error.message}`);
      return;
    }
    setRows((current) => ({ ...current, [section.key]: (data ?? []) as Record<string, unknown>[] }));
  };

  useEffect(() => {
    let alive = true;
    const start = async () => {
      setLoading(true);
      setAuthError("");
      const timeout = new Promise<never>((_, reject) =>
        window.setTimeout(() => reject(new Error("Authentication check timed out.")), 10000)
      );
      try {
        const result = await Promise.race([supabase.auth.getSession(), timeout]);
        if (!alive) return;
        const session = result.data.session;
        if (!session?.user) {
          router.replace("/admin/login");
          return;
        }
        setUserEmail(session.user.email ?? "");
        await Promise.all(sections.map(loadSection));
      } catch (error) {
        if (!alive) return;
        console.error("Admin auth error:", error);
        setAuthError(error instanceof Error ? error.message : "Unable to load the admin session.");
      } finally {
        if (alive) setLoading(false);
      }
    };
    start();
    return () => { alive = false; };
  }, [router]);

  const resetImages = () => {
    setProjectImages([]);
    setProjectImageUrls([]);
    setCertificateImage(null);
    setCertificateImageUrl("");
  };

  const switchSection = (section: Section) => {
    setActiveKey(section.key);
    setValues(emptyValues(section));
    setEditingId(null);
    resetImages();
    setMessage("");
  };

  const editRow = (row: Record<string, unknown>) => {
    setEditingId(Number(row.id));
    setValues(Object.fromEntries(active.fields.map((field) => [field.key, String(row[field.key] ?? "")] )));
    if (active.key === "projects") {
      setProjectImageUrls(Array.isArray(row.image_urls) ? row.image_urls.map(String) : []);
      setProjectImages([]);
    } else if (active.key === "certifications") {
      setCertificateImageUrl(typeof row.image_url === "string" ? row.image_url : "");
      setCertificateImage(null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearForm = () => {
    setEditingId(null);
    setValues(emptyValues(active));
    resetImages();
  };

  const uploadFile = async (file: File, folder: string) => {
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
    const path = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });
    if (error) throw new Error(`Image upload failed: ${error.message}`);
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    for (const field of active.fields) {
      if (field.required && !values[field.key]?.trim()) {
        setMessage(`Please enter ${field.label}.`);
        return;
      }
    }
    setSaving(true);
    setMessage("");
    try {
      const payload: Record<string, unknown> = Object.fromEntries(
        active.fields.map((field) => [field.key, values[field.key]?.trim() ?? ""])
      );
      if (active.key === "projects" && projectImages.length > 0) {
        setMessage("Uploading project screenshots... 📸");
        const uploaded: string[] = [];
        for (const file of projectImages) uploaded.push(await uploadFile(file, "projects"));
        payload.image_urls = [...projectImageUrls, ...uploaded];
      } else if (active.key === "projects") {
        payload.image_urls = projectImageUrls;
      }
      if (active.key === "certifications") {
        if (certificateImage) {
          setMessage("Uploading certificate image... 📜");
          payload.image_url = await uploadFile(certificateImage, "certificates");
        } else {
          payload.image_url = certificateImageUrl || null;
        }
      }
      const result = editingId === null
        ? await supabase.from(active.table).insert(payload)
        : await supabase.from(active.table).update(payload).eq("id", editingId);
      if (result.error) throw new Error(result.error.message);
      setMessage(editingId === null ? `${active.label} added successfully! 🎉` : `${active.label} updated successfully! ✏️`);
      clearForm();
      await loadSection(active);
    } catch (error) {
      console.error("Admin save error:", error);
      setMessage(`Error: ${error instanceof Error ? error.message : "Unable to save."}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm(`Delete this ${active.label.toLowerCase()} record?`)) return;
    const { error } = await supabase.from(active.table).delete().eq("id", id);
    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }
    setMessage(`${active.label} deleted. 🗑️`);
    await loadSection(active);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const removeProjectImage = (index: number) => {
    setProjectImageUrls((urls) => urls.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
          <h1 className="text-xl font-semibold">Opening Admin Dashboard...</h1>
          <p className="mt-2 text-sm text-slate-400">Checking your authenticated session.</p>
        </div>
      </main>
    );
  }

  if (authError) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-2xl bg-slate-900 p-7 shadow-2xl">
          <h1 className="text-2xl font-bold">Admin session could not be loaded</h1>
          <p className="mt-3 text-slate-300">{authError}</p>
          <button onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700">Try Again</button>
        </div>
      </main>
    );
  }

  const currentRows = rows[active.key] ?? [];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">Portfolio CMS</p>
            <h1 className="mt-1 text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-slate-400">Signed in as {userEmail}</p>
          </div>
          <button onClick={logout} className="rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-700">Logout</button>
        </header>

        {message && <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-sm">{message}</div>}

        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="space-y-2">
            {sections.map((section) => (
              <button key={section.key} onClick={() => switchSection(section)} className={`w-full rounded-xl px-4 py-3 text-left font-semibold transition ${active.key === section.key ? "bg-blue-600 text-white shadow-lg" : "bg-slate-900 text-slate-300 hover:bg-slate-800"}`}>
                {section.icon} {section.label}
              </button>
            ))}
          </aside>

          <section>
            <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-blue-600">{active.icon} {active.label}</p>
                  <h2 className="mt-1 text-2xl font-bold">{editingId === null ? `Add ${active.label}` : `Edit ${active.label}`}</h2>
                </div>
                {editingId !== null && <button type="button" onClick={clearForm} className="rounded-xl bg-slate-200 px-4 py-2 font-semibold">Cancel</button>}
              </div>

              <form onSubmit={save} className="mt-6 grid gap-5 sm:grid-cols-2">
                {active.fields.map((field) => (
                  <label key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                    <span className="mb-2 block text-sm font-semibold text-slate-700">{field.label}{field.required ? " *" : ""}</span>
                    {field.type === "textarea" ? (
                      <textarea rows={5} value={values[field.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
                    ) : field.type === "select" ? (
                      <select value={values[field.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500">
                        {field.options?.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    ) : (
                      <input value={values[field.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
                    )}
                  </label>
                ))}

                {active.key === "projects" && (
                  <div className="sm:col-span-2 rounded-2xl border border-dashed border-blue-300 bg-blue-50 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">📸 Project Screenshots</p>
                        <p className="mt-1 text-sm text-slate-600">Select multiple images. They will upload automatically when you save.</p>
                      </div>
                      <label className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
                        + Upload Screenshots
                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setProjectImages(Array.from(e.target.files ?? []))} />
                      </label>
                    </div>
                    {(projectImages.length > 0 || projectImageUrls.length > 0) && (
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {projectImageUrls.map((url, index) => (
                          <div key={url} className="relative overflow-hidden rounded-xl border bg-white">
                            <img src={url} alt={`Project screenshot ${index + 1}`} className="h-28 w-full object-cover" />
                            <button type="button" onClick={() => removeProjectImage(index)} className="absolute right-1.5 top-1.5 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">✕</button>
                          </div>
                        ))}
                        {projectImages.map((file) => (
                          <div key={`${file.name}-${file.lastModified}`} className="overflow-hidden rounded-xl border bg-white">
                            <img src={URL.createObjectURL(file)} alt={file.name} className="h-28 w-full object-cover" />
                            <p className="truncate px-2 py-1 text-xs text-slate-600">{file.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {active.key === "certifications" && (
                  <div className="sm:col-span-2 rounded-2xl border border-dashed border-violet-300 bg-violet-50 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-bold text-slate-900">📜 Certificate Image</p>
                        <p className="mt-1 text-sm text-slate-600">Upload the certificate image directly from your computer.</p>
                      </div>
                      <label className="cursor-pointer rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-700">
                        + Upload Certificate
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setCertificateImage(e.target.files?.[0] ?? null)} />
                      </label>
                    </div>
                    {(certificateImage || certificateImageUrl.length > 0) && (
                      <div className="mt-4 max-w-sm overflow-hidden rounded-xl border bg-white">
                        <img src={certificateImage ? URL.createObjectURL(certificateImage) : certificateImageUrl} alt="Certificate preview" className="max-h-64 w-full object-contain" />
                        <button type="button" onClick={() => { setCertificateImage(null); setCertificateImageUrl(""); }} className="w-full border-t px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Remove image</button>
                      </div>
                    )}
                  </div>
                )}

                <button disabled={saving} type="submit" className="sm:col-span-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                  {saving ? "Saving..." : editingId === null ? `Add ${active.label}` : `Update ${active.label}`}
                </button>
              </form>
            </div>

            <div className="mt-6 space-y-4">
              {currentRows.length === 0 ? (
                <div className="rounded-2xl bg-slate-900 p-8 text-center text-slate-400">No {active.label.toLowerCase()} records yet.</div>
              ) : currentRows.map((row) => (
                <article key={String(row.id)} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold">{String(row.title ?? row.name ?? row.level ?? "Record")}</h3>
                      {active.fields.slice(1).map((field) => row[field.key] ? (
                        <p key={field.key} className="mt-2 text-sm text-slate-400"><span className="font-semibold text-slate-300">{field.label}:</span> {String(row[field.key])}</p>
                      ) : null)}
                      {active.key === "projects" && Array.isArray(row.image_urls) && row.image_urls.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {row.image_urls.map((url, index) => <img key={String(url)} src={String(url)} alt={`Screenshot ${index + 1}`} className="h-16 w-24 rounded-lg object-cover" />)}
                        </div>
                      )}
                      {active.key === "certifications" && typeof row.image_url === "string" && row.image_url.length > 0 && (
                        <img src={row.image_url} alt="Certificate" className="mt-4 h-20 max-w-32 rounded-lg object-contain bg-white" />
                      )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button onClick={() => editRow(row)} className="rounded-lg bg-slate-700 px-4 py-2 font-semibold hover:bg-slate-600">Edit</button>
                      <button onClick={() => remove(Number(row.id))} className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-700">Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
