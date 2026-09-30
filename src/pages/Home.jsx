import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProperties } from '../api/properties';
import Icon from '../components/Icon';
import PropertyCard from '../components/PropertyCard';

const heroImage = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '', city: searchParams.get('city') || '',
    propertyType: searchParams.get('propertyType') || '', minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '', bedrooms: searchParams.get('bedrooms') || ''
  });
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getProperties({ ...Object.fromEntries(searchParams), status: 'available', limit: 9, sort: '-createdAt' })
      .then((response) => {
        if (active) {
          setProperties(Array.isArray(response.data) ? response.data : []);
          setPagination(response.pagination || null);
        }
      })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [searchParams]);

  function submitSearch(event) {
    event.preventDefault();
    const next = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => { if (value) next.set(key, value); });
    setSearchParams(next);
  }

  function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function changePage(nextPage) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(nextPage));
    setSearchParams(next);
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(19,31,27,.70), rgba(19,31,27,.12)), url("${heroImage}")` }}>
        <div className="hero-content">
          <div className="eyebrow hero-eyebrow"><span /> A more considered way home</div>
          <h1>Find a place<br />to <em>belong.</em></h1>
          <p>Good homes change everything. Discover spaces made for the way you want to live.</p>
          <a className="hero-link" href="#listings">Explore homes <Icon name="arrow" size={17} /></a>
        </div>
        <div className="hero-note"><span>01 — 03</span><i /> Spaces with a story</div>
      </section>

      <section className="search-section" aria-label="Search properties">
        <form className="search-panel" onSubmit={submitSearch}>
          <label className="search-field search-field-wide"><span>Location or keyword</span><div className="search-input"><Icon name="search" size={19} /><input name="search" value={filters.search} onChange={updateFilter} placeholder="Try ‘a sunny apartment’" /></div></label>
          <label className="search-field"><span>City</span><div className="search-input"><Icon name="pin" size={18} /><input name="city" value={filters.city} onChange={updateFilter} placeholder="Anywhere" /></div></label>
          <label className="search-field"><span>Home type</span><select name="propertyType" value={filters.propertyType} onChange={updateFilter}><option value="">Any type</option><option value="apartment">Apartment</option><option value="house">House</option><option value="condo">Condo</option><option value="land">Land</option><option value="commercial">Commercial</option></select></label>
          <button className="btn btn-green search-button"><Icon name="search" size={18} /> Find a home</button>
          <div className="search-extra">
            <label className="mini-field"><span>Min price (₦)</span><input aria-label="Minimum price" name="minPrice" type="number" min="0" value={filters.minPrice} onChange={updateFilter} placeholder="Any" /></label>
            <label className="mini-field"><span>Max price (₦)</span><input aria-label="Maximum price" name="maxPrice" type="number" min="0" value={filters.maxPrice} onChange={updateFilter} placeholder="Any" /></label>
            <label className="mini-field"><span>Bedrooms</span><select aria-label="Bedrooms" name="bedrooms" value={filters.bedrooms} onChange={updateFilter}><option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></label>
          </div>
        </form>
      </section>

      <section className="section listings-section" id="listings">
        <div className="section-heading">
          <div><div className="eyebrow"><span /> THE HAVEN EDIT</div><h2>Places worth<br className="mobile-break" /> coming home to<span className="green-period">.</span></h2></div>
          <p>Thoughtful spaces, selected with you in mind.<br />Your next chapter could start right here.</p>
        </div>
        {error && <div className="error-banner" role="alert">{error}</div>}
        {loading ? <div className="loading-grid">{[1, 2, 3].map((item) => <div className="skeleton-card" key={item}><div /><span /><span /></div>)}</div> : properties.length ? (
          <div className="property-grid">{properties.map((property) => <PropertyCard key={property._id} property={property} />)}</div>
        ) : !error ? (
          <div className="empty-state"><div className="empty-icon"><Icon name="home" size={25} /></div><h3>No homes found just yet</h3><p>Try widening your search or check back soon for new listings.</p><button className="btn btn-outline" onClick={() => { setFilters({ search: '', city: '', propertyType: '', minPrice: '', maxPrice: '', bedrooms: '' }); setSearchParams({}); }}>Clear filters</button></div>
        ) : null}
        {pagination?.totalPages > 1 && <div className="pagination"><button disabled={page <= 1} onClick={() => changePage(page - 1)}>Previous</button><span>Page {pagination.page} of {pagination.totalPages}</span><button disabled={page >= pagination.totalPages} onClick={() => changePage(page + 1)}>Next <Icon name="chevron" size={15} /></button></div>}
        {pagination && <div className="results-count">Showing {properties.length} of {pagination.total} homes</div>}
      </section>

      <section className="how-section" id="how-it-works">
        <div className="how-photo"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="Light-filled living room with warm natural textures" /><div className="photo-caption"><span>THE ART OF FEELING AT HOME</span><span>01 / 03</span></div></div>
        <div className="how-copy"><div className="eyebrow"><span /> A LITTLE LESS LOOKING</div><h2>More than four walls.<br /><em>A feeling.</em></h2><p>Finding home shouldn't feel like work. We bring thoughtful listings, real people, and the details that matter into one easy place.</p><div className="how-steps"><div><span>01</span><p><strong>Find your feeling</strong>Tell us what home looks like to you.</p></div><div><span>02</span><p><strong>Meet your match</strong>Explore places that feel just right.</p></div><div><span>03</span><p><strong>Make it yours</strong>Connect with owners and take the next step.</p></div></div><Link className="text-link" to="/register">Start your search <Icon name="arrow" size={17} /></Link></div>
      </section>

      <section className="cta-section"><div><div className="eyebrow"><span /> HAVE A PLACE TO SHARE?</div><h2>Good homes deserve<br />to be <em>found.</em></h2></div><div className="cta-right"><p>Connect with people looking for a place just like yours. List your property in a few simple steps.</p><Link className="btn btn-light" to="/register?role=owner">List your property <Icon name="arrow" size={16} /></Link></div></section>
    </>
  );
}
