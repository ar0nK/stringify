import Card from '../components/Card.jsx'
import NavBar from '../components/NavBar.jsx'
import guitars from '../temp/guitars.json'
import Filters from '../components/Filters.jsx'

export default function Store() {
  return (
    <div>
      <NavBar/>
      <div className="container-fluid mt-4 px-lg-5">
        <div className="row">
          <aside className="col-12 col-lg-2 mb-4 pe-lg-5">
            <div
              className="d-none d-lg-block position-sticky"
              style={{ top: '50vh', transform: 'translateY(-50%)' }}
            >
              <Filters/>
            </div>
            <div className="d-lg-none">
              <Filters/>
            </div>
          </aside>
          <section className="col-12 col-lg-10 ps-lg-5">
            <div className="row g-5">
              {guitars.map(guitar => (
                <div key={guitar.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex">
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