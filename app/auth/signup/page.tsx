"use client"

import { useState } from "react"
import { signUp } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, AlertCircle, CheckCircle, Mail, Shield, Globe, Star, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")
    setSuccess("")

    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.message || "Account created successfully!")
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-border animate-fade-in">
            <CardHeader className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-foreground">O'SMS</span>
                  <Badge variant="secondary" className="text-xs">
                    Business
                  </Badge>
                </div>
              </div>

              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-10 w-10 text-white" />
              </div>

              <div className="space-y-2">
                <CardTitle className="text-2xl text-foreground">Check Your Email</CardTitle>
                <CardDescription className="text-muted-foreground">
                  We've sent a verification link to your email address
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-green-400 font-medium text-sm">Account Created Successfully</p>
                    <p className="text-green-400/80 text-sm">{success}</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h4 className="font-semibold text-primary mb-3">Next Steps:</h4>
                <ol className="text-primary/80 text-sm space-y-2 list-decimal list-inside">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the verification link in the email</li>
                  <li>Choose your business plan and complete setup</li>
                  <li>Start sending professional SMS messages</li>
                </ol>
              </div>

              <div className="text-center pt-4 border-t border-border">
                <p className="text-muted-foreground text-sm mb-4">Didn't receive the email?</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  Resend Verification Email
                </Button>
              </div>

              <div className="text-center">
                <Link href="/auth/login" className="text-primary hover:text-primary/80 text-sm font-medium">
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-foreground">O'SMS</span>
                <Badge variant="secondary" className="text-xs">
                  Business
                </Badge>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-muted-foreground text-sm">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>200+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-12rem)]">
          {/* Left Side - Marketing */}
          <div className="space-y-8 animate-slide-in">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Professional SMS Platform for
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  {" "}
                  Business
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join 10,000+ businesses using O'SMS for reliable, secure, and scalable SMS communications worldwide.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "99.9%", label: "Uptime SLA", color: "text-blue-400" },
                { value: "200+", label: "Countries", color: "text-green-400" },
                { value: "24/7", label: "Support", color: "text-purple-400" },
                { value: "10K+", label: "Businesses", color: "text-yellow-400" },
              ].map((stat, index) => (
                <div key={index} className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border">
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {["SOC 2 Type II Compliant", "256-bit End-to-End Encryption", "GDPR & CCPA Compliant"].map(
                (feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ),
              )}
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-gradient-to-r from-primary to-purple-500 rounded-full border-2 border-background"
                  />
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">Trusted by industry leaders</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full max-w-md mx-auto animate-fade-in">
            <Card className="shadow-2xl border-border">
              <CardHeader className="text-center space-y-6">
                <div className="space-y-2">
                  <CardTitle className="text-2xl text-foreground">Create Business Account</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Start your professional SMS journey today
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <form action={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-fade-in">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                        <p className="text-destructive text-sm">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-foreground font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        className="h-12"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground font-medium">
                        Business Phone *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className="h-12"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-medium">
                        Business Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="h-12"
                        placeholder="you@company.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground font-medium">
                        Password *
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        className="h-12"
                        placeholder="Minimum 6 characters"
                      />
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="text-primary">
                        <p className="font-medium mb-1">Enterprise Security</p>
                        <ul className="space-y-1 text-xs text-primary/80">
                          <li>• SOC 2 Type II compliance</li>
                          <li>• 256-bit encryption</li>
                          <li>• GDPR & CCPA compliant</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base font-medium" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Business Account"
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
