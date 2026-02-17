import { useAuth } from "../components/AuthContext";
import { Card, CardHeader, CardBody, Divider, Button, Chip, User } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Si l'utilisateur n'est pas connecté, on affiche un état vide ou on redirige
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-default-500">Veuillez vous connecter pour voir votre profil.</p>
        <Button color="primary" onClick={() => navigate("/Login")}>Aller à la connexion</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <User
          name={user.name}
          description={`@${user.username}`}
          avatarProps={{
            src: `https://i.pravatar.cc/150?u=${user.id}`,
            size: "lg",
            isBordered: true,
            color: "primary"
          }}
          classNames={{
            name: "text-2xl font-bold",
            description: "text-primary font-medium"
          }}
        />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* --- Informations Personnelles --- */}
        <Card className="border-none bg-default-50 shadow-sm">
          <CardHeader className="flex gap-2">
            <p className="font-bold">Contact & Réseaux</p>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <div className="flex flex-col">
              <span className="text-tiny uppercase text-default-400 font-bold">Email</span>
              <p className="text-sm">{user.email}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-tiny uppercase text-default-400 font-bold">Site Web</span>
              <p className="text-sm text-primary underline">{user.website}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-tiny uppercase text-default-400 font-bold">Téléphone</span>
              <p className="text-sm text-primary underline">{user.phone}</p>
            </div>
          </CardBody>
        </Card>

        {/* --- Entreprise --- */}
        <Card className="border-none bg-default-50 shadow-sm">
          <CardHeader className="flex gap-2">
            <p className="font-bold">Entreprise</p>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <div className="flex flex-col">
              <span className="text-tiny uppercase text-default-400 font-bold">Nom</span>
              <p className="text-sm font-semibold">{user.company?.name}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-tiny uppercase text-default-400 font-bold">Slogan</span>
              <p className="text-sm italic text-default-500">"{user.company?.catchPhrase}"</p>
            </div>
          </CardBody>
        </Card>

        {/* --- Adresse --- */}
        <Card className="border-none bg-default-50 shadow-sm md:col-span-2">
          <CardHeader className="flex justify-between items-center">
            <p className="font-bold">Localisation</p>
            <Chip size="sm" variant="dot" color="success">Vérifié</Chip>
          </CardHeader>
          <Divider />
          <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-tiny uppercase text-default-400 font-bold">Rue</span>
              <p className="text-sm">{user.address?.street}, {user.address?.suite}</p>
            </div>
            <div>
              <span className="text-tiny uppercase text-default-400 font-bold">Ville</span>
              <p className="text-sm">{user.address?.city}</p>
            </div>
            <div>
              <span className="text-tiny uppercase text-default-400 font-bold">Code Postal</span>
              <p className="text-sm">{user.address?.zipcode}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <footer className="mt-12 text-center">
        <Button 
          variant="light" 
          color="primary" 
          onPress={() => navigate(`/user/${user.id}`)}
        >
          Gérer mes Posts →
        </Button>
      </footer>
    </div>
  );
}