"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Mail, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

function NavMainComponent({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const activeUrl =
    items
      .map((i) => i.url)
      .filter(
        (url) =>
          location.pathname === url || location.pathname.startsWith(url + "/")
      )
      .sort((a, b) => b.length - a.length)[0] ?? ROUTES.DASHBOARD;
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip={t("common.quickCreate")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              asChild
            >
              <Link to={""}>
                <Plus />
                {t("common.quickCreate")}
              </Link>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <Mail className="size-5" />
              <span className="sr-only">{t("common.inbox")}</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={activeUrl === item.url}
              >
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export const NavMain = React.memo(NavMainComponent);
