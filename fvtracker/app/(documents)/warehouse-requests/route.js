import { fetchManager } from "@/lib/auth/fetchSessionData";
import { FINANCIAL_MANAGER } from "@/lib/constants/users/managerTypes";

export async function GET(request) { }
export async function POST(request) { 
    try {
        const {specificManager, unauthorized} = await fetchManager({
            managerNames:[FINANCIAL_MANAGER]
        })
        if(unauthorized){
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }
        
    }
}
