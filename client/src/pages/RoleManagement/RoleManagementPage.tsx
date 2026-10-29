
import { useEffect, useState } from "react";

import {
  getAllRoles,
  getSkillsByRole,
} from "../../features/role-management/roleManagement.service";

import type {
  Role,
  RoleSkillRequirement,
} from "../../features/role-management/types";

const RoleManagementPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [requirements, setRequirements] = useState<RoleSkillRequirement[]>([]);

  const [loading, setLoading] = useState(true);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const [error, setError] = useState("");
  const [skillsError, setSkillsError] = useState("");

  // Load all available roles.
  useEffect(() => {
    let active = true;

    const loadRoles = async () => {
      try {
        const data = await getAllRoles();

        if (active) {
          setRoles(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Failed to load roles."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadRoles();

    return () => {
      active = false;
    };
  }, []);

  // Load the skills belonging to the selected role.
  const handleRoleChange = async (roleName: string) => {
    setSelectedRole(roleName);
    setRequirements([]);
    setSkillsError("");

    if (!roleName) {
      return;
    }

    setSkillsLoading(true);

    try {
      const data = await getSkillsByRole(roleName);
      setRequirements(data.filter((item) => item.status === "active"));
    } catch (err) {
      setSkillsError(
        err instanceof Error
          ? err.message
          : "Failed to load required skills."
      );
    } finally {
      setSkillsLoading(false);
    }
  };

  if (loading) {
    return <p>Loading roles...</p>;
  }

  return (
    <main>
      <h1>Role Management</h1>
      <p>Select a role to view only the skills required for that role.</p>

      {error && <p role="alert">{error}</p>}

      <section>
        <label htmlFor="role-select">Select Role</label>

        <select
          id="role-select"
          value={selectedRole}
          onChange={(event) => {
            void handleRoleChange(event.target.value);
          }}
        >
          <option value="">Choose a role</option>

          {roles.map((role) => (
            <option key={role._id} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
      </section>

      {selectedRole && (
        <section>
          <h2>Required Skills — {selectedRole}</h2>

          {skillsLoading && <p>Loading required skills...</p>}

          {skillsError && <p role="alert">{skillsError}</p>}

          {!skillsLoading &&
            !skillsError &&
            requirements.length === 0 && (
              <p>No active required skills found for this role.</p>
            )}

          {!skillsLoading && requirements.length > 0 && (
            <ul>
              {requirements.map((requirement) => (
                <li key={requirement._id}>
                  <strong>{requirement.skill.name}</strong>

                  {requirement.skill.category && (
                    <span> — {requirement.skill.category}</span>
                  )}

                  <span>
                    {" "}
                    ({requirement.requirementType})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
};

export default RoleManagementPage;
