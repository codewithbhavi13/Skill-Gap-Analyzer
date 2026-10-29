
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  createJobDescription,
  extractSkillsFromJobDescription,
  getAllJobDescriptions,
  uploadPdfJobDescription,
} from "../../features/job-description/jobDescription.service";
import type {
  CreateJobDescriptionInput,
} from "../../features/job-description/jobDescription.service";
import type {
  JobDescription,
  ExtractedSkillsResult,
} from "../../features/job-description/types";
import { getAllRoles } from "../../features/role-management/roleManagement.service";
import type { Role } from "../../features/role-management/types";

type InputMode = "text" | "pdf";

const JobDescriptionPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);

  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [extractingId, setExtractingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [extraction, setExtraction] =
    useState<ExtractedSkillsResult | null>(null);

  const loadData = useCallback(async () => {
    setError("");

    try {
      const [rolesData, descriptionsData] = await Promise.all([
        getAllRoles(),
        getAllJobDescriptions(),
      ]);

      setRoles(rolesData);
      setJobDescriptions(descriptionsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load job descriptions.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleModeChange = (mode: InputMode) => {
    setInputMode(mode);
    setError("");
    setSuccess("");
    setExtraction(null);
  };

  const handleFileChange = (file: File | null) => {
    setError("");
    setPdfFile(null);

    if (!file) return;

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a valid PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The PDF file must be 5 MB or smaller.");
      return;
    }

    setPdfFile(file);

    if (!title.trim()) {
      setTitle(file.name.replace(/\.pdf$/i, ""));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setExtraction(null);

    if (title.trim().length < 3) {
      setError("Job title must contain at least 3 characters.");
      return;
    }

    if (!targetRole) {
      setError("Please select a target role.");
      return;
    }

    if (inputMode === "text" && description.trim().length < 50) {
      setError("Job description must contain at least 50 characters.");
      return;
    }

    if (inputMode === "pdf" && !pdfFile) {
      setError("Please select a PDF file to upload.");
      return;
    }

    setSaving(true);

    try {
      if (inputMode === "text") {
        const input: CreateJobDescriptionInput = {
          title: title.trim(),
          description: description.trim(),
          inputType: "text",
          targetRole,
          ...(company.trim() ? { company: company.trim() } : {}),
        };

        await createJobDescription(input);
      } else {
        await uploadPdfJobDescription({
          title: title.trim(),
          targetRole,
          file: pdfFile!,
          ...(company.trim() ? { company: company.trim() } : {}),
        });
      }

      setTitle("");
      setCompany("");
      setDescription("");
      setTargetRole("");
      setPdfFile(null);
      setSuccess(
        inputMode === "pdf"
          ? "PDF uploaded and job description saved successfully."
          : "Job description saved successfully.",
      );

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save the job description.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleExtractSkills = async (id: string) => {
    setError("");
    setSuccess("");
    setExtraction(null);
    setExtractingId(id);

    try {
      const result = await extractSkillsFromJobDescription(id);
      setExtraction(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to extract skills.",
      );
    } finally {
      setExtractingId("");
    }
  };

  if (loading) {
    return <p>Loading job descriptions...</p>;
  }

  return (
    <main>
      <h1>Job Description Analysis</h1>
      <p>
        Add a job description using text or upload a PDF, then identify
        the skills mentioned in it.
      </p>

      {error && <p role="alert">{error}</p>}
      {success && <p role="status">{success}</p>}

      <section>
        <h2>Add Job Description</h2>

        <div>
          <label htmlFor="input-mode">Input Type</label>
          <select
            id="input-mode"
            value={inputMode}
            onChange={(event) =>
              handleModeChange(event.target.value as InputMode)
            }
            disabled={saving}
          >
            <option value="text">Enter Text</option>
            <option value="pdf">Upload PDF</option>
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="job-title">Job Title</label>
            <input
              id="job-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Full-Stack Developer"
              minLength={3}
              maxLength={200}
              required
            />
          </div>

          <div>
            <label htmlFor="job-company">Company (optional)</label>
            <input
              id="job-company"
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Enter company name"
              maxLength={200}
            />
          </div>

          <div>
            <label htmlFor="target-role">Target Role</label>
            <select
              id="target-role"
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              required
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {inputMode === "text" ? (
            <div>
              <label htmlFor="job-description">Job Description</label>
              <textarea
                id="job-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Paste the complete job description here..."
                rows={8}
                minLength={50}
                maxLength={20000}
                required
              />
              <p>Enter between 50 and 20,000 characters.</p>
            </div>
          ) : (
            <div>
              <label htmlFor="pdf-file">Upload Job Description PDF</label>
              <input
                id="pdf-file"
                type="file"
                accept=".pdf,application/pdf"
                onChange={(event) =>
                  handleFileChange(event.target.files?.[0] ?? null)
                }
                required
              />
              <p>PDF only. Maximum file size: 5 MB.</p>

              {pdfFile && (
                <p>
                  Selected file: <strong>{pdfFile.name}</strong>
                </p>
              )}
            </div>
          )}

          <button type="submit" disabled={saving}>
            {saving
              ? inputMode === "pdf"
                ? "Uploading PDF..."
                : "Saving..."
              : inputMode === "pdf"
                ? "Upload PDF and Save"
                : "Save Job Description"}
          </button>
        </form>
      </section>

      <section>
        <h2>Saved Job Descriptions</h2>

        {jobDescriptions.length === 0 ? (
          <p>No job descriptions have been added yet.</p>
        ) : (
          <ul>
            {jobDescriptions.map((job) => {
              const roleName =
                typeof job.targetRole === "string"
                  ? job.targetRole
                  : job.targetRole?.name;

              return (
                <li key={job._id}>
                  <article>
                    <h3>{job.title}</h3>

                    {job.company && <p>Company: {job.company}</p>}

                    <p>Target Role: {roleName || "Not specified"}</p>
                    <p>
                      Input Type:{" "}
                      {job.inputType === "pdf" ? "PDF" : "Text"}
                    </p>

                    {job.originalFileName && (
                      <p>Original File: {job.originalFileName}</p>
                    )}

                    <p>
                      Added:{" "}
                      {job.createdAt
                        ? new Date(job.createdAt).toLocaleDateString()
                        : "Date unavailable"}
                    </p>

                    <button
                      type="button"
                      disabled={extractingId !== ""}
                      onClick={() => void handleExtractSkills(job._id)}
                    >
                      {extractingId === job._id
                        ? "Extracting Skills..."
                        : "Extract Skills"}
                    </button>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {extraction && (
        <section>
          <h2>Extracted Skills</h2>
          <p>
            Job Description: <strong>{extraction.title}</strong>
          </p>
          <p>
            Total matched skills: {extraction.totalMatchedSkills}
          </p>

          {extraction.matchedSkills.length === 0 ? (
            <p>No matching skills were found in this description.</p>
          ) : (
            <ul>
              {extraction.matchedSkills.map((skill) => (
                <li key={skill.id}>
                  <strong>{skill.name}</strong>
                  {skill.category && <span> — {skill.category}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
};

export default JobDescriptionPage;
