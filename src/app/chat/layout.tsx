"use client";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const conversationId = params.id as Id<"conversations">;
    const setOnlineStatus = useMutation(api.users.setOnlineStatus);

    // Set online when app mounts, offline when it unmounts/closes
    useEffect(() => {
        setOnlineStatus({ isOnline: true });

        const handleBeforeUnload = () => {
            setOnlineStatus({ isOnline: false });
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            setOnlineStatus({ isOnline: false });
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [setOnlineStatus]);

    return (
        <div className="h-screen flex bg-slate-950 bg-premium-dark text-white overflow-hidden relative">
            <div className={cn(
                "h-full w-full md:w-80 lg:w-96 flex-shrink-0 transition-all duration-300 md:relative md:block",
                conversationId ? "hidden md:block" : "block"
            )}>
                <Sidebar />
            </div>
            <main className={cn(
                "flex-1 flex flex-col overflow-hidden transition-all duration-300 h-full",
                conversationId ? "block" : "hidden md:flex"
            )}>
                {children}
            </main>
        </div>
    );
}
