import { connectDB } from "@/lib/mongodb";


export async function GET(req: Request) {
  try {
    const db = await connectDB();

    const userId = req.headers.get("userid");

    console.log("userID:", userId);

    if (!userId) {
      return Response.json(
        { error: "userId manquant" },
        { status: 400 }
      );
    }

    const rebus = await db
      .collection("rebus")
      .find()
      .toArray();

    const resultats = await db
      .collection("rebus_resultats")
      .find({ userId })
      .toArray();

    const rebusavecresultats = rebus.map((r) => {
      const res = resultats.find(
        (res) =>
          res.rebusId?.toString() ===
          r._id.toString()
      );

      return {
        ...r,
        resultats: res
          ? {
              success: res.success,
              time: res.time,
            }
          : null,
      };
    });

    return Response.json(
      rebusavecresultats,
      { status: 200 }
    );
  } catch (error) {
    console.error("API ERROR :", error);

    return new Response(
      "Erreur serveur",
      { status: 500 }
    );
  }
}