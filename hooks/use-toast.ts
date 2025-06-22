// hooks/use-toast.ts

import { create } from "zustand"
import type { ToastActionElement } from "@/components/ui/toast"

type ToastProps = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
}

const actionTypes = ["success", "info", "warning", "error"] as const

type ToastActionType = (typeof actionTypes)[number]

type ToastState = {
  toasts: ToasterToast[]
  addToast: (toast: ToastProps) => void
  dismiss: (id: string) => void
}

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({ toasts: [...state.toasts, { ...toast }] })),
  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))