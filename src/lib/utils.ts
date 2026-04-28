import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInDays, startOfDay } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

export type EventStatus = "Upcoming" | "Due" | "Past";

export function getEventStatus(dateString: string | null): EventStatus {
  if (!dateString) return "Upcoming";
  
  const eventDate = new Date(dateString);
  const today = startOfDay(new Date());
  const eventDay = startOfDay(eventDate);
  
  const diffDays = differenceInDays(eventDay, today);
  
  if (diffDays < 0) {
    return "Past";
  } else if (diffDays >= 0 && diffDays <= 7) {
    return "Due";
  } else {
    return "Upcoming";
  }
}
