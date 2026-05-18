import { connectDB } from "@/lib/mongodb";
import { Document } from "mongodb";

type Rebus = Document & {
  _id: string;
  image: string;
  reponse: string;
};

export async function GET(
  req: Request,
  { params }: { params: { id: string} }
) {
  try {
    const db = await connectDB();

    const { id  } = await params;

    const rebus = await db
      .collection<Rebus>("rebus")
      .findOne({ _id: id });

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