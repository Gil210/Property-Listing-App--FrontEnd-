import { useEffect, useState } from 'react';
import { changePassword, getProfile, updateProfile } from '../api/users';
import { deleteProperty, getMyProperties } from '../api/properties';
import { getReceivedMessages, getSentMessages, markMessageRead } from '../api/messages';
import { API_BASE_URL } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import PropertyCard from '../components/PropertyCard';
import PropertyForm from '../components/PropertyForm';

const sections = [
  { id: 'overview', label: 'Overview', icon: 'home' },
  { id: 'listings', label: 'My listings', icon: 'pin', ownersOnly: true },
  { id: 'messages', label: 'Messages', icon: 'mail' },
  { id: 'profile', label: 'Profile & security', icon: 'user' }
];
const apiDocsUrl = API_BASE_URL.replace(/\/api\/v1\/?$/, '/api-docs');

export default function Dashboard() {
  const { user, token, setUser } = useAuth();
  const [section, setSection] = useState('overview');
  const [profile, setProfile] = useState(user);
  const [listings, setListings] = useState([]);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [messageBox, setMessageBox] = useState('received');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [passwordValues, setPasswordValues] = useState({ currentPassword: '', newPassword: '' });

  const canList = user.role === 'owner' || user.role === 'admin';
  const visibleSections = sections.filter((item) => !item.ownersOnly || canList);

  async function loadDashboard() {
    setLoading(true);
    setError('');
    const tasks = [
      getProfile(token).then((response) => { setProfile(response.data); setUser(response.data); }),
      getReceivedMessages(token).then((response) => setReceived(response.data || [])),
      getSentMessages(token).then((response) => setSent(response.data || []))
    ];
    if (canList) tasks.push(getMyProperties(token).then((response) => setListings(response.data || [])));
    const results = await Promise.allSettled(tasks);
    const failed = results.find((result) => result.status === 'rejected');
    if (failed) setError(failed.reason.message);
    setLoading(false);
  }

  useEffect(() => { loadDashboard(); }, [token]);

  async function saveProfile(event) {
    event.preventDefault();
    setNotice('');
    setError('');
    setSavingProfile(true);
    try {
      const response = await updateProfile({ name: profile.name, phone: profile.phone || '' }, token);
      setProfile(response.data);
      setUser(response.data);
      setNotice('Your profile has been updated.');
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(event) {
    event.preventDefault();
    setNotice('');
    setError('');
    try {
      await changePassword(passwordValues, token);
      setPasswordValues({ currentPassword: '', newPassword: '' });
      setNotice('Your password has been changed.');
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  async function removeListing(property) {
    if (!window.confirm(`Remove “${property.title}” from your listings?`)) return;
    setError('');
    setNotice('');
    try {
      await deleteProperty(property._id, token);
      setListings((current) => current.filter((item) => item._id !== property._id));
      setNotice('Your listing has been removed.');
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  async function readMessage(item) {
    if (messageBox !== 'received' || item.isRead) return;
    try {
      const response = await markMessageRead(item._id, token);
      setReceived((current) => current.map((message) => message._id === item._id ? response.data : message));
    } catch (readError) {
      setError(readError.message);
    }
  }

  function savedListing() {
    setShowForm(false);
    setEditing(null);
    setNotice('Your property listing has been saved.');
    getMyProperties(token).then((response) => setListings(response.data || [])).catch((loadError) => setError(loadError.message));
  }

  const unreadCount = received.filter((item) => !item.isRead).length;

  return (
    <main className="dashboard-page">
      <div className="dashboard-heading"><div><div className="eyebrow"><span /> YOUR HAVEN</div><h1>Good to see you, {user.name?.split(' ')[0]}<span className="green-period">.</span></h1><p>Keep your home search and listings all in one place.</p></div><div className="dashboard-profile-chip"><span className="avatar avatar-large">{user.name?.charAt(0)?.toUpperCase()}</span><div><strong>{user.name}</strong><span className="role-label">{user.role}</span></div></div></div>
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar"><div className="sidebar-label">YOUR SPACE</div>{visibleSections.map((item) => <button key={item.id} className={`sidebar-item ${section === item.id ? 'active' : ''}`} onClick={() => { setSection(item.id); setNotice(''); setError(''); }}><Icon name={item.icon} size={18} />{item.label}{item.id === 'messages' && unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}</button>)}<div className="sidebar-bottom"><div className="sidebar-help">A little help goes a long way.<br /><span>Questions? We’re here for you.</span></div><a className="sidebar-docs" href={apiDocsUrl} target="_blank" rel="noreferrer">API documentation <Icon name="arrow" size={14} /></a></div></aside>
        <section className="dashboard-content">
          {error && <div className="error-banner" role="alert">{error}</div>}
          {notice && <div className="form-success" role="status">{notice}</div>}
          {loading ? <div className="page-loading"><span className="spinner" />Loading your space…</div> : <>
            {section === 'overview' && <div className="dash-overview"><div className="dashboard-title-row"><div><span className="eyebrow-small">YOUR OVERVIEW</span><h2>A little update</h2></div></div><div className="stat-grid"><div className="dash-stat"><span>Active listings</span><strong>{canList ? listings.filter((item) => item.status === 'available').length : '—'}</strong><small>{canList ? 'Homes you’re sharing' : 'Become an owner to list'}</small></div><div className="dash-stat"><span>Inbox</span><strong>{received.length}</strong><small>{unreadCount ? `${unreadCount} unread message${unreadCount === 1 ? '' : 's'}` : 'You’re all caught up'}</small></div><div className="dash-stat"><span>Messages sent</span><strong>{sent.length}</strong><small>Owner conversations started</small></div></div><div className="dashboard-callout"><div className="callout-icon"><Icon name="message" size={21} /></div><div><strong>Make the next move.</strong><p>Found somewhere you love? Send the owner a note directly from any property page.</p></div><a href="/" className="text-link">Explore homes <Icon name="arrow" size={15} /></a></div>{canList && <div className="dashboard-title-row overview-listing-heading"><div><span className="eyebrow-small">YOUR PLACES</span><h2>Recently listed</h2></div><button className="text-link button-link" onClick={() => setSection('listings')}>View all <Icon name="arrow" size={15} /></button></div>}{canList && (listings.length ? <div className="property-grid dashboard-property-grid">{listings.slice(0, 2).map((item) => <PropertyCard key={item._id} property={item} />)}</div> : <div className="empty-inline">Your first listing is a few steps away. <button className="text-link button-link" onClick={() => { setSection('listings'); setShowForm(true); }}>Add a property <Icon name="arrow" size={15} /></button></div>)}</div>}
            {section === 'listings' && canList && <div><div className="dashboard-title-row"><div><span className="eyebrow-small">YOUR PLACES</span><h2>My listings</h2><p className="dashboard-subtitle">Manage the homes you’re sharing with the Haven community.</p></div>{!showForm && !editing && <button className="btn btn-dark" onClick={() => setShowForm(true)}><Icon name="plus" size={17} /> Add a listing</button>}</div>{showForm || editing ? <div className="dashboard-form-card"><div className="form-card-heading"><h3>{editing ? 'Edit your listing' : 'Add a new place'}</h3><button className="icon-button" onClick={() => { setShowForm(false); setEditing(null); }} aria-label="Close form"><Icon name="close" /></button></div><PropertyForm property={editing} onSaved={savedListing} onCancel={() => { setShowForm(false); setEditing(null); }} /></div> : listings.length ? <div className="owner-listing-grid">{listings.map((item) => <div className="owner-listing" key={item._id}><PropertyCard property={item} compact /><div className="owner-listing-actions"><span className={`status-pill status-${item.status}`}>{item.status}</span><button className="btn btn-outline btn-small" onClick={() => { setEditing(item); setShowForm(false); }}>Edit listing</button><button className="btn btn-quiet btn-small" onClick={() => removeListing(item)}>Remove</button></div></div>)}</div> : <div className="empty-state dashboard-empty"><div className="empty-icon"><Icon name="home" size={25} /></div><h3>Your first place starts here</h3><p>Share a home with people who are ready to find one.</p><button className="btn btn-dark" onClick={() => setShowForm(true)}><Icon name="plus" size={16} /> Create your first listing</button></div>}</div>}
            {section === 'messages' && <div><div className="dashboard-title-row"><div><span className="eyebrow-small">CONVERSATIONS</span><h2>Your messages</h2></div></div><div className="message-tabs"><button className={messageBox === 'received' ? 'selected' : ''} onClick={() => setMessageBox('received')}>Inbox {unreadCount > 0 && <span>{unreadCount}</span>}</button><button className={messageBox === 'sent' ? 'selected' : ''} onClick={() => setMessageBox('sent')}>Sent</button></div>{(messageBox === 'received' ? received : sent).length ? <div className="message-list">{(messageBox === 'received' ? received : sent).map((item) => { const other = messageBox === 'received' ? item.sender : item.receiver; return <article className={`message-item ${!item.isRead && messageBox === 'received' ? 'message-unread' : ''}`} key={item._id} onClick={() => readMessage(item)}><div className="avatar">{other?.name?.charAt(0)?.toUpperCase() || 'H'}</div><div className="message-body"><div className="message-meta"><strong>{other?.name || 'Haven member'}</strong><span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span></div><h3>{item.subject}</h3><p>{item.message}</p><span className="message-property"><Icon name="pin" size={14} />{item.property?.title || 'Property enquiry'}</span></div>{!item.isRead && messageBox === 'received' && <span className="unread-dot" aria-label="Unread" />}</article>; })}</div> : <div className="empty-state dashboard-empty"><div className="empty-icon"><Icon name="mail" size={23} /></div><h3>{messageBox === 'received' ? 'Your inbox is nice and quiet' : 'No messages sent yet'}</h3><p>When you connect with an owner, the conversation will appear here.</p><a className="btn btn-outline" href="/">Explore homes</a></div>}</div>}
            {section === 'profile' && <div><div className="dashboard-title-row"><div><span className="eyebrow-small">YOUR DETAILS</span><h2>Profile & security</h2><p className="dashboard-subtitle">Keep your contact details up to date.</p></div></div><div className="profile-forms"><form className="dashboard-form-card" onSubmit={saveProfile}><h3>Personal details</h3><label className="field">Full name<input value={profile?.name || ''} required minLength="2" maxLength="80" onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} /></label><label className="field">Email address<input value={profile?.email || ''} readOnly /></label><label className="field">Phone number<input type="tel" value={profile?.phone || ''} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} placeholder="Add a phone number" /></label><button className="btn btn-dark" disabled={savingProfile}>{savingProfile ? 'Saving…' : 'Save changes'} <Icon name="arrow" size={15} /></button></form><form className="dashboard-form-card" onSubmit={savePassword}><h3>Change password</h3><label className="field">Current password<input type="password" required value={passwordValues.currentPassword} onChange={(event) => setPasswordValues((current) => ({ ...current, currentPassword: event.target.value }))} /></label><label className="field">New password <span className="field-hint">(at least 8 characters)</span><input type="password" required minLength="8" value={passwordValues.newPassword} onChange={(event) => setPasswordValues((current) => ({ ...current, newPassword: event.target.value }))} /></label><button className="btn btn-outline">Update password <Icon name="arrow" size={15} /></button></form></div></div>}
          </>}
        </section>
      </div>
    </main>
  );
}
