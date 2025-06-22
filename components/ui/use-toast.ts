"use client"

import * as React from "react"
// CORRECTED: Import the 'create' function from the zustand library
import { create } from "zustand"
import { type ToastActionElement } from "@/components/ui/toast"

type ToastProps = {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const TOAST_LIMIT = 1

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
}

type ToastState = {
  toasts: ToasterToast[]
  toast: (props: ToastProps) => {
    id: string
    dismiss: () => void
  }
  dismiss: (toastId?: string) => void
}

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  toast: (props) => {
    const id = crypto.randomUUID()
    const newToast = { id, ...props }

    set((state) => ({
      toasts: [newToast, ...state.toasts.slice(0, TOAST_LIMIT - 1)],
    }))

    return {
      id: id,
      dismiss: () => get().dismiss(id),
    }
  },
  dismiss: (toastId) => {
    if (toastId) {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }))
    } else {
      set({ toasts: [] })
    }
  },
}))
