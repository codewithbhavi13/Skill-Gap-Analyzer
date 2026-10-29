import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  createJobDescription,
  extractSkillsFromJobDescription,
  getAllJobDescriptions,
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

const JobDescriptionPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const input: CreateJobDescriptionInput = {
      title: title.trim(),
      description: description.trim(),
      inputType: "text",
      targetRole,
      ...(company.trim() ? { company: company.trim() } : {}),
    };

    setSaving(true);

    try {
      await createJobDescription(input);

      setTitle("");
      setCompany("");
      setDescription("");
      setTargetRole("");
      setExtraction(null);
      setSuccess("Job description saved successfully.");

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
        Add a job description, choose its target role, and identify the
        skills mentioned in the description.
      </p>

      {error && <p role="alert">{error}</p>}
      {success && <p role="status">{success}</p>}

      <section>
        <h2>Add Job Description</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="job-title">Job Title</label>
            <input
              id="job-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Full-Stack Developer"
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

          <div>
            <label htmlFor="job-description">Job Description</label>
            <textarea
              id="job-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Paste the job description here..."
              rows={8}
              required
            />
          </div>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Job Description"}
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
