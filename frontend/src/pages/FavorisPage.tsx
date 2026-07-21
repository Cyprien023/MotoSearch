import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchFavoris, removeFavori } from '../api/favoris';
import { Moto } from '../types/moto';
import { useAuthStore } from '../store/authStore';

export default function FavorisPage() {
    const { token } = useAuthStore();
    const navigate = useNavigate();
    const [motos, setMotos] = useState<Moto[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const data = await fetchFavoris();
            setMotos(data.results.map((f) => f.moto));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        load();
    }, [token]);

    const handleRemove = async (motoId: string) => {
        await removeFavori(motoId);
        setMotos((prev) => prev.filter((m) => m.id !== motoId));
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Mes favoris <span className="text-orange-400">({motos.length})</span></h1>
                {loading ? (
                    <p className="text-gray-400">Chargement...</p>
                ) : motos.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg mb-4">Aucun favori pour le moment.</p>
                        <Link to="/" className="bg-orange-500 hover:bg-orange-400 px-6 py-2 rounded font-semibold transition">
                            Parcourir les annonces
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {motos.map((moto) => (
                            <div key={moto.id} className="bg-gray-900 rounded-xl overflow-hidden">
                                <img src={moto.photoUrl} alt={`${moto.marque} ${moto.modele}`} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h2 className="font-bold text-lg mb-1">{moto.marque} {moto.modele}</h2>
                                    <p className="text-orange-400 font-bold text-xl mb-2">{moto.prix.toLocaleString('fr-FR')} €</p>
                                    <p className="text-gray-400 text-sm mb-3">{moto.annee} · {moto.kilometrage.toLocaleString('fr-FR')} km · {moto.localisation}</p>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/motos/${moto.id}`}
                                            className="flex-1 text-center bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold py-2 rounded transition"
                                        >
                                            Voir
                                        </Link>
                                        <button
                                            onClick={() => handleRemove(moto.id)}
                                            className="flex-1 bg-gray-700 hover:bg-red-600 text-sm font-semibold py-2 rounded transition"
                                        >
                                            Retirer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}