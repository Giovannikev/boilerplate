import React from "react"
import { Outlet } from "react-router-dom"
import { SiteHeader } from "@/components/dashboard/site-header"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  children?: React.ReactNode
}

function DashboardLayoutComponent({ children }: DashboardLayoutProps) {

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" collapsible="icon" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <main className="flex-1 p-2">{children || <Outlet />}</main>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export const DashboardLayout = React.memo(DashboardLayoutComponent)
