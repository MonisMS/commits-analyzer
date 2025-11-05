import { getServerUser } from "@/lib/auth";
import { getClassificationStats } from "@/lib/classification/service";
import { error } from "console";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getServerUser()
        if(!user) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }
        const stats = await getClassificationStats(user.id);
        return NextResponse.json({
            success: true,
            data: stats
        });
        
    } catch (error) {
        console.error('Classification stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get classification stats' },
      { status: 500 }
    );
}
}