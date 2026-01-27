import React, { useState } from 'react'
import '../style/LoginRegister.css'

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(false)

  return (
    <div className="login-register-container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="login-register-card card border-0 rounded-3">
        <div className="card-body p-5">
          <h2 className="login-register-heading text-center mb-4">
            {isLogin ? 'Bejelentkezés' : 'Regisztráció'}
          </h2>
          
          <form>
            {!isLogin && (
              <>
                <div className="mb-3">
                  <label className="login-register-label form-label mb-2">
                    Családnév
                  </label>
                  <input
                    type="text"
                    className="login-register-input form-control rounded-2 py-2"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="login-register-label form-label mb-2">
                    Keresztnév
                  </label>
                  <input
                    type="text"
                    className="login-register-input form-control rounded-2 py-2"
                    required
                  />
                </div>
              </>
            )}

            <div className="mb-3">
              <label className="login-register-label form-label mb-2">
                Email cím
              </label>
              <input
                type="email"
                className="login-register-input form-control rounded-2 py-2"
                required
              />
            </div>

            <div className="mb-3">
              <label className="login-register-label form-label mb-2">
                Jelszó
              </label>
              <input
                type="password"
                className="login-register-input form-control rounded-2 py-2"
                required
              />
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label className="login-register-label form-label mb-2">
                  Jelszó megerősítése
                </label>
                <input
                  type="password"
                  className="login-register-input form-control rounded-2 py-2"
                  required
                />
              </div>
            )}

            <div className="d-grid mt-4">
              <button
                type="submit"
                className="login-register-button btn text-white py-2 rounded-2"
              >
                {isLogin ? 'Bejelentkezés' : 'Regisztráció'}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="login-register-toggle btn btn-link text-decoration-none p-0"
            >
              {isLogin ? 'Nincs még fiókod? Regisztrálás' : 'Már van fiókod? Bejelentkezés'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}