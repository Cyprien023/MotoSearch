import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMotos } from '../api/motos';
import { addFavori, removeFavori, fetchFavoris } from '../api/favoris';
import { Moto, MotoFilters, SortField, SortOrder } from '../types/moto';
import { useAuthStore } from '../store/authStore';

const TYPES = ['Roadster', 'Trail', 'Sportive', 'Custom', 'Scooter', 'Supermotard', 'Trail routier'];

export default function MotosPage() {
    const { token } = useAuthStore();
    const [motos, setMotos] = useState<Moto[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [favorisIds, setFavorisIds] = useState<Set<string>>(new Set());

    const [filters, setFilters] = useState<MotoFilters>({});
    const [sortBy, setSortBy] = useState<SortField>('datePublication');
    const [order, setOrder] = useState<SortOrder>('desc');

    const load = async () => {
        setLoading(true);
        try {
            const data = await fetchMotos(filters, sortBy, order);
            setMotos(data.results);
            setCount(data.count);
        } finally {
            setLoading(false);
        }
    };

    const loadFavoris = async () => {
        if (!token) return;
        try {
            const data = await fetchFavoris();
            setFavorisIds(new Set(data.results.map((f) => f.motoId)));
        } catch {}
    };

    useEffect(() => { load(); }, [filters, sortBy, order]);
    useEffect(() => { loadFavoris(); }, [token]);

    const toggleFavori = async (motoId: string) => {
        if (!token) return;
        if (favorisIds.has(motoId)) {
            await removeFavori(motoId);
            setFavorisIds((prev) => { const s = new Set(prev); s.delete(motoId); return s; });
        } else {
            await addFavori(motoId);
            setFavorisIds((prev) => new Set(prev).add(motoId));
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Annonces de motos <span className="text-orange-400">({count})</span></h1>

                {/* Filtres */}
                <div className="bg-gray-900 rounded-xl p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <input
                        placeholder="Marque"
                        className="bg-gray-800 rounded px-3 py-2 text-sm"
                        onChange={(e) => setFilters((f) => ({ ...f, marque: e.target.value || undefined }))}
                    />
                    <input
                        placeholder="Modèle"
                        className="bg-gray-800 rounded px-3 py-2 text-sm"
                        onChange={(e) => setFilters((f) => ({ ...f, modele: e.target.value || undefined }))}
                    />
                    <select
                        className="bg-gray-800 rounded px-3 py-2 text-sm"
                        onChange={(e) => setFilters((f) => ({ ...f, type: (e.target.value as any) || undefined }))}
                    >
                        <option value="">Tous les types</option>
                        {TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                    <input
                        placeholder="Région"
                        className="bg-gray-800 rounded px-3 py-2 text-sm"
                        onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value || undefined }))}
                    />
                    <input
                        type="number"
                        placeholder="Prix min €"
                        className="bg-gray-800 rounded px-3 py-2 text-sm"
                        onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value ? Number(e.target.value) : undefined }))}
                    />
                    <input
                        type="number"
                        placeholder="Prix max €"
                        className="bg-gray-800 rounded px-3 py-2 text-sm"
                        onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value ? Number(e.target.value) : undefined }))}
                    />
                    <input
                        type="number"
                        placeholder="Km max"
                        className="bg-gray-800 rounded px-3 py-2 text-sm"
                        onChange={(e) => setFilters((f) => ({ ...f, maxKilometrage: e.target.value ? Number(e.target.value) : undefined }))}
                    />
                    <input
                        type="number"
                        placeholder="Année min"
                        className="bg-gray-800 rounded px-3 py-2 text-sm"
                        onChange={(e) => setFilters((f) => ({ ...f, minYear: e.target.value ? Number(e.target.value) : undefined }))}
                    />
                    <label className="flex items-center gap-2 text-sm col-span-2 md:col-span-1">
                        <input
                            type="checkbox"
                            className="accent-orange-500"
                            onChange={(e) => setFilters((f) => ({ ...f, permisA2: e.target.checked ? true : undefined }))}
                        />
                        Permis A2 uniquement
                    </label>

                    {/* Tri */}
                    <select
                        className="bg-gray-800 rounded px-3 py-2 text-sm"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortField)}
                    >
                        <option value="datePublication">Date</option>
                        <option value="prix">Prix</option>
                        <option value="kilometrage">Kilométrage</option>
                        <option value="annee">Année</option>
                        <option value="puissance">Puissance</option>
                        <option value="distance">Distance</option>
                    </select>
                    <select
                        className="bg-gray-800 rounded px-3 py-2 text-sm"
                        value={order}
                        onChange={(e) => setOrder(e.target.value as SortOrder)}
                    >
                        <option value="desc">Décroissant</option>
                        <option value="asc">Croissant</option>
                    </select>
                </div>

                {/* Liste */}
                {loading ? (
                    <p className="text-gray-400">Chargement...</p>
                ) : motos.length === 0 ? (
                    <p className="text-gray-400">Aucune annonce trouvée.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {motos.map((moto) => (
                            <div key={moto.id} className="bg-gray-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-orange-500 transition">
                                <img src={moto.photoUrl} alt={`${moto.marque} ${moto.modele}`} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <h2 className="font-bold text-lg">{moto.marque} {moto.modele}</h2>
                                        {token && (
                                            <button onClick={() => toggleFavori(moto.id)} className="text-xl">
                                                {favorisIds.has(moto.id) ? '❤️' : '🤍'}
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-orange-400 font-bold text-xl mb-2">{moto.prix.toLocaleString('fr-FR')} €</p>
                                    <div className="text-gray-400 text-sm space-y-1">
                                        <p>{moto.annee} · {moto.kilometrage.toLocaleString('fr-FR')} km · {moto.cylindree} cc</p>
                                        <p>{moto.type} · {moto.puissance} kW {moto.compatibleA2 && <span className="text-green-400">· A2 ✓</span>}</p>
                                        <p>📍 {moto.localisation} ({moto.region})</p>
                                    </div>
                                    <Link
                                        to={`/motos/${moto.id}`}
                                        className="mt-3 block text-center bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold py-2 rounded transition"
                                    >
                                        Voir l'annonce
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}