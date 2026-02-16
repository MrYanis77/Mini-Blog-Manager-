import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  // Simulation d'une connexion via JSONPlaceholder
  const login = async (email: string) => {
    setLoading(true);
    try {
      // On cherche l'utilisateur par son email
      const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${email}`);
      const data = await response.json();

      if (data.length > 0) {
        const fakeToken = "JWT_FAKE_TOKEN_" + Math.random().toString(36).substring(7);
        setUser(data[0]);
        setToken(fakeToken);
        localStorage.setItem('token', fakeToken);
      } else {
        throw new Error("Utilisateur non trouvé");
      }
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être dans un AuthProvider");
  return context;
};