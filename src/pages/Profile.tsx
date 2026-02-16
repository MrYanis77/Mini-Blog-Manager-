import { useAuth } from '../components/AuthContext';

export const Profil = () => {
  const { user } = useAuth();

  if (!user) return <p>Veuillez vous connecter.</p>;

  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
      <h3>Informations Profil</h3>
      <ul>
        <li><strong>Prénom :</strong> {user.firstName}</li>
        <li><strong>Nom :</strong> {user.lastName}</li>
        <li><strong>Email :</strong> {user.email}</li>
        <li><strong>Téléphone :</strong> {user.phone}</li>
      </ul>
    </div>
  );
};