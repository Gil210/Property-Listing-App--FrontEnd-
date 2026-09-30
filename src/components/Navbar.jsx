import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function logout() {
    signOut();
    navigate('/');
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link to="/" className="brand" aria-label="Haven home"><span className="brand-mark"><Icon name="home" size={19} /></span><span>haven<span className="brand-period">.</span></span></Link>
        <button className="mobile-menu" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Discover</NavLink>
          <a href="/#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          {user && <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>My account</NavLink>}
          <div className="nav-actions">
            {user ? <><Link className="nav-user" to="/dashboard"><span className="avatar">{user.name?.charAt(0)?.toUpperCase()}</span><span>{user.name?.split(' ')[0]}</span></Link><button className="btn btn-outline btn-small" onClick={logout}>Sign out</button></> : <><Link className="nav-login" to="/login" onClick={() => setMenuOpen(false)}>Log in</Link><Link className="btn btn-dark btn-small" to="/register" onClick={() => setMenuOpen(false)}>Get started <Icon name="arrow" size={15} /></Link></>}
          </div>
        </nav>
      </div>
    </header>
  );
}
