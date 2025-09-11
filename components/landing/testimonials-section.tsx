import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, TechStart",
      avatar: "/professional-woman-diverse.png",
      content:
        "SaaS Starter saved us months of development time. The authentication and billing systems work flawlessly out of the box.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "CTO, InnovateLab",
      avatar: "/professional-man.png",
      content:
        "The code quality is exceptional. Clean, well-documented, and follows all the best practices. Highly recommended!",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      role: "Lead Developer, StartupCo",
      avatar: "/professional-woman-developer.png",
      content:
        "Finally, a SaaS boilerplate that actually works as advertised. The admin panel and analytics are incredibly useful.",
      rating: 5,
    },
    {
      name: "David Kim",
      role: "Product Manager, GrowthTech",
      avatar: "/professional-asian-man.png",
      content:
        "We launched our MVP in just 2 weeks using this starter kit. The Stripe integration made billing setup a breeze.",
      rating: 5,
    },
    {
      name: "Lisa Thompson",
      role: "Entrepreneur",
      avatar: "/professional-woman-entrepreneur.png",
      content:
        "The responsive design and mobile experience are top-notch. Our users love the interface across all devices.",
      rating: 5,
    },
    {
      name: "Alex Morgan",
      role: "Full Stack Developer",
      avatar: "/professional-developer.png",
      content:
        "Best investment for any SaaS project. The security features and database setup are production-ready from day one.",
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Loved by Developers Worldwide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of developers who have successfully launched their SaaS applications with our starter kit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
