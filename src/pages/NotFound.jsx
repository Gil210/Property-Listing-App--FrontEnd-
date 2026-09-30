import { Link } from 'react-router-dom';

export default function NotFound() {
  return <main className="not-found"><span className="eyebrow"><span /> LOST YOUR WAY?</span><h1>This isn’t the place<span className="green-period">.</span></h1><p>We couldn’t find the page you were looking for.</p><Link to="/" className="btn btn-dark">Back to Haven</Link></main>;
}
