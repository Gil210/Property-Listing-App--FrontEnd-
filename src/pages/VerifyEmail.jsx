import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { verifyOTP } from '../api/auth';
import Icon from '../components/Icon';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await verifyOTP({ email, otp });
      navigate('/login', { replace: true, state: { email, verified: true } });
    } catch (verificationError) {
      setError(verificationError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="auth-layout"><div className="auth-visual auth-visual-register"><div className="auth-visual-content"><div className="eyebrow"><span /> ONE LAST STEP</div><h2>Your next chapter<br />starts <em>here.</em></h2><p>Verify your email to finish creating your Haven account.</p></div><span className="auth-image-credit">A home that makes space for life</span></div><section className="auth-panel"><div className="auth-card"><Link className="back-link" to="/register"><Icon name="chevron" size={16} className="flip-icon" /> Back to registration</Link><div className="auth-title"><div className="eyebrow"><span /> CHECK YOUR INBOX</div><h1>Verify your email<span className="green-period">.</span></h1><p>Enter the six-digit code we sent you. It expires after seven minutes.</p></div>{error && <div className="form-error" role="alert">{error}</div>}<form className="auth-form" onSubmit={submit}><label className="field">Email address<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label><label className="field">Verification code<input type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength="6" maxLength="6" required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" /></label><button className="btn btn-dark auth-submit" disabled={submitting}>{submitting ? 'Verifying…' : 'Verify email'} <Icon name="arrow" size={17} /></button></form><p className="auth-switch">Already verified? <Link to="/login">Sign in</Link></p></div></section></main>;
}
