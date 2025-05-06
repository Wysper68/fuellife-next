import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
}

export async function POST(request: Request) {
    try {
        const newProduct = await request.json();
        const createdProduct = await prisma.product.create({ data: newProduct });
        return NextResponse.json(createdProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create product", details: (error as Error).message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const updatedProduct = await request.json();
    const products = await prisma.product.findMany();
    const index = products.findIndex((p) => p.id === updatedProduct.id);
    if (index === -1) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    products[index] = updatedProduct;
    return NextResponse.json(updatedProduct);
}