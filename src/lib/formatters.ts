import { format, isToday, isThisYear } from "date-fns";

/**
 * Format a timestamp for display in message bubbles:
 * - Today → "2:34 PM"
 * - This year → "Feb 15, 2:34 PM"
 * - Older → "Feb 15 2023, 2:34 PM"
 */
export function formatMessageTime(timestamp: number): string {
    const date = new Date(timestamp);
    if (isToday(date)) {
        return format(date, "h:mm a");
    } else if (isThisYear(date)) {
        return format(date, "MMM d, h:mm a");
    } else {
        return format(date, "MMM d yyyy, h:mm a");
    }
}

/**
 * Format a timestamp for conversation sidebar previews
 * - Today → "2:34 PM"
 * - This year → "Feb 15"
 * - Older → "2/15/23"
 */
export function formatConversationTime(timestamp: number): string {
    const date = new Date(timestamp);
    if (isToday(date)) {
        return format(date, "h:mm a");
    } else if (isThisYear(date)) {
        return format(date, "MMM d");
    } else {
        return format(date, "M/d/yy");
    }
}

/** Truncate text to a max length with ellipsis */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + "...";
}
