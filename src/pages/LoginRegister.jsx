import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/LoginRegister.css";
import logo from "../img/logo.png";

export default function LoginRegister() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("register") !== "true");
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [csaladnev, setCsaladnev] = useState("");
  const [keresztnev, setKeresztnev] = useState("");
  const [email, setEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");

  const [jelszo, setJelszo] = useState("");
  const [jelszo2, setJelszo2] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const previousTheme = document.documentElement.getAttribute("data-bs-theme");
    document.documentElement.setAttribute("data-bs-theme", "light");

    return () => {
      if (previousTheme) {
        document.documentElement.setAttribute("data-bs-theme", previousTheme);
      }
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(loginEmail.trim(), jelszo);

        if (result.success) {
          setMessage("Sikeres bejelentkezés!");
          alert(`Üdvözlünk, ${result.name}!`);
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          setError(result.error);
        }
      } else {
        if (jelszo !== jelszo2) {
          setError("A két jelszó nem egyezik.");
          return;
        }

        const nev = `${csaladnev} ${keresztnev}`.trim();
        const result = await register(nev, email.trim(), jelszo);

        if (result.success) {
          setMessage(result.message);
          setCsaladnev("");
          setKeresztnev("");
          setEmail("");
          setJelszo("");
          setJelszo2("");

          setTimeout(() => {
            setMessage("");
            setIsLogin(true);
          }, 2000);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError("Nem sikerült csatlakozni a szerverhez.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-register-container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="login-register-card card border-0 rounded-3" style={{ width: "35rem" }}>
        <div className="card-body p-4">
          <a href="/"><img src={logo} style={{ height: "8rem", marginBottom: "1rem" }} alt="" /></a>
          <h2 className="login-register-heading text-center mb-4" style={{ paddingTop: "1rem" }}>
            {isLogin ? "Bejelentkezés" : "Regisztráció"}
          </h2>
          <hr />
          {(error || message) && (
            <div className={`alert ${error ? "alert-danger" : "alert-success"}`}>
              {error || message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isLogin ? (
              <>
                <div className="mb-3">
                  <label className="login-register-label form-label mb-2 w-100 text-start">Email cím</label>
                  <div className="login-register-input-wrapper">
                    <i className="bi bi-envelope login-register-input-icon"></i>
                    <input
                      type="email"
                      className="login-register-input form-control rounded-2 py-2"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="példa@email.com"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="login-register-label form-label mb-2 w-100 text-start">Jelszó</label>
                  <div className="login-register-input-wrapper">
                    <i className="bi bi-lock login-register-input-icon"></i>
                    <input
                      type="password"
                      className="login-register-input form-control rounded-2 py-2"
                      required
                      value={jelszo}
                      onChange={(e) => setJelszo(e.target.value)}
                      placeholder="********"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <label className="login-register-label form-label mb-2 w-100 text-start">Családnév</label>
                  <div className="login-register-input-wrapper">
                    <i className="bi bi-person login-register-input-icon"></i>
                    <input
                      type="text"
                      className="login-register-input form-control rounded-2 py-2"
                      required
                      value={csaladnev}
                      onChange={(e) => setCsaladnev(e.target.value)}
                      placeholder="Családnév"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="login-register-label form-label mb-2 w-100 text-start">Keresztnév</label>
                  <div className="login-register-input-wrapper">
                    <i className="bi bi-person login-register-input-icon"></i>
                    <input
                      type="text"
                      className="login-register-input form-control rounded-2 py-2"
                      required
                      value={keresztnev}
                      onChange={(e) => setKeresztnev(e.target.value)}
                      placeholder="Keresztnév"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="login-register-label form-label mb-2 w-100 text-start">Email cím</label>
                  <div className="login-register-input-wrapper">
                    <i className="bi bi-envelope login-register-input-icon"></i>
                    <input
                      type="email"
                      className="login-register-input form-control rounded-2 py-2"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="példa@gmail.com"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="login-register-label form-label mb-2 w-100 text-start">Jelszó</label>
                  <div className="login-register-input-wrapper">
                    <i className="bi bi-lock login-register-input-icon"></i>
                    <input
                      type="password"
                      className="login-register-input form-control rounded-2 py-2"
                      required
                      value={jelszo}
                      onChange={(e) => setJelszo(e.target.value)}
                      placeholder="********"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="login-register-label form-label mb-2 w-100 text-start">Jelszó megerősítése</label>
                  <div className="login-register-input-wrapper">
                    <i className="bi bi-lock-fill login-register-input-icon"></i>
                    <input
                      type="password"
                      className="login-register-input form-control rounded-2 py-2"
                      required
                      value={jelszo2}
                      onChange={(e) => setJelszo2(e.target.value)}
                      placeholder="********"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="d-grid mt-4" style={{ paddingTop: "2rem" }}>
              <button type="submit" disabled={loading} className="login-register-button btn text-white py-2 rounded-2">
                {loading ? "Folyamatban..." : isLogin ? "Bejelentkezés" : "Regisztráció"}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setMessage("");
                setLoginEmail("");
                setJelszo("");
              }}
              className="login-register-toggle btn btn-link text-decoration-none p-0"
            >
              {isLogin ? "Nincs még fiókod? Regisztrálás" : "Már van fiókod? Bejelentkezés"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}