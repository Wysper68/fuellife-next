import { NextResponse } from 'next/server';

let products = [
  { id: 1, name: 'Product 1', price: 100 },
  { id: 2, name: 'Product 2', price: 200 },
];

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === parseInt(params.id));
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}