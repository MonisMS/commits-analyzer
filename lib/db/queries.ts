import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function getUserById(id:string ){
    const result = await db.select().from(user).where(eq(user.id,id)).limit(1)

    return result[0] ;
}