import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// 🔥 Seed basée sur la date (YYYYMMDD)
function getDaySeed() {
  const now = new Date();
  return (
    now.getFullYear() * 10000 +
    (now.getMonth() + 1) * 100 +
    now.getDate()
  );
}

// 🔥 hash simple (stable)
function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export async function GET(req: Request) {
  try {
    const db = await connectDB();

    const userId = req.headers.get("userid");

    if (!userId) {
      return Response.json(
        { error: "userId manquant" },
        { status: 400 }
      );
    }

    // 📦 Tous les rébus
    const rebus = await db
      .collection("rebus")
      .find()
      .toArray();

    // 📊 Résultats user
    const resultats = await db
      .collection("rebus_resultats")
      .find({ userId })
      .toArray();

    const seed = getDaySeed();

    // 🔥 SHUFFLE STABLE (identique pour tous aujourd’hui)
    const shuffled = [...rebus].sort((a, b) => {
      const hashA = hashCode(a._id.toString() + seed);
      const hashB = hashCode(b._id.toString() + seed);
      return hashA - hashB;
    });

    // 🔗 merge résultats
    const rebusAvecResultats = shuffled.map((r) => {
      const res = resultats.find(
        (res) =>
          res.rebusId?.toString() === r._id.toString()
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

    return Response.json(rebusAvecResultats, {
      status: 200,
    });
  } catch (error) {
    console.error("API ERROR :", error);

    return new Response("Erreur serveur", {
      status: 500,
    });
  }
}