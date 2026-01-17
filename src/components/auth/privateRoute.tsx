"use client"

import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Spinner } from "@/components/ui/spinner"
import { ROUTES } from "@/constants/routes"

interface PrivateRouteProps {
  children: ReactNode
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" aria-busy>
        <Spinner className="size-8 text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={ROUTES.SIGNIN} replace />
  }

  return <>{children}</>
}
