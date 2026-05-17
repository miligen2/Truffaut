import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();

    // 1. récupérer users + résultats
    const users = await db.collection("users").find({}).toArray();

    const results = await db
      .collection("rebus_resultats")
      .find({ success: true })
      .toArray();

    // 2. fusion + agrégation en JS
    const classement = results.reduce((acc: any[], r: any) => {
      let u = acc.find((x) => x._id === r.userId);

      if (!u) {
        u = {
          _id: r.userId,
          nom: users.find((user) => user.userId === r.userId)?.nom || null,
          totalTime: 0,
          count: 0,
        };

        acc.push(u);
      }

      u.totalTime += r.time;
      u.count += 1;

      return acc;
    }, []);

    // 3. tri (meilleur temps = meilleur score)
    classement.sort((a, b) => a.totalTime - b.totalTime);

    return Response.json(classement);

  } catch (error) {
    console.error("CLASSEMENT ERROR:", error);

    return Response.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}