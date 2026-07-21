import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
    const { user, token, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-orange-400">
        🏍️ MotoSearch
    </Link>
    <div className="flex items-center gap-4">
        {token ? (
                <>
                    <Link to="/favoris" className="hover:text-orange-400 transition">
              ❤️ Favoris
    </Link>
    <span className="text-gray-400 text-sm">{user?.email}</span>
    <button
    onClick={handleLogout}
    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition"
        >
        Déconnexion
        </button>
        </>
) : (
        <>
            <Link to="/login" className="hover:text-orange-400 transition">
        Connexion
        </Link>
        <Link
    to="/register"
    className="bg-orange-500 hover:bg-orange-400 px-3 py-1 rounded text-sm transition"
        >
        Inscription
        </Link>
        </>
)}
    </div>
    </nav>
);
}