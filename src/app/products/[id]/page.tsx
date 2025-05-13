'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProduct } from '@/services/productService.service';
import { Button } from '@/components/ui/button';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getProduct(Number(id))
            .then(setProduct)
            .catch(() => setError('Produit introuvable'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-4">Chargement...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!product) return <div className="p-4">Aucun produit trouvé.</div>;

    return (
        <div style={{ padding: 20 }}>
            <h1 className="text-2xl font-bold mb-4">Détail du produit</h1>
            <div className="mb-2">ID : {product.id}</div>
            <div className="mb-2">Nom : {product.name}</div>
        </div>
    );
}
