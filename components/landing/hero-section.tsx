import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Shield, Rocket } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6">
            <Zap className="h-3 w-3 mr-1" />
            Launch your SaaS in days, not months
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 text-balance">
            The Complete{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              SaaS Starter Kit
            </span>{" "}
            for Next.js
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-pretty">
            Skip the boilerplate and focus on what matters. Get authentication, billing, admin panels, and more out of
            the box with our production-ready SaaS template.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/sign-up">
                Start Building Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="#features">View Features</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-300">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-300">
              <Rocket className="h-5 w-5 text-blue-500" />
              <span>Deploy in Minutes</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-300">
              <Zap className="h-5 w-5 text-purple-500" />
              <span>Production Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
