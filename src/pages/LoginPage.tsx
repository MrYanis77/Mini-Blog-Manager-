import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Input, 
  Button
} from '@heroui/react';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirection automatique une fois le profil chargé
  useEffect(() => {
    if (user) {
      navigate(`/user/${user.id}`);
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // login() va maintenant tenter l'auth ET la récupération du profil complet
      await login(username, password);
    } catch (err: any) {
      // Gestion précise du message d'erreur
      setError(err.message || "Identifiants incorrects ou erreur serveur.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <Card className="w-full max-w-[450px] shadow-2xl border-none bg-background/60 backdrop-blur-md">
        <CardHeader className="flex flex-col gap-1 p-8 pb-0">
          <h2 className="text-2xl font-black">Connexion</h2>
          <p className="text-default-500 text-sm">Accédez à votre profil complet</p>
        </CardHeader>

        <CardBody className="p-8 gap-4">
          {/* Alerte si l'appel au profil complet (auth/me) a échoué */}
          {error && (
            <div className="bg-danger-50 text-danger-600 p-3 rounded-medium text-xs font-medium border border-danger-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              isRequired
              type="text"
              label="Nom d'utilisateur"
              variant="bordered"
              value={username}
              onValueChange={setUsername}
              labelPlacement="outside"
              classNames={{ label: "font-bold" }}
            />

            <Input
              isRequired
              type="password"
              label="Mot de passe"
              variant="bordered"
              value={password}
              onValueChange={setPassword}
              labelPlacement="outside"
              classNames={{ label: "font-bold" }}
            />

            <Button 
              type="submit" 
              color="primary" 
              size="lg"
              className="font-bold shadow-lg shadow-primary/30 mt-2"
              isLoading={loading}
              fullWidth
            >
              {loading ? "Chargement du profil..." : "Se connecter"}
            </Button>
          </form>
          
        </CardBody>
      </Card>
    </div>
  );
};