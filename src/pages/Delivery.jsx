import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import '../style/Delivery.css'

export default function Delivery() {
  const { user, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobilePhone: '',
    email: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login?register=true')
      return
    }

    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }))
    }
  }, [user, isAuthenticated, loading, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('A név mező kitöltése kötelező')
      return
    }
    if (!formData.address.trim()) {
      setError('A cím mező kitöltése kötelező')
      return
    }
    if (!formData.mobilePhone.trim()) {
      setError('A telefonszám mező kitöltése kötelező')
      return
    }
    if (!formData.email.trim()) {
      setError('Az email mező kitöltése kötelező')
      return
    }

    // Telefonszám validáció (9-15 számjegy, egyéb jelek eldobása)
    const phoneDigits = formData.mobilePhone.replace(/\D/g, '')
    const phoneRegex = /^\d{9,15}$/
    if (!phoneRegex.test(phoneDigits)) {
      setError('A telefonszám formátuma nem megfelelő')
      return
    }

    // Email validáció
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Az email formátuma nem megfelelő')
      return
    }

    // Szimulált sikeres küldés
    console.log('Szállítási adatok:', formData)
    setSubmitted(true)
    
    // 3 másodperc után vissza a főoldalra
    setTimeout(() => {
      navigate('/')
    }, 3000)
  }

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Betöltés...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="delivery-container">
      <NavBar />
      <div className="delivery-wrapper">
        <div className="delivery-card">
          <h1 className="delivery-heading">Szállítási Adatok</h1>
          
          {submitted ? (
            <div className="alert alert-success" role="alert">
              <h4 className="alert-heading">Sikeresen beküldve!</h4>
              <p>Az adatai rögzítve lettek. Rövidesen visszairányítjuk a főoldalra.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="name" className="form-label delivery-label">Név</label>
                <input
                  type="text"
                  className="form-control delivery-input"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Pl: János"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label delivery-label">Cím</label>
                <input
                  type="text"
                  className="form-control delivery-input"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Pl: Budapest, Deák Ferenc utca 1., 1052"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="mobilePhone" className="form-label delivery-label">Telefonszám</label>
                <input
                  type="tel"
                  className="form-control delivery-input"
                  id="mobilePhone"
                  name="mobilePhone"
                  value={formData.mobilePhone}
                  onChange={handleChange}
                  placeholder="Pl: +36 30 123 4567"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label delivery-label">Email</label>
                <input
                  type="email"
                  className="form-control delivery-input"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Pl: janos.kovacs@example.com"
                  disabled
                />
                <small className="form-text text-muted">Az email az Ön bejelentkezett fiókjáből származik</small>
              </div>

              <button type="submit" className="btn btn-primary delivery-btn w-100 mt-4">
                Szállítási adatok megerősítése
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
