import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-premium-dark flex flex-col items-center justify-start py-12 md:py-20 px-4 text-white">
            <div className="w-full max-w-[480px] relative z-10">
                {/* Background glow effects */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="text-center mb-8 relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/20 mb-4 transition-transform hover:scale-105 duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-100 tracking-tight">Welcome back</h1>
                    <p className="text-slate-400 mt-3 text-lg">Sign in to continue chatting</p>
                </div>
                <div className="bg-slate-900/40 backdrop-blur-3xl p-1 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 p-6">
                        <SignIn appearance={{
                            variables: {
                                colorPrimary: "#8b5cf6",
                                colorBackground: "#211a46",
                                colorText: "white",
                                colorInputBackground: "#1e293b",
                                colorInputText: "white",
                            },
                            elements: {
                                rootBox: "w-full",
                                card: "bg-transparent shadow-none border-none w-full p-0",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "!bg-gray-600 !text-black hover:!bg-gray-900 border border-gray-300 shadow-md transition-all",
                                formButtonPrimary: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all",
                                footerActionText: "text-slate-400",
                                footerActionLink: "text-purple-400 hover:text-purple-300 transition-colors",
                                dividerLine: "bg-slate-800",
                                dividerText: "text-slate-500 font-medium",
                            }
                        }} />
                    </div>
                </div>
                <div className="mt-8 text-center pb-20">
                    <p className="text-slate-500 text-sm">Protected by industry-standard encryption</p>
                </div>
            </div>
        </div>
    );
}

