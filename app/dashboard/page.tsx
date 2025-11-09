import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    return (
        <div className="flex flex-row w-full max-w-full">
            <h1 className="text-2xl font-bold">Dashboard</h1>

        </div>
    );
}