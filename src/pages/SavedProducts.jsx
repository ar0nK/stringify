import Card from '../components/Card.jsx'
import NavBar from '../components/NavBar.jsx'
import Filters from '../components/Filters.jsx'
import savedProducts from '../temp/savedProducts.json'

export default function Store() {
  return (
    <div>
      <NavBar/>
      <div className="container-fluid mt-4 px-lg-5">
        <div className="row">
          <aside className="col-12 col-lg-2 mb-4 pe-lg-5">
            <div className="d-none d-lg-block position-sticky" style={{ top: '20vh' }}>
              <div className="w-100" style={{ height: '420px' }}>
                <Filters/>
              </div>
            </div>
            <div className="d-lg-none">
              <Filters/>
            </div>
          </aside>
          <section className="col-12 col-lg-10 ps-lg-5">
            <div className="row g-5">
              {savedProducts.map(product => (
                <div key={product.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex">
                  <Card
                    id={product.id}
                    images={product.images || [product.image]} 
                    title={product.title}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    shortDescription={product.shortDescription}
                    longDescription={product.longDescription}
                    previewDescription={product.previewDescription}
                    isAvailable={product.isAvailable}
                    price={product.price}
                    onAddToCart={() =>
                      console.log(`${product.title} added to cart`)
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}