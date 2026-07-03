import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMotoById } from '../api/motos';
import { addFavori, removeFavori, fetchFavoris } from '../api/favoris';
import { Moto } from '../types/moto';
import { useAuthStore } from '../store/authStore';

export default function MotoDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { token } = useAuthStore();
    const navigate = useNavigate();
    const [moto, setMoto] = useState<Moto | null>(null);
    const [isFavori, setIsFavori] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchMotoById(id).then(setMoto).catch(() => navigate('/'));
        if (token) {
            fetchFavoris().then((data) => {
                setIsFavori(data.results.some((f) => f.motoId === id));
            }).catch(() => {});
        }
    }, [id, token]);

    const toggleFavori = async () => {
        if (!id || !token) return;
        if (isFavori) {
            await removeFavori(id);
            setIsFavori(false);
        } else {
            await addFavori(id);
            setIsFavori(true);
        }
    };

    if (!moto) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Chargement...</div>;

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-4 transition">← Retour</button>
                <img src={moto.photoUrl} alt={`${moto.marque} ${moto.modele}`} className="w-full h-72 object-cover rounded-xl mb-6" />
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold">{moto.marque} {moto.modele}</h1>
                        <p className="text-orange-400 text-2xl font-bold mt-1">{moto.prix.toLocaleString('fr-FR')} €</p>
                    </div>
                    {token && (
                        <button onClick={toggleFavori} className="text-3xl">{isFavori ? '❤️' : '🤍'}</button>
                    )}
                </div>
                <div className="bg-gray-900 rounded-xl p-6 grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-400">Année</span><p className="font-semibold">{moto.annee}</p></div>
                    <div><span className="text-gray-400">Kilométrage</span><p className="font-semibold">{moto.kilometrage.toLocaleString('fr-FR')} km</p></div>
                    <div><span className="text-gray-400">Cylindrée</span><p className="font-semibold">{moto.cylindree} cc</p></div>
                    <div><span className="text-gray-400">Puissance</span><p className="font-semibold">{moto.puissance} kW</p></div>
                    <div><span className="text-gray-400">Type</span><p className="font-semibold">{moto.type}</p></div>
                    <div><span className="text-gray-400">Permis A2</span><p className="font-semibold">{moto.compatibleA2 ? '✅ Compatible' : '❌ Non compatible'}</p></div>
                    <div><span className="text-gray-400">Localisation</span><p className="font-semibold">📍 {moto.localisation}</p></div>
                    <div><span className="text-gray-400">Région</span><p className="font-semibold">{moto.region}</p></div>
                    <div><span className="text-gray-400">Vendeur</span><p className="font-semibold">{moto.vendeur}</p></div>
                    <div><span className="text-gray-400">Publié le</span><p className="font-semibold">{new Date(moto.datePublication).toLocaleDateString('fr-FR')}</p></div>
                </div>
            </div>
        </div>
    );
}