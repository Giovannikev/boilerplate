import React from 'react'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { LanguageSwitcher } from '@/components/i18n/language-switcher'
import { useTranslation } from 'react-i18next'

function SiteHeaderComponent() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const routeTitleMap: Record<string, string> = {
    [ROUTES.DASHBOARD_SETTINGS]: t('common.settings'),
    [ROUTES.DASHBOARD_PROFILE]: t('common.profile'),
  }

  const title = Object.entries(routeTitleMap).find(([route]) =>
    pathname.startsWith(route),
  )?.[1] ?? t('common.dashboard')

  return (
    <header className="sticky top-0 backdrop-blur-md rounded-t-md z-20 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}

export const SiteHeader = React.memo(SiteHeaderComponent)
