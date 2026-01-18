import { Star } from 'lucide-react';
import '../style/Card.css';
import { Link } from 'react-router-dom'

const Card = ({ 
  id,
  image = null,
  title = "Title",
  rating = 5,
  maxRating = 5,
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  price = 999999,
  currency = "Ft",
  onAddToCart = () => console.log('Added to cart')
}) => {
  return (
    <div className="product-card">
      <div className="product-image">
        {image && <img src={image} alt={title} />}
      </div>
      
      <div className="product-content">
        <h3 className="product-title"><Link to={`/product/${id}`} className="text-decoration-none">{title}</Link></h3>
        
        <div className="product-rating">
          <Star className="star-icon" />
          <span>{rating}/{maxRating}</span>
        </div>
        
        <p className="product-description">{description}</p>
        
        <div className="product-footer">
          <span className="product-price">
            {price.toLocaleString('hu-HU')} {currency}
          </span>
          <button onClick={onAddToCart} className="product-button">
            Kosárba
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;