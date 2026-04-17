import { useMemo, useEffect } from 'react';
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
  const { user, orders, refreshOrders } = useAuth();
  const { firstName, lastName } = useMemo(() => splitName(user), [user]);
  const billing = useMemo(() => readLastBillingAddress(), []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);


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

          <section className="profile-card profile-orders">
            <h2 className="profile-card-title">
              <i className="bi bi-receipt" />
              Rendeléseim
            </h2>

            {orders.length > 0 ? (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <span className="order-id">Rendelés #{order.id}</span>
                      <span className="order-date">{order.datum ? new Date(order.datum).toLocaleDateString('hu-HU') : 'Nincs dátum'}</span>
                    </div>
                    <div className="order-items">
                      {order.tetelek && order.tetelek.length > 0 ? (
                        <div className="order-items-list">
                          {order.tetelek.map((tetel) => (
                            <div key={tetel.id} className="order-item-row">
                              {tetel.termek ? (
                                <>
                                  <img 
                                    src={tetel.termek.kep} 
                                    alt={tetel.termek.nev}
                                    className="order-item-image"
                                    onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22%3E%3Crect fill=%22%23666%22 width=%2250%22 height=%2250%22/%3E%3C/svg%3E'; }}
                                  />
                                  <div className="order-item-info">
                                    <p className="order-item-name">{tetel.termek.nev}</p>
                                    <p className="order-item-price">{tetel.termek.ar} Ft × {tetel.darabszam}</p>
                                  </div>
                                  <span className="order-item-subtotal">{tetel.termek.ar * tetel.darabszam} Ft</span>
                                </>
                              ) : tetel.customGitar ? (
                                <>
                                  <div className="order-item-custom-canvas guitar-canvas">
                                    {tetel.customGitar.finishImage && (
                                      <img
                                        src={tetel.customGitar.finishImage}
                                        alt={tetel.customGitar.finish ?? "Finish"}
                                        className="order-item-layer guitar-finish"
                                        loading="lazy"
                                      />
                                    )}
                                    {tetel.customGitar.pickguardImage && (
                                      <img
                                        src={tetel.customGitar.pickguardImage}
                                        alt={tetel.customGitar.pickguard ?? "Pickguard"}
                                        className="order-item-layer guitar-pickguard"
                                        loading="lazy"
                                      />
                                    )}
                                    {tetel.customGitar.neckImage && (
                                      <img
                                        src={tetel.customGitar.neckImage}
                                        alt={tetel.customGitar.neck ?? "Nyak"}
                                        className="order-item-layer guitar-neck"
                                        loading="lazy"
                                      />
                                    )}
                                    {!tetel.customGitar.finishImage && !tetel.customGitar.pickguardImage && !tetel.customGitar.neckImage && (
                                      <div className="order-item-image order-item-custom-placeholder">
                                        <i className="bi bi-guitar"></i>
                                      </div>
                                    )}
                                  </div>
                                  <div className="order-item-info">
                                    <p className="order-item-name">{tetel.customGitar.name}</p>
                                    <p className="order-item-price">{tetel.customGitar.price} Ft × {tetel.darabszam}</p>
                                  </div>
                                  <span className="order-item-subtotal">{tetel.customGitar.price * tetel.darabszam} Ft</span>
                                </>
                              ) : tetel.egyediGitarId ? (
                                <>
                                  <div className="order-item-image order-item-custom-placeholder">
                                    <i className="bi bi-guitar"></i>
                                  </div>
                                  <div className="order-item-info">
                                    <p className="order-item-name">Egyedi gitár #{tetel.egyediGitarId}</p>
                                    <p className="order-item-price">{tetel.darabszam} db</p>
                                  </div>
                                </>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="order-empty">Nincsenek tételek</p>
                      )}
                    </div>
                    <div className="order-details">
                      <span className="order-total">Összesen: {order.osszeg} Ft</span>
                      <span className="order-status">Státusz: {order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="profile-empty-state">
                <i className="bi bi-receipt profile-empty-icon" />
                <p className="profile-empty-title">Még nincs rendelésed</p>
                <p className="profile-empty-sub">
                  Az első rendelésed után itt fog megjelenni.
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