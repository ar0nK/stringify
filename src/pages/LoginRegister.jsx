import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/LoginRegister.css";

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [csaladnev, setCsaladnev] = useState("");
  const [keresztnev, setKeresztnev] = useState("");
  const [telefonszam, setTelefonszam] = useState("");
  const [email, setEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");

  const [jelszo, setJelszo] = useState("");
  const [jelszo2, setJelszo2] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
          
          // Show welcome alert
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
        const result = await register(nev, email.trim(), telefonszam.trim(), jelszo);

        if (result.success) {
          setMessage(result.message);
          setCsaladnev("");
          setKeresztnev("");
          setTelefonszam("");
          setEmail("");
          setJelszo("");
          setJelszo2("");

          setTimeout(() => {
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
      <div className="login-register-card card border-0 rounded-3">
        <div className="card-body p-5">
          <h2 className="login-register-heading text-center mb-4">
            {isLogin ? "Bejelentkezés" : "Regisztráció"}
          </h2>

          {(error || message) && (
            <div className={`alert ${error ? "alert-danger" : "alert-success"}`}>
              {error || message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isLogin ? (
              <>
                <div className="mb-3">
                  <label className="login-register-label form-label mb-2">Email cím</label>
                  <input
                    type="email"
                    className="login-register-input form-control rounded-2 py-2"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="pelda@email.com"
                  />
                </div>

                <div className="mb-3">
                  <label className="login-register-label form-label mb-2">Jelszó</label>
                  <input
                    type="password"
                    className="login-register-input form-control rounded-2 py-2"
                    required
                    value={jelszo}
                    onChange={(e) => setJelszo(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <label className="login-register-label form-label mb-2">Családnév</label>
                  <input
                    type="text"
                    className="login-register-input form-control rounded-2 py-2"
                    required
                    value={csaladnev}
                    onChange={(e) => setCsaladnev(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="login-register-label form-label mb-2">Keresztnév</label>
                  <input
                    type="text"
                    className="login-register-input form-control rounded-2 py-2"
                    required
                    value={keresztnev}
                    onChange={(e) => setKeresztnev(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="login-register-label form-label mb-2">Telefonszám</label>
                  <input
                    type="text"
                    className="login-register-input form-control rounded-2 py-2"
                    required
                    value={telefonszam}
                    onChange={(e) => setTelefonszam(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="login-register-label form-label mb-2">Email cím</label>
                  <input
                    type="email"
                    className="login-register-input form-control rounded-2 py-2"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="login-register-label form-label mb-2">Jelszó</label>
                  <input
                    type="password"
                    className="login-register-input form-control rounded-2 py-2"
                    required
                    value={jelszo}
                    onChange={(e) => setJelszo(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="login-register-label form-label mb-2">Jelszó megerősítése</label>
                  <input
                    type="password"
                    className="login-register-input form-control rounded-2 py-2"
                    required
                    value={jelszo2}
                    onChange={(e) => setJelszo2(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="d-grid mt-4">
              <button
                type="submit"
                disabled={loading}
                className="login-register-button btn text-white py-2 rounded-2"
              >
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