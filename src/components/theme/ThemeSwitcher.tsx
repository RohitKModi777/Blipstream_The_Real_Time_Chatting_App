"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
    Moon,
    Sun,
    Palette,
    Check,
    Monitor
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const backgrounds = [
    { id: "default", name: "Classic Dark", class: "" },
    { id: "purple", name: "Royal Purple", class: "theme-purple" },
    { id: "blue", name: "Deep Blue", class: "theme-blue" },
    { id: "emerald", name: "Emerald Knight", class: "theme-emerald" },
];

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [currentBg, setCurrentBg] = useState("default");

    useEffect(() => {
        setMounted(true);
        const savedBg = localStorage.getItem("chat-bg") || "default";
        setCurrentBg(savedBg);
        if (savedBg !== "default") {
            document.documentElement.classList.add(`theme-${savedBg}`);
        }
    }, []);

    const handleBgChange = (bgId: string) => {
        backgrounds.forEach(bg => {
            if (bg.id !== "default") {
                document.documentElement.classList.remove(`theme-${bg.id}`);
            }
        });

        if (bgId !== "default") {
            document.documentElement.classList.add(`theme-${bgId}`);
        }

        setCurrentBg(bgId);
        localStorage.setItem("chat-bg", bgId);
    };

    if (!mounted) return (
        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400">
            <Palette className="h-[1.2rem] w-[1.2rem]" />
        </Button>
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <Palette className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-popover/95 backdrop-blur-xl border-border text-popover-foreground p-2 shadow-2xl z-[100]">
                <div className="space-y-4">
                    <div>
                        <DropdownMenuLabel className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1 px-2">
                            Interface Theme
                        </DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setTheme("light")} className="focus:bg-accent focus:text-accent-foreground cursor-pointer rounded-lg transition-colors py-2 px-3">
                            <Sun className="mr-3 h-4 w-4" />
                            <span className="text-sm">Light</span>
                            {theme === "light" && <Check className="ml-auto h-4 w-4 text-purple-600 dark:text-purple-400" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")} className="focus:bg-accent focus:text-accent-foreground cursor-pointer rounded-lg transition-colors py-2 px-3">
                            <Moon className="mr-3 h-4 w-4" />
                            <span className="text-sm">Dark</span>
                            {theme === "dark" && <Check className="ml-auto h-4 w-4 text-purple-600 dark:text-purple-400" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")} className="focus:bg-accent focus:text-accent-foreground cursor-pointer rounded-lg transition-colors py-2 px-3">
                            <Monitor className="mr-3 h-4 w-4" />
                            <span className="text-sm">System</span>
                            {theme === "system" && <Check className="ml-auto h-4 w-4 text-purple-600 dark:text-purple-400" />}
                        </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="bg-white/5 mx-2" />

                    <div>
                        <DropdownMenuLabel className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1 px-2">
                            Background Style
                        </DropdownMenuLabel>
                        <div className="grid grid-cols-1 gap-1">
                            {backgrounds.map((bg) => (
                                <DropdownMenuItem
                                    key={bg.id}
                                    onClick={() => handleBgChange(bg.id)}
                                    className="focus:bg-accent focus:text-accent-foreground cursor-pointer rounded-lg transition-colors py-2 px-3"
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded-full mr-3 border-2 border-border shadow-inner",
                                        bg.id === "default" && "bg-slate-900 border-slate-700",
                                        bg.id === "purple" && "bg-purple-600",
                                        bg.id === "blue" && "bg-blue-600",
                                        bg.id === "emerald" && "bg-emerald-600"
                                    )} />
                                    <span className="text-sm">{bg.name}</span>
                                    {currentBg === bg.id && <Check className="ml-auto h-4 w-4 text-purple-600 dark:text-purple-400" />}
                                </DropdownMenuItem>
                            ))}
                        </div>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

