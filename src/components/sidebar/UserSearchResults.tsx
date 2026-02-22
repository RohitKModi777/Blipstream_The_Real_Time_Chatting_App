"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchX, Loader2 } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

interface User {
    _id: Id<"users">;
    name: string;
    imageUrl: string;
    isOnline: boolean;
}

interface UserSearchResultsProps {
    results: User[];
    onUserClick: (userId: Id<"users">) => void;
    isLoading: boolean;
}

export function UserSearchResults({
    results,
    onUserClick,
    isLoading,
}: UserSearchResultsProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 p-6 text-center">
                <SearchX className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm font-medium">No users found</p>
                <p className="text-slate-500 text-xs mt-1">
                    Try a different name
                </p>
            </div>
        );
    }

    return (
        <div>
            <p className="px-4 py-2 text-xs text-slate-500 font-medium uppercase tracking-wider">
                People
            </p>
            {results.map((user) => (
                <button
                    key={user._id}
                    onClick={() => onUserClick(user._id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors text-left"
                >
                    <div className="relative flex-shrink-0">
                        <Avatar className="w-11 h-11">
                            <AvatarImage src={user.imageUrl} />
                            <AvatarFallback className="bg-slate-700 text-white text-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">
                            {user.isOnline ? (
                                <span className="text-green-400">● Online</span>
                            ) : (
                                "Offline"
                            )}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
}
