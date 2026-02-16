import { Star, Heart } from 'lucide-react';
import '../style/Card.css';
import { Link } from 'react-router-dom'
import { useState } from 'react';

const Card = ({
  id,
  images,
  title,
  rating,
  reviewCount,
  previewDescription,
  isAvailable,
  price,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart = () => console.log('Added to cart')
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const formatPrice = (price) => price.toLocaleString('hu-HU');
  const thumbnail = images?.[0];

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    if (onToggleFavorite) {
      await onToggleFavorite(id);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${id}`} className="product-image">
        {thumbnail && <img src={thumbnail} alt={title} />}
          
        <button
          onClick={handleFavoriteClick}
          className={`favorite-button ${isFavorite ? 'is-favorite' : ''} ${isAnimating ? 'animate' : ''}`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart 
            size={20} 
            fill={isFavorite ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        </button>
      </Link>

      <div className="product-content">
        <h3 className="product-title">
          <Link to={`/product/${id}`} className="text-decoration-none">{title}</Link>
        </h3>

        {rating && reviewCount && (
          <div className="product-rating">
            <Star className="star-icon" />
            <span>{rating}/5 ({reviewCount})</span>
          </div>
        )}

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