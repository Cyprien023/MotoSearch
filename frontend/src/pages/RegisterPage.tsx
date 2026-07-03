import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(email, password);
            navigate('/login');
        } catch {
            setError('Erreur lors de la création du compte. Email déjà utilisé ?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="bg-gray-900 rounded-xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-white mb-6">Créer un compte</h1>
                {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-gray-800 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe (min. 6 caractères)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-gray-800 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-2 rounded transition disabled:opacity-50"
                    >
                        {loading ? 'Création...' : "Créer le compte"}
                    </button>
                </form>
                <p className="text-gray-400 text-sm mt-4">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-orange-400 hover:underline">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
}