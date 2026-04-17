import { useMemo } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import '../style/Profile.css';

const LAST_BILLING_KEY = 'lastBillingAddress';

function splitName(user) {
  const firstName = user?.firstName || user?.firstname || '';
  const lastName  = user?.lastName  || user?.lastname  || '';
  if (firstName || lastName) return { firstName, lastName };

  const parts = (user?.name?.trim() || '').split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function readLastBillingAddress() {
  try {
    const raw = localStorage.getItem(LAST_BILLING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="profile-info-row">
      <div className="profile-info-label">
        <i className={`bi ${icon}`} />
        {label}
      </div>
      <div className="profile-info-value">
        {value || <span className="profile-info-empty">Még nincs megadva</span>}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const { firstName, lastName } = useMemo(() => splitName(user), [user]);
  const billing = useMemo(() => readLastBillingAddress(), []);


  return (
    <div className="profile-page">
      <NavBar />

      <main className="profile-container">
        <div className="profile-layout">

          <aside className="profile-card profile-sidebar">
            <div className="profile-avatar">
              <i className="bi bi-person"></i>
            </div>

            <p className="profile-fullname">{firstName} {lastName}</p>

            <div className="profile-divider" />

            <InfoRow icon="bi-person"        label="Keresztnév" value={firstName} />
            <InfoRow icon="bi-person-lines-fill" label="Vezetéknév" value={lastName} />
            <InfoRow icon="bi-envelope"      label="Email cím"  value={user?.email} />

          </aside>

          <section className="profile-card profile-billing">
            <h2 className="profile-card-title">
              <i className="bi bi-truck" />
              Szállítási adatok
            </h2>

            {billing ? (
              <>
                <InfoRow icon="bi-geo-alt"        label="Cím"         value={billing.address} />
                <InfoRow icon="bi-telephone"      label="Telefon"     value={billing.mobilePhone} />
                <InfoRow icon="bi-envelope"       label="Email cím"   value={billing.email || user?.email} />
              </>
            ) : (
              <div className="profile-empty-state">
                <i className="bi bi-inbox profile-empty-icon" />
                <p className="profile-empty-title">Még nincs mentett számlázási cím</p>
                <p className="profile-empty-sub">
                  Az első rendeléskor a megadott adatok automatikusan elmentésre kerülnek.
                </p>
              </div>
            )}
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}