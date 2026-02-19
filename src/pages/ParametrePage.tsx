import { useState } from "react";
import { 
  Card, CardBody, CardHeader, 
  Input, Button, Divider, 
  Avatar, Badge, Chip,
  Tabs, Tab
} from "@heroui/react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ParametrePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // État local synchronisé avec l'utilisateur actuel
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    username: user?.username || "",
    image: user?.image || "",
    address: {
      address: user?.address?.address || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      postalCode: user?.address?.postalCode || "",
    }
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulation d'appel API vers DummyJSON
      const response = await fetch(`https://dummyjson.com/users/${user?.id}`, {
        method: 'PUT', // ou PATCH
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        
        // Mise à jour de l'état global dans le Context
        // Note: On fusionne avec les données existantes au cas où DummyJSON n'envoie pas tout
        if (setUser) {
          setUser({ ...user, ...formData } as any);
        }
        
        alert("Paramètres mis à jour avec succès (simulation) !");
      }
    } catch (error) {
      console.error("Erreur mise à jour:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black uppercase italic mb-8">Paramètres du profil</h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* --- Colonne Gauche : Avatar --- */}
        <div className="flex flex-col items-center gap-4">
          <Badge content="Éditer" color="primary" placement="bottom-right" shape="circle" className="cursor-pointer">
            <Avatar 
              src={formData.image} 
              className="w-32 h-32 text-large border-4 border-default-100" 
              isBordered
            />
          </Badge>
          <div className="text-center">
            <p className="font-bold text-lg">{formData.firstName} {formData.lastName}</p>
            <p className="text-default-400 text-sm">@{formData.username}</p>
          </div>
        </div>

        {/* --- Colonne Droite : Formulaires --- */}
        <div className="flex-1">
          <Tabs aria-label="Options" color="primary" variant="underlined" classNames={{ tabList: "gap-6", cursor: "w-full" }}>
            
            {/* Onglet 1: Profil */}
            <Tab key="profile" title="Identité">
              <Card className="border-none shadow-none bg-transparent">
                <CardBody className="gap-4 px-0 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Prénom" 
                      variant="bordered" 
                      value={formData.firstName}
                      onValueChange={(val) => setFormData({...formData, firstName: val})}
                    />
                    <Input 
                      label="Nom" 
                      variant="bordered" 
                      value={formData.lastName}
                      onValueChange={(val) => setFormData({...formData, lastName: val})}
                    />
                  </div>
                  <Input 
                    label="Nom d'utilisateur" 
                    variant="bordered" 
                    startContent={<span className="text-default-400">@</span>}
                    value={formData.username}
                    onValueChange={(val) => setFormData({...formData, username: val})}
                  />
                  <Input 
                    label="Email" 
                    type="email" 
                    variant="bordered" 
                    value={formData.email}
                    onValueChange={(val) => setFormData({...formData, email: val})}
                  />
                  <Input 
                    label="Téléphone" 
                    variant="bordered" 
                    value={formData.phone}
                    onValueChange={(val) => setFormData({...formData, phone: val})}
                  />
                </CardBody>
              </Card>
            </Tab>

            {/* Onglet 2: Adresse */}
            <Tab key="address" title="Adresse & Localisation">
              <Card className="border-none shadow-none bg-transparent">
                <CardBody className="gap-4 px-0 py-4">
                  <Input 
                    label="Rue" 
                    variant="bordered" 
                    value={formData.address.address}
                    onValueChange={(val) => setFormData({
                      ...formData, 
                      address: { ...formData.address, address: val }
                    })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Ville" 
                      variant="bordered" 
                      value={formData.address.city}
                      onValueChange={(val) => setFormData({
                        ...formData, 
                        address: { ...formData.address, city: val }
                      })}
                    />
                    <Input 
                      label="Code Postal" 
                      variant="bordered" 
                      value={formData.address.postalCode}
                      onValueChange={(val) => setFormData({
                        ...formData, 
                        address: { ...formData.address, postalCode: val }
                      })}
                    />
                  </div>
                  <Input 
                    label="État / Région" 
                    variant="bordered" 
                    value={formData.address.state}
                    onValueChange={(val) => setFormData({
                      ...formData, 
                      address: { ...formData.address, state: val }
                    })}
                  />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>

          <Divider className="my-6" />

          <div className="flex gap-3 justify-end">
            <Button variant="flat" onPress={() => navigate("/Profile")}>
              Annuler
            </Button>
            <Button 
              color="primary" 
              className="font-bold px-10" 
              onPress={handleSave}
              isLoading={loading}
            >
              Enregistrer les modifications
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}