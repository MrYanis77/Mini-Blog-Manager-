import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import du hook de redirection
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Input, 
  Button 
} from '@heroui/react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  
  const { login, user, loading } = useAuth();
  const navigate = useNavigate(); // Initialisation de la navigation

  // Sécurité : Si l'utilisateur est déjà connecté, on le redirige immédiatement
  useEffect(() => {
    if (user) {
      navigate(`/user/${user.id}`);
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // On attend la fin de la connexion
      await login(email);
      // La redirection se fera via le useEffect ci-dessus une fois que 'user' sera mis à jour
    } catch (err) {
      setError("Identifiants inconnus. Indice : Sincere@april.biz");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <Card className="w-full max-w-[450px] shadow-2xl border-none bg-background/60 backdrop-blur-md">
        <CardHeader className="flex flex-col gap-1 p-8 pb-0">
          <h2 className="text-2xl font-black">Connexion</h2>
          <p className="text-default-500 text-sm">Accédez à votre espace blog</p>
        </CardHeader>

        <CardBody className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              isRequired
              type="text"
              label="Nom d'utilisateur"
              placeholder="Ex: Bret"
              variant="bordered"
              value={username}
              onValueChange={setUsername}
              labelPlacement="outside"
              classNames={{ label: "font-bold" }}
            />

            <Input
              isRequired
              type="email"
              label="Email"
              placeholder="Ex: Sincere@april.biz"
              variant="bordered"
              value={email}
              onValueChange={setEmail}
              labelPlacement="outside"
              classNames={{ label: "font-bold" }}
              isInvalid={!!error}
              errorMessage={error}
            />

            <Button 
              type="submit" 
              color="primary" 
              size="lg"
              className="font-bold shadow-lg shadow-primary/30 mt-2"
              isLoading={loading}
              fullWidth
            >
              Se connecter
            </Button>
          </form>
          
          <p className="text-center text-xs text-default-400 mt-6 italic">
            Utilisez les données de JSONPlaceholder pour tester.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};