import { useAuth } from "../components/AuthContext";
import { Card, CardHeader, CardBody, Divider, Button, Chip, User } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Si l'utilisateur n'est pas connecté
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
          name={`${user.firstName} ${user.lastName}`}
          description={`@${user.username}`}
          avatarProps={{
            src: user.image, // Utilise l'image de DummyJSON
            size: "lg",
            isBordered: true,
            color: "primary"
          }}
          classNames={{
            name: "text-2xl font-bold",
            description: "text-primary font-medium"
          }}
        />
        <Chip color="primary" variant="flat" size="lg">ID: #{user.id}</Chip>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* --- Informations Personnelles --- */}
        <Card className="border-none bg-default-50 shadow-sm">
          <CardHeader className="flex gap-2">
            <p className="font-bold">Contact & Identité</p>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <div className="flex flex-col">
              <span className="text-tiny uppercase text-default-400 font-bold">Email</span>
              <p className="text-sm">{user.email}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-tiny uppercase text-default-400 font-bold">Téléphone</span>
              <p className="text-sm">{user.phone}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-tiny uppercase text-default-400 font-bold">Date de naissance</span>
              <p className="text-sm">{user.birthDate}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-tiny uppercase text-default-400 font-bold">Genre</span>
              <p className="text-sm capitalize">{user.gender}</p>
            </div>
          </CardBody>
        </Card>

        {/* --- Localisation --- */}
        <Card className="border-none bg-default-50 shadow-sm">
          <CardHeader className="flex justify-between items-center">
            <p className="font-bold">Adresse</p>
            <Chip size="sm" variant="dot" color="success">Domicile</Chip>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <div className="flex flex-col">
              <span className="text-tiny uppercase text-default-400 font-bold">Rue</span>
              {/* Utilisation de ?. pour éviter le crash si address est undefined */}
              <p className="text-sm">{user.address?.address || "Non renseignée"}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-tiny uppercase text-default-400 font-bold">Ville</span>
              <p className="text-sm">
                {user.address?.city ? `${user.address.city}, ${user.address.stateCode || ''}` : "Ville inconnue"}
              </p>
            </div>
            <div className="flex flex-col">
              <span className="text-tiny uppercase text-default-400 font-bold">Pays</span>
              <p className="text-sm">{user.address?.country || "Non renseigné"}</p>
            </div>
            {/* Vérification complète pour les coordonnées */}
            {user.address?.coordinates && (
              <div className="flex flex-col">
                <span className="text-tiny uppercase text-default-400 font-bold">Coordonnées</span>
                <p className="text-xs text-default-500">
                  Lat: {user.address.coordinates.lat} / Lng: {user.address.coordinates.lng}
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <footer className="mt-12 text-center flex justify-center gap-4">
        <Button 
          variant="flat" 
          color="primary" 
          onPress={() => navigate(`/user/${user.id}`)}
        >
          Voir mes publications
        </Button>
        <Button 
          variant="light" 
          color="danger" 
          onPress={() => {
            // Tu peux ajouter ici une fonction de logout si nécessaire
            navigate("/Login");
          }}
        >
          Déconnexion
        </Button>
      </footer>
    </div>
  );
}