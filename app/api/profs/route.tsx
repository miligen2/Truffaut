
import { connectDB } from "@/lib/mongodb";



export async function GET() {
    try {
        const db = await connectDB();
        const users = await db.collection('users').find({}).toArray()
        if (!users) {
         return Response.json([], { status: 404 });
        }
        return Response.json(users , { status:200 });
        
    } catch (error) {
  console.error("API ERROR:", error);
  return new Response("Erreur serveur", { status: 500 });
}
}