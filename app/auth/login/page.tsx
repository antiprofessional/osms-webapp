"use client"

import { useState } from "react"
import { signIn, resendVerificationEmail } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, AlertCircle, Mail, Shield, Globe, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showResendEmail, setShowResendEmail] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState("")
  const [email, setEmail] = useState("")

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")
    setShowResendEmail(false)

    const emailValue = formData.get("email") as string
    setEmail(emailValue)

    const result = await signIn(formData)
    if (result?.error) {
      setError(result.error)
      if (result.error.includes("verify your email")) {
        setShowResendEmail(true)
      }
    }

    setLoading(false)
  }

  async function handleResendEmail() {
    if (!email) return

    setResendLoading(true)
    setResendMessage("")

    const result = await resendVerificationEmail(email)
    if (result.success) {
      setResendMessage("Verification email sent! Check your inbox.")
    } else {
      setResendMessage(result.error || "Failed to send email")
    }

    setResendLoading(false)
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
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
          <div className="w-full max-w-md">
            <Card className="shadow-2xl border-border">
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
                <div className="space-y-2">
                  <CardTitle className="text-2xl text-foreground">Welcome Back</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Sign in to your business SMS platform
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

                  {showResendEmail && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 animate-fade-in">
                      <div className="flex items-center space-x-3 mb-3">
                        <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                        <p className="text-primary font-medium text-sm">Email Verification Required</p>
                      </div>
                      <p className="text-primary/80 text-sm mb-3">
                        Please verify your email address to access your account.
                      </p>
                      {resendMessage && (
                        <div
                          className={`text-sm mb-3 ${resendMessage.includes("sent") ? "text-green-400" : "text-destructive"}`}
                        >
                          {resendMessage}
                        </div>
                      )}
                      <Button
                        type="button"
                        onClick={handleResendEmail}
                        disabled={resendLoading}
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        {resendLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Resend Verification Email"
                        )}
                      </Button>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12"
                        placeholder="you@company.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground font-medium">
                        Password
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="h-12"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base font-medium" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In to Business Account"
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-medium">
                      Create business account
                    </Link>
                  </p>
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Shield className="h-3 w-3" />
                      <span>SOC 2 Compliant</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>99.9% Uptime</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
