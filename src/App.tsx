import {  HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./components/AuthContext";
import { HeroUIProvider } from "@heroui/system";
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import PostsPage from './pages/PostsPage';
import UserPage from './pages/UserPage';
import ProfilePage from './pages/ProfilePage';
import ParametrePage from './pages/ParametrePage';
import CategoryPage from './components/CategoryPage';
import {ThemeProvider as NextThemesProvider} from "next-themes";

export function App() {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <AuthProvider>
          <HashRouter>
              <Navigation />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/Login" element={<LoginPage />} />
                  <Route path="/blog" element={<PostsPage />} />
                  <Route path="/user/:id" element={<UserPage />} />
                  <Route path="/user/:id/profile" element={<ProfilePage />} />
                  <Route path="/user/:id/paramètre" element={<ParametrePage />} />
                  <Route path="/category/:id" element={<CategoryPage />} />
                </Routes>
          </HashRouter>
        </AuthProvider>
      </NextThemesProvider> 
    </HeroUIProvider>
  );
}