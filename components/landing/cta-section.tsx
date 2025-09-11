import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Launch Your SaaS?</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of developers who have successfully built and launched their SaaS applications with our starter
          kit.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/auth/sign-up">
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
          >
            <Link href="https://github.com" target="_blank">
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
