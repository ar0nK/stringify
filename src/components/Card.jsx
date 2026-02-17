import { Star, Heart } from 'lucide-react';
import '../style/Card.css';
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => price.toLocaleString('hu-HU');
  const thumbnail = images?.[0];

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login?register=true');
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (onToggleFavorite) {
      await onToggleFavorite(id);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product_info/${id}`} className="product-image">
        {thumbnail && <img src={thumbnail} alt={title} />}
      </Link>

      <div className="product-content">
        <h3 className="product-title">
          <Link to={`/product_info/${id}`} className="text-decoration-none">{title}</Link>
          <button onClick={handleFavoriteClick} className={`favorite-button ${isFavorite ? 'is-favorite' : ''} ${isAnimating ? 'animate' : ''}`} aria-label={isFavorite ? 'Mentés törlése' : 'Termék mentése'}>
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={2} />
          </button>
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