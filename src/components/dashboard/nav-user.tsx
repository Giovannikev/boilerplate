"use client"

import {
  LogOut,
  MoreVertical,
  UserCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { signOut } from "@/services/auth"
import { ROUTES } from "@/constants/routes"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function NavUser() {
  const { t } = useTranslation()
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { user } = useAuth()

  const displayName =
    (user?.user_metadata as Record<string, unknown>)?.full_name as string || user?.email || ""
  const displayEmail = user?.email || ""
  const displayAvatar =
    ((user?.user_metadata as Record<string, unknown>)?.avatar_url as string) || ""
  const initials = (displayName || displayEmail).slice(0, 2).toUpperCase()

  const handleSignOut = async () => {
    try {
      const { error } = await signOut()
      if (error) throw error
      navigate(ROUTES.SIGNIN)
    } catch {
      toast.error(t('common.logout_error'))
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={displayAvatar} alt={displayName} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="text-muted-foreground truncate text-xs">{displayEmail}</span>
              </div>
              <MoreVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={displayAvatar} alt={displayName} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="text-muted-foreground truncate text-xs">{displayEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate(ROUTES.DASHBOARD_PROFILE)}>
                <UserCircle className="mr-2 size-4" />
                {t('common.profile')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 size-4" />
              {t('common.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
