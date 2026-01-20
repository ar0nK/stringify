import { Star } from 'lucide-react';
import '../style/Card.css';
import { Link } from 'react-router-dom'

const Card = ({ 
  id,
  image,
  title,
  rating,
  reviewCount,
  shortDescription,
  longDescription,
  previewDescription,
  isAvailable,
  price,
  onAddToCart = () => console.log('Added to cart')
}) => {
  const formatPrice = (price) => {
    return price.toLocaleString('hu-HU');
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {image && <img src={image} alt={title} />}
      </div>
      
      <div className="product-content">
        <h3 className="product-title"><Link to={`/product/${id}`} className="text-decoration-none">{title}</Link></h3>
        
        <div className="product-rating">
          <Star className="star-icon" />
          <span>{rating}/5 ({reviewCount})</span>
        </div>
        
        <p className="product-description">{previewDescription}</p>
        
        <div className="product-footer">
          <span className="product-price">
            {formatPrice(price)} Ft
          </span>
          <button 
            onClick={onAddToCart} 
            className="product-button"
            disabled={!isAvailable}
          >
            {isAvailable ? 'Kosárba' : 'Elfogyott'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;