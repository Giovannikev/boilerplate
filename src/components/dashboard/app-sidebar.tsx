"use client";

import React from "react";
import { LayoutDashboard, Settings, User, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "react-i18next";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

const COMPANY_CONFIG = {
  name: "Boilerplate",
  logo: "/logo.svg",
} as const;

function AppSidebarComponent({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();

  const navMain: NavItem[] = [
    {
      title: t("common.dashboard"),
      url: ROUTES.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      title: t("common.settings"),
      url: ROUTES.DASHBOARD_SETTINGS,
      icon: Settings,
    },
    {
      title: t("common.profile"),
      url: ROUTES.DASHBOARD_PROFILE,
      icon: User,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to={ROUTES.DASHBOARD}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <img
                    src={COMPANY_CONFIG.logo}
                    alt="Logo"
                    className="size-5"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-base">
                    {COMPANY_CONFIG.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {t("common.welcome")}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

export const AppSidebar = React.memo(AppSidebarComponent);
