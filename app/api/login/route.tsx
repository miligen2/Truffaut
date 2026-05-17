import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const db = await connectDB();

    const { userId, dateNaissance } = await req.json();


    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return new Response("Utilisateur non trouvé", { status: 404 });
    }

    // 🧠 comparaison des dates
    const dateBase = new Date(user.dateNaissance).toISOString().split("T")[0];
    const dateInput = new Date(dateNaissance).toISOString().split("T")[0];

    if (dateBase !== dateInput) {
      return new Response("Date incorrecte", { status: 401 });
    }

    return new Response(JSON.stringify({ ok: true, user }), {
      status: 200,
    });

  } catch (error) {
    console.error(error);
    return new Response("Erreur serveur", { status: 500 });
  }
}