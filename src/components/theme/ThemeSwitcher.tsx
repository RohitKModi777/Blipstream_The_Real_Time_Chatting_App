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

    if (!mounted) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800">
                    <Palette className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-200">
                <DropdownMenuLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Interface Theme
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme("light")} className="focus:bg-slate-800 focus:text-white cursor-pointer">
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                    {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="focus:bg-slate-800 focus:text-white cursor-pointer">
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                    {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="focus:bg-slate-800 focus:text-white cursor-pointer">
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>System</span>
                    {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-800" />

                <DropdownMenuLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Background Style
                </DropdownMenuLabel>
                {backgrounds.map((bg) => (
                    <DropdownMenuItem
                        key={bg.id}
                        onClick={() => handleBgChange(bg.id)}
                        className="focus:bg-slate-800 focus:text-white cursor-pointer"
                    >
                        <div className={cn(
                            "w-4 h-4 rounded-full mr-2 border border-slate-700",
                            bg.id === "default" && "bg-slate-950",
                            bg.id === "purple" && "bg-purple-900",
                            bg.id === "blue" && "bg-blue-900",
                            bg.id === "emerald" && "bg-emerald-900"
                        )} />
                        <span>{bg.name}</span>
                        {currentBg === bg.id && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
