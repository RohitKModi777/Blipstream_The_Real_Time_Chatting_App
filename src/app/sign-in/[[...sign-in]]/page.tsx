import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-slate-950 bg-premium-dark flex items-center justify-center p-4">
            <div className="w-full max-w-md relative">
                {/* Decorative elements */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl" />

                <div className="text-center mb-8 relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/20 mb-4 transition-transform hover:scale-105 duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Welcome back</h1>
                    <p className="text-slate-400 mt-3 text-lg">Sign in to continue chatting</p>
                </div>
                <div className="relative z-10 backdrop-blur-sm bg-slate-900/40 p-1 rounded-2xl border border-white/5 shadow-2xl">
                    <SignIn appearance={{
                        variables: {
                            colorPrimary: "#8b5cf6",
                            colorBackground: "#0f172a",
                            colorText: "white",
                            colorInputBackground: "#1e293b",
                            colorInputText: "white",
                        },
                        elements: {
                            card: "bg-transparent shadow-none border-none",
                            headerTitle: "hidden",
                            headerSubtitle: "hidden",
                            socialButtonsBlockButton: "bg-slate-800 border-slate-700 hover:bg-slate-700 transition-colors",
                            formButtonPrimary: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all",
                            footerActionText: "text-slate-400",
                            footerActionLink: "text-purple-400 hover:text-purple-300 transition-colors",
                            dividerLine: "bg-slate-800",
                            dividerText: "text-slate-500 font-medium",
                        }
                    }} />
                </div>
            </div>
        </div>
    );
}
