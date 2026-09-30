import { Link } from 'react-router-dom';
import Icon from './Icon';

const fallbackImage = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85';
const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(price) || 0);

export default function PropertyCard({ property, compact = false }) {
  const image = property.images?.[0] || fallbackImage;
  return (
    <article className={`property-card ${compact ? 'property-card-compact' : ''}`}>
      <Link className="property-image-wrap" to={`/properties/${property._id}`}>
        <img src={image} alt={property.title} className="property-image" loading="lazy" />
        <span className="property-badge">{property.status || 'available'}</span>
        <span className="image-arrow"><Icon name="arrow" size={17} /></span>
      </Link>
      <div className="property-card-content">
        <div className="property-price-row"><strong>{formatPrice(property.price)}{property.status === 'rented' && <span className="price-period"> / mo</span>}</strong><span className="property-type">{property.propertyType}</span></div>
        <Link className="property-title" to={`/properties/${property._id}`}>{property.title}</Link>
        <div className="property-location"><Icon name="pin" size={15} />{[property.location, property.city, property.state].filter(Boolean).join(', ')}</div>
        <div className="property-card-divider" />
        <div className="property-stats"><span><Icon name="bed" size={17} />{property.bedrooms} beds</span><span><Icon name="bath" size={17} />{property.bathrooms} baths</span><span><Icon name="area" size={16} />{Number(property.squareFeet).toLocaleString()} sqft</span></div>
      </div>
    </article>
  );
}

export { formatPrice };
