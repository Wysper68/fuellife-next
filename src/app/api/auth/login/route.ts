import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const SECRET = process.env.JWT_SECRET || "dev-secret-key";
const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
        }
        // Chercher l'utilisateur dans la base de données
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
        }
        // Comparer le mot de passe
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
        }
        // Générer le token JWT
        const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, { expiresIn: "1h" });
        return NextResponse.json({ token });
    } catch (error) {
        return NextResponse.json({ error: "Erreur d'authentification", details: (error as Error).message }, { status: 400 });
    }
}
