import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NavBar from '../components/NavBar'
import Card from '../components/Card'
import { Star, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import '../style/Product.css'

export default function Product() {
  const { id } = useParams()
  const { apiBase } = useAuth()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [showModal, setShowModal] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [activeImage, setActiveImage] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch the specific product
        const response = await fetch(`${apiBase}/api/product_info/${id}`)
        if (!response.ok) {
          throw new Error('Product not found')
        }
        const data = await response.json()
        setProduct(data)
        setActiveImage(data.images?.[0] || '')
        
        // Fetch all products for related products
        const allResponse = await fetch(`${apiBase}/api/product_info`)
        if (allResponse.ok) {
          const allData = await allResponse.json()
          const related = allData.filter(p => p.id.toString() !== id).slice(0, 18)
          setRelatedProducts(related)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, apiBase])

  const desktopSlides = []
  for (let i = 0; i < relatedProducts.length; i += 3) {
    desktopSlides.push(relatedProducts.slice(i, i + 3))
  }

  const handleSave = () => {
    alert('Termék sikeresen lementve.')
  }

  const handleLightboxMouseMove = (e) => {
    if (!isZoomed) return
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomPos({ x, y })
  }

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="container mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div>
        <NavBar />
        <div className="container mt-5 text-center">
          <h2>Product not found</h2>
          <p className="text-muted">{error}</p>
        </div>
      </div>
    )
  }

  const thumbnails = product.images && product.images.length > 0 
    ? product.images 
    : [activeImage]

  // Parse shortDescription if it's a string (convert to array)
  const shortDescriptionArray = typeof product.shortDescription === 'string'
    ? product.shortDescription.split('\n').filter(line => line.trim())
    : Array.isArray(product.shortDescription)
    ? product.shortDescription
    : []

  return (
    <div>
      <NavBar />
      <div className='container mt-4'>
        <div className='row align-items-center'>
          <div className='col-md-1 order-2 order-md-1 d-flex flex-row flex-md-column gap-2 justify-content-center mt-3 mt-md-0 overflow-auto'>
            {thumbnails.slice(0, 5).map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                className={`img-fluid border rounded thumbnail-image ${activeImage === img ? 'active' : 'inactive'}`}
                onClick={() => setActiveImage(img)}
              />
            ))}
          </div>

          <div className='col-md-6 order-1 order-md-2 position-relative'>
            <div
              className="border rounded overflow-hidden position-relative product-image-container"
              onClick={() => setShowLightbox(true)}
            >
              <img
                className='img-fluid w-100 h-100 product-image'
                src={activeImage}
                alt={product.title}
              />
              <div className="position-absolute bottom-0 end-0 m-2 p-1">
                <ZoomIn size={20} />
              </div>
            </div>

            <button
              className="btn position-absolute top-0 end-0 m-3 save-button"
              onClick={handleSave}
            >
              <i className="bi bi-heart"></i>
            </button>
          </div>

          <div className='col-md-5 col-lg-4 order-3 text-start mt-4 mt-md-0'>
            <h2 className='fw-bold'>{product.title}</h2>
            {product.rating && (
              <h6 className='text-secondary d-flex align-items-center gap-1'>
                {product.rating} / 5 <Star className="star-icon" size={16} /> ({product.reviewCount} értékelés)
              </h6>
            )}
            <h2 className="mt-3">{product.price.toLocaleString('hu-HU')} Ft</h2>
            <hr />
            {shortDescriptionArray.length > 0 && (
              <ul className="ps-3">
                {shortDescriptionArray.map((item, index) => (
                  <li key={index} className="mb-1">{item}</li>
                ))}
              </ul>
            )}
            <button
              className='btn btn-link p-0 text-secondary text-decoration-underline mb-3'
              onClick={() => setShowModal(true)}
            >
              Bővebb leírás
            </button>
            <hr />
            <h5 className={product.isAvailable ? "text-success" : "text-danger"}>
              {product.isAvailable ? "Jelenleg raktáron" : "Nincs raktáron"}
            </h5>
            <button className='btn btn-danger btn-lg w-100 mt-4 rounded'>
              Kosárba
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <hr className='mt-5 mb-4' />
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className='container-fluid px-0 mb-5'>
          <div className='container'>
            <h3 className='mb-4'>Hasonló termékek</h3>
          </div>
          <div className='container d-none d-md-block position-relative'>
            <div id="desktopCarousel" className="carousel slide">
              <div className="carousel-inner">
                {desktopSlides.map((slideProducts, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <div className="row g-4">
                      {slideProducts.map((guitar) => (
                        <div key={guitar.id} className="col-md-4">
                          <Card
                            id={guitar.id}
                            images={guitar.images}
                            title={guitar.title}
                            rating={guitar.rating}
                            reviewCount={guitar.reviewCount}
                            previewDescription={guitar.previewDescription}
                            isAvailable={guitar.isAvailable}
                            price={guitar.price}
                            onAddToCart={() => console.log(`${guitar.title} added to cart`)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#desktopCarousel" data-bs-slide="prev">
                <ChevronLeft size={40} className="text-dark" />
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#desktopCarousel" data-bs-slide="next">
                <ChevronRight size={40} className="text-dark" />
              </button>
            </div>
          </div>
          <div className='container d-md-none overflow-auto'>
            <div className="d-flex gap-3 pb-3">
              {relatedProducts.slice(0, 6).map((guitar) => (
                <div key={guitar.id} className="mobile-product-card">
                  <Card {...guitar} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showLightbox && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center lightbox-overlay"
          onClick={() => setShowLightbox(false)}
        >
          <button
            className="position-absolute top-0 end-0 m-4 btn text-white lightbox-close-button"
            onClick={() => setShowLightbox(false)}
          >
            <X size={40} />
          </button>
          <div
            className={`position-relative lightbox-image-container ${isZoomed ? 'zoom-out' : 'zoom-in'}`}
            onClick={(e) => {
              e.stopPropagation()
              setIsZoomed(!isZoomed)
            }}
            onMouseMove={handleLightboxMouseMove}
          >
            <img
              src={activeImage}
              alt={product.title}
              className="w-100 h-100"
              style={{
                objectFit: 'contain',
                transform: isZoomed ? 'scale(4)' : 'scale(1)',
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transition: isZoomed ? 'none' : 'transform 0.3s ease'
              }}
            />
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal show d-block modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Részletes leírás - {product.title}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body modal-body-scrollable">
                {product.longDescription}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Bezárás</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}