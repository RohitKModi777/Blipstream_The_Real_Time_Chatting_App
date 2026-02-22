"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Users, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CreateGroupModalProps {
    open: boolean;
    onClose: () => void;
}

export function CreateGroupModal({ open, onClose }: CreateGroupModalProps) {
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const users = useQuery(api.users.listUsers);
    const createGroup = useMutation(api.groups.createGroup);

    const toggleUser = (userId: Id<"users">) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleCreate = async () => {
        if (!groupName.trim()) {
            setError("Please enter a group name");
            return;
        }
        if (selectedUsers.length < 1) {
            setError("Please select at least 1 member");
            return;
        }

        setIsCreating(true);
        setError("");

        try {
            const groupId = await createGroup({
                name: groupName.trim(),
                memberIds: selectedUsers,
            });
            setGroupName("");
            setSelectedUsers([]);
            onClose();
            router.push(`/chat/group/${groupId}`);
        } catch (err) {
            setError("Failed to create group. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white">
                        <Users className="w-5 h-5 text-purple-400" />
                        Create Group Chat
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Group name */}
                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">
                            Group Name
                        </label>
                        <Input
                            placeholder="e.g. Team Alpha, Project X..."
                            value={groupName}
                            onChange={(e) => {
                                setGroupName(e.target.value);
                                setError("");
                            }}
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-purple-500"
                        />
                    </div>

                    {/* Member selection */}
                    <div>
                        <label className="text-sm text-slate-400 mb-2 block">
                            Add Members ({selectedUsers.length} selected)
                        </label>
                        <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-slate-700 bg-slate-800 p-1">
                            {users === undefined ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                                </div>
                            ) : users.length === 0 ? (
                                <p className="text-slate-400 text-sm text-center py-4">
                                    No other users found
                                </p>
                            ) : (
                                users.map((user: any) => (
                                    <button
                                        key={user._id}
                                        onClick={() => toggleUser(user._id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left",
                                            selectedUsers.includes(user._id)
                                                ? "bg-purple-600/20 border border-purple-500/50"
                                                : "hover:bg-slate-700"
                                        )}
                                    >
                                        <div className="relative">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={user.imageUrl} />
                                                <AvatarFallback className="bg-slate-600 text-white text-xs">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            {user.isOnline && (
                                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-slate-900" />
                                            )}
                                        </div>
                                        <span className="text-sm text-white flex-1">{user.name}</span>
                                        {selectedUsers.includes(user._id) && (
                                            <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-400 flex items-center gap-1">
                            ⚠️ {error}
                        </p>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={isCreating}
                        className="bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                        {isCreating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Group"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
