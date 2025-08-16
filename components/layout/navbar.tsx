"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Transaction Check" },
    { href: "/pending-alerts", label: "Pending Alerts" },
    { href: "/model-accuracy", label: "Model Accuracy" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">FraudShield</span>
        </div>
        <nav className="flex flex-1 items-center space-x-1 sm:space-x-2">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant={pathname === item.href ? "default" : "ghost"} size="sm">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  )
}

