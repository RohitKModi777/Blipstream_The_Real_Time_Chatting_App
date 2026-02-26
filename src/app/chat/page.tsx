import { MessageSquare } from "lucide-react";

export default function ChatPage() {
    return (
        <div className="flex-1 flex items-center justify-center bg-transparent">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 mb-2">
                    <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Your Messages</h2>
                <p className="text-slate-400 max-w-sm">
                    Select a conversation from the sidebar or search for someone to start
                    chatting.
                </p>
            </div>
        </div>
    );
}
