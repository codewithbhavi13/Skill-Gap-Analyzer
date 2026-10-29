import { useEffect, useState, type FormEvent } from "react";
import {
  getMyLearnerProfile,
  getAvailableRoles,
  saveMyLearnerProfile,
} from "../../features/learner/learner.service";
import type {
  EducationLevel,
  LearnerProfile,
  LearnerProfileInput,
  ProfessionalStatus,
  Role,
} from "../../features/learner/types";

const educationLevels: { value: EducationLevel; label: string }[] = [
  { value: "high_school", label: "High School" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelors", label: "Bachelor's" },
  { value: "masters", label: "Master's" },
  { value: "doctoral", label: "Doctoral" },
  { value: "other", label: "Other" },
];

const professionalStatuses: {
  value: ProfessionalStatus;
  label: string;
}[] = [
  { value: "student", label: "Student" },
  { value: "employed", label: "Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "freelancer", label: "Freelancer" },
  { value: "career_switcher", label: "Career switcher" },
  { value: "other", label: "Other" },
];

const LearnerProfilePage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [educationLevel, setEducationLevel] =
    useState<EducationLevel>("bachelors");
  const [professionalStatus, setProfessionalStatus] =
    useState<ProfessionalStatus>("student");
  const [yearsOfExperience, setYearsOfExperience] = useState("0");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const availableRoles = await getAvailableRoles();
        if (!active) return;

        setRoles(availableRoles);

        try {
          const savedProfile = await getMyLearnerProfile();
          if (!active) return;

          setProfile(savedProfile);
          setEducationLevel(savedProfile.educationLevel);
          setProfessionalStatus(savedProfile.professionalStatus);
          setYearsOfExperience(String(savedProfile.yearsOfExperience));
          setTargetRole(savedProfile.targetRole._id);
        } catch (err) {
          // A missing profile is expected for a first-time learner.
          if (
            !(err instanceof Error) ||
            !err.message.toLowerCase().includes("profile")
          ) {
            throw err;
          }
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load learner profile data."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const experience = Number(yearsOfExperience);

    if (!Number.isFinite(experience) || experience < 0) {
      setError("Enter a valid, non-negative number of years.");
      return;
    }

    if (!targetRole) {
      setError("Please select a target role.");
      return;
    }

    const input: LearnerProfileInput = {
      educationLevel,
      professionalStatus,
      yearsOfExperience: experience,
      targetRole,
    };

    setSaving(true);

    try {
      const savedProfile = await saveMyLearnerProfile(input);
      setProfile(savedProfile);
      setTargetRole(savedProfile.targetRole._id);
      setMessage("Learner profile saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save learner profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading learner profile...</p>;

  return (
    <main>
      <h1>Learner Profile</h1>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="educationLevel">Education level</label>
          <select
            id="educationLevel"
            value={educationLevel}
            onChange={(event) =>
              setEducationLevel(event.target.value as EducationLevel)
            }
            required
          >
            {educationLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="professionalStatus">Professional status</label>
          <select
            id="professionalStatus"
            value={professionalStatus}
            onChange={(event) =>
              setProfessionalStatus(event.target.value as ProfessionalStatus)
            }
            required
          >
            {professionalStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="yearsOfExperience">Years of experience</label>
          <input
            id="yearsOfExperience"
            type="number"
            min="0"
            step="any"
            value={yearsOfExperience}
            onChange={(event) => setYearsOfExperience(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="targetRole">Target role</label>
          <select
            id="targetRole"
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
          {roles.length === 0 && <p>No active roles are available.</p>}
        </div>

        <button type="submit" disabled={saving || roles.length === 0}>
          {saving
            ? "Saving..."
            : profile
              ? "Update profile"
              : "Save profile"}
        </button>
      </form>

      {profile && (
        <p>
          Last updated: {new Date(profile.updatedAt).toLocaleString()}
        </p>
      )}
    </main>
  );
};

export default LearnerProfilePage;
