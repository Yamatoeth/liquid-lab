import React from 'react'

export default function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
      {message}
    </div>
  )
}
import { XCircle } from 'lucide-react'

const ErrorAlert = ({ message }: { message?: string }) => {
  if (!message) return null
  return (
    <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive flex items-start gap-2">
      <XCircle className="h-4 w-4 text-destructive" />
      <div>{message}</div>
    </div>
  )
}

export default ErrorAlert
