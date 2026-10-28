
import { useState, type SyntheticEvent } from "react";
import { apiRequest } from "../../services/api";
import "./RegisterPage.css";

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
  };
}

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest<RegisterResponse>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            fullName,
            email,
            password,
            confirmPassword,
            dateOfBirth,
            gender,
          }),
        },
      );

      setMessage(response.message);
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setDateOfBirth("");
      setGender("");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-layout">
        {/* Left branding panel */}
        <section className="register-brand">
          <div className="register-glow register-glow-top" />
          <div className="register-glow register-glow-bottom" />

          <div className="register-brand-content">
            <a
              href="/"
              aria-label="Skill Gap Analyzer home"
              className="register-logo"
            >
              <span className="register-logo-icon">S</span>
              <span className="register-logo-text">
                Skill
                <span className="register-logo-accent">Scope</span>
              </span>
            </a>

            <div className="register-intro">
              <span className="register-eyebrow">
                <span className="register-status-dot" />
                YOUR GROWTH STARTS HERE
              </span>

              <h1 className="register-title">
                Your potential
                <span className="register-title-accent">has no</span>
                <span className="block">limits.</span>
              </h1>

              <p className="register-description">
                Create your account, explore your current skills, and discover
                what you need to reach your dream software development role.
              </p>
            </div>
          </div>

          <div className="register-feature-grid">
            <div className="register-feature">
              <div className="register-feature-icon">✦</div>
              <p className="register-feature-title">
                Discover yourself
              </p>
              <p className="register-feature-description">
                Identify your strengths and opportunities.
              </p>
            </div>

            <div className="register-feature">
              <div className="register-feature-icon register-feature-icon-cyan">
                ↗
              </div>
              <p className="register-feature-title">
                Plan your growth
              </p>
              <p className="register-feature-description">
                Build a path toward your career goals.
              </p>
            </div>
          </div>

          <p className="register-brand-footer">
            Learn smarter. Grow stronger. Build your future.
          </p>
        </section>

        {/* Registration form */}
        <section className="register-form-panel">
          <div className="register-form-content">
            <div className="register-heading">
              <span className="register-badge">
                Join the journey
              </span>

              <h2 className="register-form-title">
                Create your
                <span className="register-form-title-accent">
                  account.
                </span>
              </h2>

              <p className="register-subtitle">
                A few details are all you need to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              <div>
                <label
                  htmlFor="fullName"
                  className="register-field-label"
                >
                  Full name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  minLength={3}
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Enter your full name"
                  required
                  className="register-input"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="register-field-label"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  className="register-input"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="register-field-label"
                >
                  Password
                </label>

                <div className="register-input-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={8}
                    maxLength={20}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    required
                    className="register-input register-password-input"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="register-password-toggle"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <p className="register-password-hint">
                  Use 8–20 characters with uppercase, lowercase, a number,
                  and a special character (@$!%*?&).
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="register-field-label"
                >
                  Confirm password
                </label>

                <div className="register-input-wrapper">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    placeholder="Enter your password again"
                    required
                    className="register-input register-password-input"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    aria-pressed={showConfirmPassword}
                    className="register-password-toggle"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="register-details-grid">
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="register-field-label"
                  >
                    Date of birth
                  </label>

                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(event) =>
                      setDateOfBirth(event.target.value)
                    }
                    max={new Date().toISOString().split("T")[0]}
                    required
                    className="register-input register-date-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="register-field-label"
                  >
                    Gender
                  </label>

                  <select
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                    required
                    className="register-input register-select"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">
                      Prefer not to say
                    </option>
                  </select>
                </div>
              </div>

              {error && (
                <div role="alert" className="register-error">
                  {error}
                </div>
              )}

              {message && (
                <div role="status" className="register-success">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="register-submit"
              >
                {loading
                  ? "Creating your account..."
                  : "Create my account"}

                {!loading && (
                  <span
                    aria-hidden="true"
                    className="register-submit-arrow"
                  >
                    →
                  </span>
                )}
              </button>
            </form>

            <div className="register-divider">
              <div className="register-divider-line" />
              <span className="register-divider-text">
                YOUR FUTURE, YOUR PACE
              </span>
              <div className="register-divider-line" />
            </div>

            <p className="register-signin">
              Already have an account?{" "}
              <a href="/login" className="register-signin-link">
                Sign in
              </a>
            </p>

            <p className="register-footer">
              Skill Gap Analyzer · Build skills with intention
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
