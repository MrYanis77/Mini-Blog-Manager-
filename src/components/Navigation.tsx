import React from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Link,
  Divider
} from "@heroui/react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const categories = [
    { key: "tech", label: "Tech", desc: "Gadgets et logiciels" },
    { key: "lifestyle", label: "Lifestyle", desc: "Mode et bien-être" },
    { key: "gaming", label: "Gaming", desc: "Jeux et consoles" },
    { key: "voyage", label: "Voyage", desc: "Destinations de rêve" },
    { key: "cuisine", label: "Cuisine", desc: "Recettes gourmandes" },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered maxWidth="xl" className="bg-background/70 backdrop-blur-md">
      {/* --- Partie Gauche --- */}
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="sm:hidden"
        />
      </NavbarContent>

      {/* --- Partie Centrale (Liens Desktop) --- */}
      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        <NavbarItem isActive={location.pathname === "/"}>
          <Link as={RouterLink} to="/" color={location.pathname === "/" ? "primary" : "foreground"} className="text-sm font-semibold">
            Accueil
          </Link>
        </NavbarItem>

        <NavbarItem isActive={location.pathname === "/blog"}>
          <Link as={RouterLink} to="/blog" color={location.pathname === "/blog" ? "primary" : "foreground"} className="text-sm font-semibold">
            Blog
          </Link>
        </NavbarItem>

        {/* LIEN DYNAMIQUE : Mes Posts (visible seulement si connecté) */}
        {user && (
          <NavbarItem isActive={location.pathname === `/user/${user.id}`}>
            <Link 
              as={RouterLink} 
              to={`/user/${user.id}`} 
              color={location.pathname === `/user/${user.id}` ? "primary" : "foreground"} 
              className="text-sm font-semibold"
            >
              Mes Posts
            </Link>
          </NavbarItem>
        )}

        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent text-sm font-semibold"
                radius="sm"
                variant="light"
              >
                Catégories
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="Catégories du blog"
            className="w-[240px]"
            onAction={(key) => navigate(`/category/${key}`)}
          >
            {categories.map((cat) => (
              <DropdownItem key={cat.key} description={cat.desc}>
                {cat.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* --- Partie Droite : Auth --- */}
      <NavbarContent justify="end">
        <NavbarItem>
          {user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={user.name}
                  size="sm"
                  src={`https://i.pravatar.cc/150?u=${user.id}`}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Menu Profil" variant="flat">
                <DropdownItem key="profile_header" className="h-14 gap-2">
                  <p className="font-semibold">Connecté en tant que</p>
                  <p className="font-semibold text-primary">{user.username}</p>
                </DropdownItem>
                <DropdownItem key="profile" onClick={() => navigate(`/user/${user.id}/profile`)}>
                  Mon Profil
                </DropdownItem>
                <DropdownItem key="my-posts">
                  Paramètres
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={() => { logout(); navigate("/"); }}>
                  Déconnexion
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button as={RouterLink} to="/Login" color="primary" variant="flat" className="text-sm font-bold">
              Connexion
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* --- Menu Mobile --- */}
      <NavbarMenu className="pt-6 gap-4">
        <NavbarMenuItem>
          <Link as={RouterLink} to="/" className="w-full text-lg py-2" color="foreground">Accueil</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link as={RouterLink} to="/blog" className="w-full text-lg py-2" color="foreground">Blog</Link>
        </NavbarMenuItem>
        
        {user && (
          <NavbarMenuItem>
            <Link as={RouterLink} to={`/user/${user.id}`} className="w-full text-lg py-2" color="primary">
              Mes Posts
            </Link>
          </NavbarMenuItem>
        )}
        
        <Divider className="my-2" />
        <p className="text-xs font-bold text-default-400 uppercase px-2">Catégories</p>
        {categories.map((cat) => (
          <NavbarMenuItem key={cat.key}>
            <Link as={RouterLink} to={`/category/${cat.key}`} className="w-full text-base py-1 pl-4" color="foreground">
              {cat.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}