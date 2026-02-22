"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { UserButton } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Search, MessageSquarePlus, Users } from "lucide-react";
import { ConversationList } from "./ConversationList";
import { UserSearchResults } from "./UserSearchResults";
import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { CreateGroupModal } from "../groups/CreateGroupModal";
import { ThemeSwitcher } from "../theme/ThemeSwitcher";

export function Sidebar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const router = useRouter();

    const currentUser = useQuery(api.users.getCurrentUser);
    const conversations = useQuery(api.conversations.listConversations);
    const groups = useQuery(api.groups.listGroups);

    const searchResults = useQuery(
        api.users.searchUsers,
        searchQuery.length > 0 ? { query: searchQuery } : "skip"
    );

    const getOrCreateConversation = useMutation(
        api.conversations.getOrCreateConversation
    );

    const handleUserClick = async (userId: Id<"users">) => {
        const convId = await getOrCreateConversation({ otherUserId: userId });
        setSearchQuery("");
        router.push(`/chat/${convId}`);
    };

    const isSearching = searchQuery.length > 0;

    return (
        <aside className="w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-800 bg-slate-900 h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <MessageSquarePlus className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-white">Messages</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeSwitcher />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                                        onClick={() => setIsGroupModalOpen(true)}
                                    >
                                        <Users className="w-5 h-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>New Group Chat</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-8 h-8",
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Search bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search people..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-purple-500"
                    />
                </div>
            </div>

            {/* Current user greeting */}
            {currentUser && (
                <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400">
                        Signed in as{" "}
                        <span className="text-purple-400 font-medium">
                            {currentUser.name}
                        </span>
                    </p>
                </div>
            )}

            {/* Content: search results or conversation list */}
            <div className="flex-1 overflow-y-auto">
                {isSearching ? (
                    <UserSearchResults
                        results={searchResults ?? []}
                        onUserClick={handleUserClick}
                        isLoading={searchResults === undefined}
                    />
                ) : (
                    <ConversationList
                        conversations={conversations ?? []}
                        groups={groups ?? []}
                        isLoading={conversations === undefined || groups === undefined}
                    />
                )}
            </div>

            <CreateGroupModal
                open={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
            />
        </aside>
    );
}
