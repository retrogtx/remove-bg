"use client"

import * as React from "react"
import { ToastActionElement, ToastProps } from "@/components/ui/toast"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toastState = React.createContext<{
  toasts: ToasterToast[]
  addToast: (toast: Omit<ToasterToast, "id">) => void
  removeToast: (id: string) => void
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([])

  const addToast = React.useCallback((toast: Omit<ToasterToast, "id">) => {
    setToasts((current) => [...current, { ...toast, id: genId() }])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  return (
    <toastState.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </toastState.Provider>
  )
}

export function useToast() {
  const { toasts, addToast, removeToast } = React.useContext(toastState)

  return {
    toasts,
    toast: (props: Omit<ToasterToast, "id">) => addToast(props),
    dismiss: (toastId: string) => removeToast(toastId),
  }
} 