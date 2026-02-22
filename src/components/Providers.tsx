"use client";

import { ConvexReactClient, useMutation } from "convex/react";
import { ClerkProvider, useAuth, useUser } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { api } from "../../convex/_generated/api";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

function BackgroundProvider() {
  useEffect(() => {
    const savedBg = localStorage.getItem("chat-bg") || "default";
    if (savedBg !== "default") {
      document.documentElement.classList.add(`theme-${savedBg}`);
    }
  }, []);
  return null;
}

function SyncUser() {
  const { user } = useUser();
  const upsertUser = useMutation(api.users.upsertUser);

  useEffect(() => {
    if (!user) return;

    upsertUser({
      clerkId: user.id,
      name:
        user.fullName ||
        user.username ||
        "User",
      email:
        user.primaryEmailAddress?.emailAddress || "",
      imageUrl: user.imageUrl || "",
    });
  }, [user]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <BackgroundProvider />
          <SyncUser />
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}