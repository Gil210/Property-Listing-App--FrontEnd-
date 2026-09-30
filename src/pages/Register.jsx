import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '', role: searchParams.get('role') === 'owner' ? 'owner' : 'user' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signUp(values);
      navigate('/dashboard', { replace: true });
    } catch (registerError) {
      setError(registerError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="auth-layout"><div className="auth-visual auth-visual-register"><div className="auth-visual-content"><div className="eyebrow"><span /> THE NEXT CHAPTER</div><h2>There's room<br />for <em>you here.</em></h2><p>A better way to find your place — or help someone find theirs.</p></div><span className="auth-image-credit">A home that makes space for life</span></div><section className="auth-panel"><div className="auth-card"><Link className="back-link" to="/"><Icon name="chevron" size={16} className="flip-icon" /> Back to discovering</Link><div className="auth-title"><div className="eyebrow"><span /> JOIN THE COMMUNITY</div><h1>Make yourself at home<span className="green-period">.</span></h1><p>Create your account. Your next step starts here.</p></div>{error && <div className="form-error" role="alert">{error}</div>}<form className="auth-form" onSubmit={submit}><label className="field">Your name<input name="name" autoComplete="name" minLength="2" maxLength="80" required value={values.name} onChange={update} placeholder="Alex Morgan" /></label><label className="field">Email address<input name="email" type="email" autoComplete="email" required value={values.email} onChange={update} placeholder="you@example.com" /></label><label className="field">Phone number <span className="field-hint">(optional)</span><input name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={update} placeholder="+1 (555) 000-0000" /></label><label className="field">Password <span className="field-hint">(at least 8 characters)</span><input name="password" type="password" autoComplete="new-password" minLength="8" maxLength="128" required value={values.password} onChange={update} placeholder="Create a password" /></label><label className="field">I’m here to…<select name="role" value={values.role} onChange={update}><option value="user">Find a place to call home</option><option value="owner">List and manage my property</option></select></label><button className="btn btn-dark auth-submit" disabled={submitting}>{submitting ? 'Creating your account…' : 'Create account'} <Icon name="arrow" size={17} /></button></form><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p><p className="auth-footnote">By continuing, you agree to our terms of service and privacy policy.</p></div></section></main>;
}
