import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MotosPage from './pages/MotosPage';
import MotoDetailPage from './pages/MotoDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FavorisPage from './pages/FavorisPage';

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<MotosPage />} />
                <Route path="/motos/:id" element={<MotoDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/favoris" element={<FavorisPage />} />
            </Routes>
        </BrowserRouter>
    );
}