import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ContactFormData } from "@/components/contact/contact-form";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sendEmail(data: ContactFormData) {
  // TODO: send email
  console.log(data);
}
