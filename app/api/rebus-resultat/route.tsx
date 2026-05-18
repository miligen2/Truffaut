import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const db = await connectDB();

    const body = await req.json();

    const result = await db.collection("rebus_resultats").insertOne({
      userId: body.userId,
      rebusId: body.rebusId,
      time: body.time,
      success: body.success,
      createdAt: new Date(),
    });
    console.log("BODY RECEIVED:", body);

    console.log("Résultat enregistré:", result);

    return Response.json({
      insertedId: result.insertedId,
    });

  } catch (error) {
    console.error(error);

    return new Response("Erreur serveur", {
      status: 500,
    });
  }
}