"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Currency = "EUR" | "MGA"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  format: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("EUR")

  const format = (amount: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount)

  return <CurrencyContext.Provider value={{ currency, setCurrency, format }}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider")
  }
  return context
}
