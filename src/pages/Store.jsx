import Card from '../components/Card.jsx'
import NavBar from '../components/NavBar.jsx'
import guitars from '../temp/guitars.json'

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
              {guitars.map(guitar => (
                <div key={guitar.id} className="col-12 col-sm-6 col-md-4 d-flex">
                  <Card
                    id={guitar.id}
                    images={guitar.images || [guitar.image]} 
                    title={guitar.title}
                    rating={guitar.rating}
                    reviewCount={guitar.reviewCount}
                    shortDescription={guitar.shortDescription}
                    longDescription={guitar.longDescription}
                    previewDescription={guitar.previewDescription}
                    isAvailable={guitar.isAvailable}
                    price={guitar.price}
                    onAddToCart={() =>
                      console.log(`${guitar.title} added to cart`)
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