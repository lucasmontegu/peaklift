import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { JSONValue, Message } from "ai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isValidMessageData = (rawData: JSONValue | undefined) => {
  if (!rawData || typeof rawData !== "object") return false;
  if (Object.keys(rawData).length === 0) return false;
  return true;
};

export const insertDataIntoMessages = (
  messages: Message[],
  data: JSONValue[] | undefined,
) => {
  if (!data) return messages;
  messages.forEach((message, i) => {
    const rawData = data[i];
    if (isValidMessageData(rawData)) message.data = rawData;
  });
  return messages;
};
