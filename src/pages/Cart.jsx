import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cartItems, updateCartQuantity, removeFromCart, clearCart } = useAuth();
  const navigate = useNavigate();

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  }, [cartItems]);

  const formatPrice = (price) => Number(price || 0).toLocaleString('hu-HU');

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-8">
            <h2 className="text-start mb-3">Bevásárló lista</h2>
            <hr />
            <div className="row mb-3 fw-bold text-center">
              <div className="col-4">Termék részletek</div>
              <div className="col-3">Darab</div>
              <div className="col-2">Ár</div>
              <div className="col-3">Totál</div>
            </div>

            {cartItems.length === 0 && (
              <div className="alert alert-secondary">A kosár üres.</div>
            )}

            {cartItems.map(item => (
              <div key={item.productId} className="row mb-3 align-items-center border-bottom pb-3">
                <div className="col-4">
                  <div className="d-flex flex-column align-items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      className="mb-2"
                    />
                    <p className="mb-1 text-center">{item.title}</p>
                    <button className="btn btn-link btn-sm p-0 text-danger" onClick={() => removeFromCart(item.productId)}>
                      Törlés
                    </button>
                  </div>
                </div>

                <div className="col-3 text-center">
                  <div className="d-flex align-items-center justify-content-center">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateCartQuantity(item.productId, (item.quantity || 1) - 1)}
                      disabled={(item.quantity || 1) <= 1}
                    >
                      -
                    </button>
                    <span className="mx-3">{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateCartQuantity(item.productId, (item.quantity || 1) + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="col-2 text-center">
                  {formatPrice(item.price)} Ft
                </div>

                <div className="col-3 text-center">
                  {formatPrice((item.price || 0) * (item.quantity || 0))} Ft
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-between align-items-center mt-3">
              <a href="/store">Vissza a vásárláshoz</a>
              {cartItems.length > 0 && (
                <button className="btn btn-outline-danger" onClick={clearCart}>
                  Kosár ürítése
                </button>
              )}
            </div>
          </div>

          <div className="col-lg-4 text-start">
            <h2 className="mb-3">Összefoglalás</h2>
            <hr />
            <p>Termékek: {cartItems.length}</p>
            <h4>Teljes ár: {formatPrice(total)} Ft</h4>
            <br />
            <button
              className="btn btn-danger w-100"
              onClick={() => navigate('/delivery')}
              disabled={cartItems.length === 0}
            >
              Fizetés
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}