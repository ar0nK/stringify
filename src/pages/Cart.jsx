import React from 'react'
import NavBar from '../components/NavBar'
import cart from '../temp/cart.json'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState(cart);
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatPrice = (price) => price.toLocaleString('hu-HU');

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div>
      <NavBar/>
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
            {cartItems.map(item => (
              <div key={item.id} className="row mb-3 align-items-center border-bottom pb-3">
                <div className="col-4">
                  <div className="d-flex flex-column align-items-center">
                    <img src={item.image} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'cover' }} className="mb-2" />
                    <p className="mb-1 text-center">{item.title}</p>
                    <button className="btn btn-link btn-sm p-0 text-danger" onClick={() => removeItem(item.id)}>Törlés</button>
                  </div>
                </div>
                <div className="col-3 text-center">
                  <div className="d-flex align-items-center justify-content-center">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span className="mx-3">{item.quantity}</span>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="col-2 text-center">
                  {formatPrice(item.price)} Ft
                </div>
                <div className="col-3 text-center">
                  {formatPrice(item.price * item.quantity)} Ft
                </div>
              </div>
            ))}
            <div className="mt-3 text-center">
              <a href="/store">Vissza a vásárláshoz</a>
            </div>
          </div>
          
          <div className="col-lg-4 text-start">
            <h2 className="mb-3">Összefoglalás</h2>
            <hr />
            <p>Termékek: {cartItems.length}</p>
            <h4>Teljes ár: {formatPrice(calculateTotal())} Ft</h4>
            <br />
            <button className="btn btn-danger w-100" onClick={() => navigate('/delivery')}>Fizetés</button>
          </div>
        </div>
      </div>
    </div>
  )
}