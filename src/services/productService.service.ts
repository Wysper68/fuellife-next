export async function fetchProducts() {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Erreur lors de la récupération des produits");
    return res.json();
}

export async function createProduct(product: { name: string; image?: string | null }) {
    const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Erreur lors de la création du produit");
    return res.json();
}

export async function uploadProductImage(image: File) {
    const formData = new FormData();
    formData.append('image', image);
    const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
    });
    if (!res.ok) throw new Error("Erreur lors de l'upload de l'image");
    return res.json();
}

export async function updateProduct(product: any) {
    const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour du produit");
    return res.json();
}

export async function deleteProduct(id: number, imagePath?: string | null) {
    const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression du produit");
    if (imagePath) {
        await fetch(`/api/products/upload?imagePath=${encodeURIComponent(imagePath)}`, {
            method: "DELETE",
        });
    }
    return res.json();
}

export async function getProduct(id: number) {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération du produit");
    return res.json();
}
