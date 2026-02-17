import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./components/AuthContext";
import { HeroUIProvider } from "@heroui/system";
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import PostsPage from './pages/PostsPage';
import UserPage from './pages/UserPage';
import ProfilePage from './pages/ProfilePage';

export function App() {
  return (
    <HeroUIProvider>
      <AuthProvider>
        <BrowserRouter>
            <Navigation />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/Login" element={<LoginPage />} />
                <Route path="/blog" element={<PostsPage />} />
                <Route path="/user/:id" element={<UserPage />} />
                <Route path="/user/:id/profile" element={<ProfilePage />} />
              </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HeroUIProvider>
  );
}