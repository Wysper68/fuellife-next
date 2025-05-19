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

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                setProducts((prev) => prev.filter((product) => product.id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Product name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="flex-1"
                    />
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={uploading}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={uploading} className="whitespace-nowrap">
                        {uploading ? 'Uploading...' : 'Add Product'}
                    </Button>
                </div>
            </form>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-[150px]">Image</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="text-center">{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className="text-center">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-auto" />
                                ) : (
                                    'No image'
                                )}
                            </TableCell>
                            <TableCell className="text-center">
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(product.id)}
                                    className="whitespace-nowrap"
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
