"use client"

import { Card , CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { ModeToggle } from "@/components/dark-mode/mode-toggle"
import { useTranslation } from "react-i18next"

export default function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <Card className="text-start">
        <CardHeader>
          <CardTitle>{t('settings.appearanceTitle')}</CardTitle>
          <CardDescription>{t('settings.appearanceDescription')}</CardDescription>
          <CardAction>
            <ModeToggle />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  )
}
