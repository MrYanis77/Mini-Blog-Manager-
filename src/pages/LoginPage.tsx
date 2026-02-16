import { useState } from 'react';
import { useAuth } from '../components/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const { login, user, logout, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email);
    } catch (err) {
      alert("Email inconnu (Testez avec: Sincere@april.biz)");
    }
  };

  if (user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Bienvenue, {user.name} !</h3>
        <p>Email: {user.email}</p>
        <button onClick={logout}>Déconnexion</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', padding: '20px' }}>
      <h2>Login (via JSONPlaceholder)</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Entrez votre email (ex: Sincere@april.biz)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Vérification...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};