import { Star } from 'lucide-react';
import '../style/Card.css';
import { Link } from 'react-router-dom'

const Card = ({
  id,
  images,
  title,
  rating,
  reviewCount,
  previewDescription,
  isAvailable,
  price,
  onAddToCart = () => console.log('Added to cart')
}) => {
  const formatPrice = (price) => price.toLocaleString('hu-HU');
  const thumbnail = images?.[0];

  return (
    <div className="product-card">
      <Link to={`/product/${id}`} className="product-image">
        {thumbnail && <img src={thumbnail} alt={title} />}
      </Link>

      <div className="product-content">
        <h3 className="product-title">
          <Link to={`/product/${id}`} className="text-decoration-none">{title}</Link>
        </h3>

        <div className="product-rating">
          <Star className="star-icon" />
          <span>{rating}/5 ({reviewCount})</span>
        </div>

        <p className="product-description">{previewDescription}</p>

        <div className="product-footer">
          <span className="product-price">{formatPrice(price)} Ft</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
            }}
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