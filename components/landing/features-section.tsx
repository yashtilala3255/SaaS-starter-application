import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, CreditCard, Shield, BarChart3, Settings, Zap, Database, Mail, Smartphone } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: User,
      title: "Authentication System",
      description: "Complete user authentication with email/password, social login, and secure session management.",
    },
    {
      icon: CreditCard,
      title: "Stripe Integration",
      description: "Ready-to-use billing system with subscription management, invoicing, and payment processing.",
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Built with security best practices including RLS, CSRF protection, and data encryption.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive admin panel with user analytics, usage tracking, and business insights.",
    },
    {
      icon: Database,
      title: "Database Ready",
      description: "Pre-configured Supabase integration with optimized schemas and real-time capabilities.",
    },
    {
      icon: Mail,
      title: "Email System",
      description: "Transactional emails for user onboarding, notifications, and marketing campaigns.",
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Fully responsive design that works perfectly on desktop, tablet, and mobile devices.",
    },
    {
      icon: Settings,
      title: "Admin Panel",
      description: "Powerful admin interface for user management, content moderation, and system configuration.",
    },
    {
      icon: Zap,
      title: "Performance Optimized",
      description: "Built with Next.js 15, optimized for speed with SSR, caching, and modern web standards.",
    },
  ]

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Launch
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our SaaS starter kit includes all the essential features you need to build and scale your application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
