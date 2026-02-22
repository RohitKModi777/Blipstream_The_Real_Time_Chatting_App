"use client";

interface TypingIndicatorProps {
    users: { name: string }[];
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
    if (users.length === 0) return null;

    const names =
        users.length === 1
            ? users[0].name
            : users.length === 2
                ? `${users[0].name} and ${users[1].name}`
                : `${users[0].name} and ${users.length - 1} others`;

    return (
        <div className="flex items-center gap-2 px-1 py-1">
            {/* Pulsing dots animation */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-2xl rounded-bl-sm px-3 py-2">
                <span
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                />
                <span
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                />
                <span
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                />
            </div>
            <span className="text-xs text-slate-400 italic">{names} is typing...</span>
        </div>
    );
}
