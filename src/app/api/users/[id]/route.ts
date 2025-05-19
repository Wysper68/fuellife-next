import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = Number(params.id);
    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { error: "ID utilisateur requis ou invalide" },
        { status: 400 }
      );
    }
    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    // Supprimer l'utilisateur
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erreur lors de la suppression de l'utilisateur",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
