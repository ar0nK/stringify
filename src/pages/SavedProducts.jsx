import Card from '../components/Card.jsx'
import NavBar from '../components/NavBar.jsx'
import savedProducts from '../temp/savedProducts.json'

export default function Store() {
  return (
    <div>
      <NavBar/>
      <div className="container mt-4">
        <div className="row">
          <aside className="col-12 col-lg-3 mb-4">
            <h5>Szűrők</h5>
          </aside>
          <section className="col-12 col-lg-9">
            <div className="row g-3 g-md-4">
              {savedProducts.map(product => (
                <div key={product.id} className="col-12 col-sm-6 col-md-4 d-flex">
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