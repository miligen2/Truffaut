import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectDB();

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const user = await db.collection("users").findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      return Response.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return Response.json(user, { status: 200 });

  } catch (error) {
    console.error("API ERROR:", error);

    return Response.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}