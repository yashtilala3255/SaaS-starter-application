"use client"

import { LogoutButton } from "@/components/auth/logout-button"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { User, Settings, BarChart3, Users, Shield } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface AdminNavProps {
  user: SupabaseUser
}

export function AdminNav({ user }: AdminNavProps) {
  const initials = user.email
    ?.split("@")[0]
    .split(".")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <nav className="border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-500" />
              Admin Panel
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Users
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Back to App
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt={user.email || ""} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">Administrator</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <LogoutButton variant="ghost" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
