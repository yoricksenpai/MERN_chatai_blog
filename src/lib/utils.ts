import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function getImageUrl(path: string): string {
  if (path.startsWith("http")) {
    return path // Already a full URL
  }
  return `/uploads/${path}`
}

export function getOptimizedImageUrl(url: string, width = 800): string {
  return `${url}?width=${width}&quality=80&format=webp`
}

// Fonction utilitaire pour obtenir la couleur en fonction du rôle
  export const getRoleColor = (role: string): string => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "author":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }