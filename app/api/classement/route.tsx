import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();

    // 1. récupérer users + résultats
    const users = await db.collection("users").find({}).toArray();

    const classement = await db.collection('rebus_resultats').aggregate([
      {
        $group : {
          _id: "$userId",
          totalTime:{ $sum : "$time"},
          totalGames: { $sum: 1 }
        }
      },
      {
        $addFields: {
          userIdObj : { $toObjectId: "$_id"}
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userIdObj",
          foreignField: "_id",
          as : "user"
        } 
      },
      {
        $unwind: "$user"
      },
      {
        $sort: {
          totalGames: -1 ,
          totalTime: 1,
        }
      }
  ]).toArray()
  
  return Response.json(classement)

  } catch (error) {
    console.error("CLASSEMENT ERROR:", error);

    return Response.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}