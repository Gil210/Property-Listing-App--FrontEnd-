import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link to="/" className="brand footer-brand"><span className="brand-mark"><span>h</span></span><span>haven<span className="brand-period">.</span></span></Link>
        <p>Make room for what matters.</p>
        <span className="footer-copy">© {new Date().getFullYear()} Haven Realty</span>
      </div>
    </footer>
  );
}
