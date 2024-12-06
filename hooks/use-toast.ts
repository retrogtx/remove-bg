"use client"

import * as React from "react"

const TOAST_REMOVE_DELAY = 1000000

type ToastActionElement = React.ReactElement<{
  altText: string
}>

type ToastProps = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

interface State {
  toasts: ToastProps[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string, dispatch: (value: { type: "REMOVE_TOAST", toastId: string }) => void) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export function useToast() {
  const [state, setState] = React.useState<State>({
    toasts: [],
  })

  const dispatch = React.useCallback((action: { type: "REMOVE_TOAST", toastId: string }) => {
    if (action.type === "REMOVE_TOAST") {
      setState((state) => ({
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }))
    }
  }, [])

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.id && !toastTimeouts.has(toast.id)) {
        addToRemoveQueue(toast.id, dispatch)
      }
    })
  }, [state.toasts, dispatch])

  return {
    toasts: state.toasts,
    toast: (props: Omit<ToastProps, "id">) => {
      const id = genId()
      setState((state) => ({
        ...state,
        toasts: [...state.toasts, { ...props, id }],
      }))
      return id
    },
    dismiss: (toastId?: string) => {
      setState((state) => ({
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === toastId || toastId === undefined
            ? {
                ...toast,
                open: false,
              }
            : toast
        ),
      }))
    },
  }
}

export type { ToastProps }
