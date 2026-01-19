import Card from '../components/Card.jsx'
import NavBar from '../components/NavBar.jsx'
import guitars from '../temp/guitars.json'

export default function store() {
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
                    image={guitar.image}
                    title={guitar.title}
                    rating={guitar.rating}
                    maxRating={guitar.maxRating}
                    description={guitar.description}
                    price={guitar.price}
                    currency={guitar.currency}
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
