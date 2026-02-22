# 💬 Real-Time Chat App

A full-stack real-time messaging app built with **Next.js 14**, **TypeScript**, **Convex**, and **Clerk**.

## ✨ Features

- 🔐 **Authentication** — Sign up/in with email or social login (Clerk)
- 👥 **User Search** — Search and find other users by name
- 💬 **Real-time DMs** — One-on-one messaging with instant updates via Convex subscriptions
- 🕐 **Smart Timestamps** — Time-aware message formatting (today/this year/older)
- 🟢 **Online Status** — Live online/offline indicator per user
- ✏️ **Typing Indicator** — Animated "X is typing..." with 2s debounce
- 🔴 **Unread Badges** — Per-conversation unread message counts
- ↓ **Smart Auto-Scroll** — Auto-scroll with "New messages" button
- 🗑️ **Delete Messages** — Soft delete with "This message was deleted"
- 😊 **Reactions** — 5 emoji reactions with toggle and counts
- 📱 **Responsive** — Mobile-first with full-screen chat and back button

---

## 🚀 Setup & Running

### Step 1: Install Dependencies
```bash
cd chat-app
npm install
```

### Step 2: Create Clerk Account & App
1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) and create an account
2. Create a new application (enable Email + Google)
3. Copy your **Publishable Key** and **Secret Key**

### Step 3: Create Convex Project
1. Go to [dashboard.convex.dev](https://dashboard.convex.dev) and create an account
2. Create a new project
3. Copy your **Deployment URL**

### Step 4: Configure Clerk + Convex JWT
1. In Clerk Dashboard → **JWT Templates** → **New template** → Choose **Convex**
2. Copy the **Issuer** URL (e.g. `https://xxx.clerk.accounts.dev`)

### Step 5: Configure Clerk Webhook
1. In Clerk Dashboard → **Webhooks** → **Add Endpoint**
2. URL: `https://YOUR_CONVEX_URL/clerk-webhook`
3. Subscribe to: `user.created`, `user.updated`
4. Copy the **Signing Secret**

### Step 6: Fill in `.env.local`
Open `.env.local` and fill in all the values:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER_DOMAIN=https://xxx.clerk.accounts.dev
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
CLERK_WEBHOOK_SECRET=whsec_...
```

### Step 7: Initialize Convex & Deploy Schema
```bash
npx convex dev
```
This will push the schema/functions to Convex and start the dev server.

### Step 8: Run the App
In a separate terminal:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — sign up with two different accounts to test real-time messaging!

---

## 🗂️ Project Structure

```
chat-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (providers)
│   │   ├── page.tsx             # Redirect to /chat
│   │   ├── sign-in/             # Clerk sign-in page
│   │   ├── sign-up/             # Clerk sign-up page
│   │   └── chat/
│   │       ├── layout.tsx       # Chat shell + online status
│   │       ├── page.tsx         # Empty state
│   │       └── [id]/page.tsx    # Active conversation
│   ├── components/
│   │   ├── Providers.tsx        # Clerk + Convex providers
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── ConversationList.tsx
│   │   │   ├── ConversationItem.tsx
│   │   │   └── UserSearchResults.tsx
│   │   └── chat/
│   │       ├── ChatHeader.tsx
│   │       ├── MessageList.tsx
│   │       ├── MessageBubble.tsx
│   │       ├── MessageInput.tsx
│   │       └── TypingIndicator.tsx
│   ├── lib/
│   │   └── formatters.ts        # Timestamp formatting utilities
│   └── middleware.ts            # Clerk auth middleware
├── convex/
│   ├── schema.ts                # Database schema
│   ├── users.ts                 # User queries/mutations
│   ├── conversations.ts         # Conversation queries/mutations
│   ├── messages.ts              # Message queries/mutations
│   ├── typing.ts                # Typing indicator logic
│   ├── helpers.ts               # Auth helper
│   ├── http.ts                  # Clerk webhook endpoint
│   └── auth.config.ts           # Convex auth config (Clerk JWT)
└── .env.local                   # Environment variables (fill in!)
```

## 🛠️ Tech Stack

| Tech | Purpose |
|------|---------|
| Next.js 14 (App Router) | Full-stack React framework |
| TypeScript | Type safety |
| Convex | Real-time backend + database |
| Clerk | Authentication |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |

---

## 🧠 Technical Deep Dive

### 1. Real-Time Architecture (Convex)
Unlike traditional REST APIs, this app uses **Convex** for a truly reactive backend.
- **Queries** automatically subscribe the UI to data changes. When a new message is added to the `messages` table, every client's `useQuery` hook automatically re-renders with the fresh data.
- **Mutations** handle data updates with built-in optimistic UI support, ensuring zero latency for common actions like sending a message.

### 2. Authentication Flow (Clerk + Convex)
We use a seamless integration between **Clerk** (identity) and **Convex** (data):
- **Clerk** handles the frontend login/signup UI and JWT issuance.
- **Convex** validates these JWTs using a custom `auth.config.ts`.
- **Webhooks**: When a user signs up on Clerk, a webhook triggers a Convex function to sync the user profile into the Convex database, ensuring our `users` table is always up-to-date.

### 3. Core Logic Flows

#### **Sending a Message**
1. User types in `MessageInput.tsx` and hits Enter.
2. The `messages:send` mutation is called.
3. Convex validates the user session and inserts a new document in the `messages` table.
4. Convex automatically pushes the new message to all clients subscribed to that conversation via `useQuery(api.messages.list)`.

#### **Typing Indicators**
- Uses a "heartbeat" pattern in the `typing` module.
- Each keystroke sends a "typing" status with a 2-second timeout.
- Other users in the chat query for active typing statuses where `lastSeen > Date.now() - 2000`.

---

## 🗺️ Codebase Map

| File/Folder | Role & Purpose |
| :--- | :--- |
| `convex/schema.ts` | **Database Blueprint**: Defines tables for users, conversations, and messages. |
| `convex/users.ts` | **Identity Management**: Handles user profile sync and search logic. |
| `src/app/chat/[id]/page.tsx` | **Conversation Engine**: The main dynamic route for active chats. |
| `src/components/chat/MessageList.tsx` | **Virtual Scrolling**: Efficiently renders message history using real-time hooks. |
| `src/middleware.ts` | **Security Gate**: Protects routes using Clerk authentication. |
| `src/lib/formatters.ts` | **UX Polish**: Smart date/time formatting for messages. |

---

## 📜 License

MIT License - feel free to use this for your own projects!
