import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Utilisateur déjà existant" },
        { status: 409 }
      );
    }
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erreur lors de la création de l'utilisateur",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, createdAt: true },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des utilisateurs",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
