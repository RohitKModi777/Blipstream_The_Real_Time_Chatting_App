"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
    conversation: {
        _id: string;
        name: string;
        imageUrl?: string;
        isOnline?: boolean;
        isGroup?: boolean;
        memberCount?: number;
    };
    onBack: () => void;
}

export function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
    const { name, imageUrl, isOnline, isGroup, memberCount } = conversation;

    return (
        <header className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 transition-all">
            <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="md:hidden text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="relative group cursor-pointer">
                {isGroup ? (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
                        <Users className="w-6 h-6" />
                    </div>
                ) : (
                    <Avatar className="w-12 h-12 rounded-2xl border-2 border-slate-800 transition-all group-hover:border-purple-500/50 group-hover:shadow-lg group-hover:shadow-purple-500/10">
                        <AvatarImage src={imageUrl} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white font-bold text-lg">
                            {name?.charAt(0).toUpperCase() ?? "?"}
                        </AvatarFallback>
                    </Avatar>
                )}
                {!isGroup && (
                    <span className={cn(
                        "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900 transition-all duration-300",
                        isOnline ? "bg-green-500 scale-100" : "bg-slate-500 scale-90"
                    )} />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-lg tracking-tight truncate leading-tight">
                        {name ?? "Unknown"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <p className={cn(
                        "text-[12px] font-semibold transition-colors duration-300",
                        isOnline ? "text-green-400" : "text-slate-500"
                    )}>
                        {isGroup ? `${memberCount} members` : isOnline ? "Active now" : "Offline"}
                    </p>
                    {isOnline && !isGroup && (
                        <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                        </span>
                    )}
                </div>
            </div>
        </header>
    );
}
