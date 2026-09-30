import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signIn({ email, password });
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="auth-layout"><div className="auth-visual auth-visual-login"><div className="auth-visual-content"><div className="eyebrow"><span /> A GOOD PLACE TO BEGIN</div><h2>Home is where<br />your story <em>unfolds.</em></h2><p>Find a space that fits the life you’re building.</p></div><span className="auth-image-credit">A quiet corner, somewhere in the city</span></div><section className="auth-panel"><div className="auth-card"><Link className="back-link" to="/"><Icon name="chevron" size={16} className="flip-icon" /> Back to discovering</Link><div className="auth-title"><div className="eyebrow"><span /> WELCOME BACK</div><h1>Come on in<span className="green-period">.</span></h1><p>Sign in to pick up where you left off.</p></div>{error && <div className="form-error" role="alert">{error}</div>}<form className="auth-form" onSubmit={submit}><label className="field">Email address<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label><label className="field">Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" /></label><button className="btn btn-dark auth-submit" disabled={submitting}>{submitting ? 'Signing you in…' : 'Sign in'} <Icon name="arrow" size={17} /></button></form><p className="auth-switch">New to Haven? <Link to="/register">Create an account</Link></p><p className="auth-footnote">By continuing, you agree to our terms of service and privacy policy.</p></div></section></main>;
}
