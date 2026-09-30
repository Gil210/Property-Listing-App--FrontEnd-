import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, login as loginRequest, register as registerRequest } from '../api/auth';

const AuthContext = createContext(null);
const TOKEN_KEY = 'haven_access_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getCurrentUser(token)
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function acceptAuth(response) {
    const authToken = response.data?.token;
    if (!authToken || !response.data?.user) throw new Error('The API response did not include a user and access token.');
    localStorage.setItem(TOKEN_KEY, authToken);
    setToken(authToken);
    setUser(response.data.user);
    return response.data.user;
  }

  async function signIn(details) {
    return acceptAuth(await loginRequest(details));
  }

  async function signUp(details) {
    return acceptAuth(await registerRequest(details));
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ token, user, loading, signIn, signUp, signOut, setUser }), [token, user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
