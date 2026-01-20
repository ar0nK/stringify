import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import guitars from '../temp/guitars.json'
import NavBar from '../components/NavBar'
import { Star } from 'lucide-react';

export default function Product() {
  const { id } = useParams()
  const product = guitars.find(g => g.id.toString() === id)
  const [showModal, setShowModal] = useState(false)

  if (!product) return <>Product not found</>

  return (
    <div>
      <NavBar/>
      <div className='container'>
        <div className='row'>
          <div className='col-md-1'>
            oldalsó képek
          </div>
          <div className='col-md-6'>
            {product.image && <img className='img-fluid' src={product.image} alt={product.image}/>}
          </div>
          <div className='col-md-4 text-start'>
            <h2 className='fw-bold'>{product.title}</h2>
            <h6 className='text-secondary'>{product.rating} / 5 <Star className="star-icon " /> {product.reviewCount} értékelés</h6>
            <h2>{product.price.toLocaleString('hu-HU')} Ft</h2>
            <hr />
            <ul>
              {product.shortDescription.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button 
              className='btn btn-link p-0 text-secondary p-3 text-underline' 
              onClick={() => setShowModal(true)}
            >
              Bővebb leírás
            </button>
            <hr />
            <h5 className={product.isAvailable? "text-success" : "text-danger"}>{product.isAvailable? "Jelenleg raktáron" : "Nincs raktáron"}</h5>
            <button className='btn btn-danger btn-lg w-100 mt-5 rounded'>
              Kosárba
            </button>
          </div>
        </div>
      <br />
      </div>

      {showModal && (
        <div 
          className="modal show d-block" 
          style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          onClick={() => setShowModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Részletes leírás - {product.title}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {product.longDescription}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Bezárás
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}