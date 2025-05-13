import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const product = await prisma.product.findUnique({ where: { id: parseInt(params.id) } });
    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const deletedProduct = await prisma.product.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ message: "Product deleted successfully", deletedProduct });
    } catch (error) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
}