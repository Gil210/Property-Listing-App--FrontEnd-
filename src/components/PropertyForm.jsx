import { useState } from 'react';
import { createProperty, updateProperty } from '../api/properties';
import { useAuth } from '../context/AuthContext';

const blank = {
  title: '', description: '', propertyType: 'apartment', price: '', location: '', address: '',
  city: '', state: '', country: '', bedrooms: '1', bathrooms: '1', squareFeet: '', status: 'available', amenities: ''
};

export default function PropertyForm({ property, onSaved, onCancel }) {
  const { token } = useAuth();
  const [values, setValues] = useState(() => property ? { ...blank, ...property, amenities: property.amenities?.join(', ') || '' } : blank);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function update(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSaving(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'amenities') formData.append(key, JSON.stringify(value.split(',').map((item) => item.trim()).filter(Boolean)));
      else formData.append(key, value);
    });
    Array.from(images).forEach((image) => formData.append('images', image));
    try {
      if (property?._id) await updateProperty(property._id, formData, token);
      else await createProperty(formData, token);
      onSaved();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="listing-form" onSubmit={submit}>
      {error && <div className="form-error" role="alert">{error}</div>}
      <div className="form-grid">
        <label className="field field-wide">Listing title<input name="title" value={values.title} onChange={update} required maxLength="160" placeholder="A bright home in the heart of the city" /></label>
        <label className="field">Property type<select name="propertyType" value={values.propertyType} onChange={update}><option value="apartment">Apartment</option><option value="house">House</option><option value="condo">Condo</option><option value="land">Land</option><option value="commercial">Commercial</option><option value="hotel">Hotel</option></select></label>
        <label className="field">Price<input name="price" type="number" min="0" value={values.price} onChange={update} required placeholder="450000" /></label>
        <label className="field field-wide">Description<textarea name="description" value={values.description} onChange={update} required rows="4" placeholder="Tell people what makes this place special…" /></label>
        <label className="field">Street address<input name="address" value={values.address} onChange={update} required /></label>
        <label className="field">Neighbourhood<input name="location" value={values.location} onChange={update} required /></label>
        <label className="field">City<input name="city" value={values.city} onChange={update} required /></label>
        <label className="field">State / region<input name="state" value={values.state} onChange={update} required /></label>
        <label className="field">Country<input name="country" value={values.country} onChange={update} required /></label>
        <label className="field">Status<select name="status" value={values.status} onChange={update}><option value="available">Available</option><option value="rented">Rented</option><option value="sold">Sold</option><option value="unavailable">Unavailable</option></select></label>
        <label className="field">Bedrooms<input name="bedrooms" type="number" min="0" value={values.bedrooms} onChange={update} required /></label>
        <label className="field">Bathrooms<input name="bathrooms" type="number" min="0" value={values.bathrooms} onChange={update} required /></label>
        <label className="field">Area (sqft)<input name="squareFeet" type="number" min="0" value={values.squareFeet} onChange={update} required /></label>
        <label className="field field-wide">Amenities <span className="field-hint">(separate with commas)</span><input name="amenities" value={values.amenities} onChange={update} placeholder="Balcony, Parking, Garden" /></label>
        <label className="field field-wide">Photos <span className="field-hint">(up to 10 JPG, PNG or WebP · 5 MB each)</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => setImages(event.target.files)} /></label>
      </div>
      <div className="form-actions"><button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button><button className="btn btn-dark" disabled={saving}>{saving ? 'Saving…' : property ? 'Save changes' : 'Publish listing'}</button></div>
    </form>
  );
}
