"use client"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function SectionCards() {

  return (
    <div className="mx-auto space-y-2 text-start">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Devise</span>
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardDescription><Skeleton className="h-4 w-32" /></CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums tracking-tight @[250px]/card:text-3xl">
                <Skeleton className="h-7 w-24" />
              </CardTitle>
              <Skeleton className="h-6 w-20" />
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <Skeleton className="h-4 w-40" />
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 @xl/main:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardDescription><Skeleton className="h-4 w-32" /></CardDescription>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm [.border-t]:pt-0">
              <Skeleton className="h-60 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 @xl/main:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription><Skeleton className="h-4 w-32" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription><Skeleton className="h-4 w-32" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border px-3 py-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-20" />
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="mt-1 h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
          <CardFooter className="justify-end">
            <Skeleton className="h-8 w-20" />
          </CardFooter>
        </Card>
      </div>

      <div className="text-center py-8 text-muted-foreground">
        Voici la page de dashboard
      </div>
    </div>
  )
}
