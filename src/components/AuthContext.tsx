import { createContext, useContext, useState,type ReactNode } from 'react';

// --- Interfaces ---

export interface User {
  phone: ReactNode;
  id: number;
  name: string;
  username: string;
  email: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
  };
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

// --- Types du Contexte ---

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provider ---

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  // Connexion via JSONPlaceholder
  const login = async (email: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${email}`);
      const data: User[] = await response.json();

      if (data.length > 0) {
        const fakeToken = "JWT_FAKE_TOKEN_" + Math.random().toString(36).substring(7);
        setUser(data[0]);
        setToken(fakeToken);
        localStorage.setItem('token', fakeToken);
      } else {
        throw new Error("Utilisateur non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Hook personnalisé ---

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};