import { connectDB } from "@/lib/mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string} }
) {
  try {
    const db = await connectDB();

    const { id  } = await params;

    const rebus = await db.collection("rebus").findOne({
      _id: id, // ⚠️ string, pas ObjectId
    });

    if (!rebus) {
      return new Response("Rebus non trouvé", { status: 404 });
    }

    return new Response(JSON.stringify(rebus), {
      status: 200,
    });

  } catch (error) {
    console.error("API ERROR:", error);
    return new Response("Erreur serveur", { status: 500 });
  }
}