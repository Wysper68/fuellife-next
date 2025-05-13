'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchProducts, createProduct, deleteProduct, uploadProductImage } from '@/services/productService.service';

interface Product {
    id: number;
    name: string;
    image?: string | null;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState<{ name: string; image: string | null }>({ name: '', image: null });
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProducts()
            .then((data: Product[]) => setProducts(data))
            .catch((err) => console.error(err));
    }, []);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const { imagePath } = await uploadProductImage(file);
            setNewProduct((prev) => ({ ...prev, image: imagePath }));
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const createdProduct: Product = await createProduct(newProduct);
            setProducts((prev) => [...prev, createdProduct]);
            setNewProduct({ name: '', image: null });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number, image?: string | null) => {
        try {
            await deleteProduct(id, image);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1 className="text-3xl font-bold">Nos Produits</h1>
            <p>Découvrez notre gamme de produits !</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="text"
                    placeholder="Nom du produit"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                />
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {uploading && <span>Upload en cours...</span>}
                <Button type="submit" disabled={uploading}>Ajouter le produit</Button>
            </form>

            <Table className="mt-6 w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>
                                {product.image && (
                                    <img src={product.image.startsWith('/') ? product.image : `/` + product.image} alt={product.name} style={{ maxWidth: 80, maxHeight: 80 }} />
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/products/${product.id}`)}
                                    >
                                        Voir les détails
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id, product.image)}>
                                        Supprimer
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}