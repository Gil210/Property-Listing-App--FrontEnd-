import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProperty } from '../api/properties';
import { sendMessage } from '../api/messages';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../components/PropertyCard';
import Icon from '../components/Icon';

const fallbackImage = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85';

export default function PropertyDetails() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    getProperty(id).then((response) => { if (active) setProperty(response.data); })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, [id]);

  async function contactOwner(event) {
    event.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/properties/${id}` } } });
      return;
    }
    setSending(true);
    setNotice('');
    try {
      await sendMessage({ property: property._id, subject: `Enquiry about ${property.title}`, message }, token);
      setMessage('');
      setNotice('Your message has been sent. The owner will be in touch.');
    } catch (sendError) {
      setNotice(sendError.message);
    } finally {
      setSending(false);
    }
  }

  if (error) return <main className="content-page"><div className="error-banner" role="alert">{error}</div><Link className="text-link" to="/">Return to homes <Icon name="arrow" size={16} /></Link></main>;
  if (!property) return <div className="page-loading"><span className="spinner" />Finding the details…</div>;

  const images = property.images?.length ? property.images : [fallbackImage];
  const ownerName = property.owner?.name || 'Property owner';
  return <main className="content-page property-detail-page"><Link className="back-link detail-back" to="/"><Icon name="chevron" size={16} className="flip-icon" /> Back to all homes</Link><div className="detail-gallery"><div className="gallery-main"><img src={images[0]} alt={property.title} /></div><div className="gallery-side"><img src={images[1] || images[0]} alt={`${property.title} interior`} /><div className="gallery-note"><span>ROOM TO LIVE</span><span>{images.length > 1 ? `+${images.length - 1} more photos` : 'A closer look'}</span></div></div></div><div className="detail-layout"><div className="detail-main"><div className="detail-eyebrow"><span className="status-dot" /> {property.status} <span>·</span> {property.propertyType}</div><h1>{property.title}</h1><p className="detail-location"><Icon name="pin" size={18} />{[property.address, property.location, property.city, property.state, property.country].filter(Boolean).join(', ')}</p><div className="detail-stats"><span><Icon name="bed" /> <strong>{property.bedrooms}</strong> bedrooms</span><span><Icon name="bath" /> <strong>{property.bathrooms}</strong> bathrooms</span><span><Icon name="area" /> <strong>{Number(property.squareFeet).toLocaleString()}</strong> sqft</span></div><div className="detail-section"><h2>A little about this place</h2><p>{property.description}</p></div>{property.amenities?.length > 0 && <div className="detail-section"><h2>The thoughtful details</h2><div className="amenities">{property.amenities.map((item) => <span key={item}><Icon name="check" size={16} />{item}</span>)}</div></div>}</div><aside className="contact-card"><div className="contact-price">{formatPrice(property.price)}<span> {property.status === 'rented' ? '/ month' : ''}</span></div><div className="contact-owner"><div className="avatar avatar-large">{ownerName.charAt(0).toUpperCase()}</div><div><strong>{ownerName}</strong><span>Property owner</span></div></div>{notice && <div className={notice.startsWith('Your message') ? 'form-success' : 'form-error'} role="status">{notice}</div>}{user?._id === property.owner?._id ? <p className="owner-note">This is your listing. Manage it from your account.</p> : <form className="contact-form" onSubmit={contactOwner}><label className="field">Say hello<textarea rows="4" value={message} onChange={(event) => setMessage(event.target.value)} required placeholder="Hi, I’d love to know more about this home…" /></label><button className="btn btn-dark auth-submit" disabled={sending}>{sending ? 'Sending…' : 'Contact the owner'} <Icon name="arrow" size={16} /></button><span className="contact-note">A personal message goes straight to the owner.</span></form>}</aside></div></main>;
}
