import { NextResponse } from "next/server";

let products = [
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
];

export async function GET() {
    return NextResponse.json(products);
}

export async function POST(request: Request) {
    const newProduct = await request.json();
    newProduct.id = Date.now();
    products.push(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
}

export async function PUT(request: Request) {
    const updatedProduct = await request.json();
    const index = products.findIndex((p) => p.id === updatedProduct.id);
    if (index === -1) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    products[index] = updatedProduct;
    return NextResponse.json(updatedProduct);
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    products.splice(index, 1);
    return NextResponse.json({ message: "Product deleted successfully" });
}
