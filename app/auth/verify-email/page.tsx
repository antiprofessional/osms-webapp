"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { verifyEmail } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error")
        setMessage("Invalid verification link")
        return
      }

      const result = await verifyEmail(token)
      if (result.success) {
        setStatus("success")
        setMessage(result.message || "Email verified successfully!")
      } else {
        setStatus("error")
        setMessage(result.error || "Verification failed")
      }
    }

    verify()
  }, [token])

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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
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

                <div className="flex justify-center">
                  {status === "loading" && (
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                      <Loader2 className="h-10 w-10 text-primary-foreground animate-spin" />
                    </div>
                  )}
                  {status === "success" && (
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                  )}
                  {status === "error" && (
                    <div className="w-20 h-20 bg-destructive rounded-full flex items-center justify-center">
                      <AlertCircle className="h-10 w-10 text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <CardTitle className="text-2xl text-foreground">
                    {status === "loading" && "Verifying Your Email..."}
                    {status === "success" && "Email Verified Successfully!"}
                    {status === "error" && "Verification Failed"}
                  </CardTitle>

                  <CardDescription className="text-muted-foreground">
                    {status === "loading" && "Please wait while we verify your email address"}
                    {status === "success" && "Your business account is now active and ready to use"}
                    {status === "error" && "There was a problem verifying your email address"}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div
                  className={`p-4 rounded-lg border ${
                    status === "success"
                      ? "bg-green-600/10 border-green-600/20"
                      : status === "error"
                        ? "bg-destructive/10 border-destructive/20"
                        : "bg-primary/10 border-primary/20"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {status === "loading" && <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />}
                    {status === "success" && <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />}
                    {status === "error" && <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />}
                    <p
                      className={`text-sm font-medium ${
                        status === "success"
                          ? "text-green-400"
                          : status === "error"
                            ? "text-destructive"
                            : "text-primary"
                      }`}
                    >
                      {message}
                    </p>
                  </div>
                </div>

                {status === "success" && (
                  <div className="space-y-4">
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <h4 className="font-semibold text-primary mb-3">🎉 What's Next?</h4>
                      <ul className="text-primary/80 text-sm space-y-2">
                        <li>• Choose your business plan and pricing</li>
                        <li>• Complete secure payment setup</li>
                        <li>• Start sending professional SMS messages</li>
                        <li>• Access enterprise features and analytics</li>
                      </ul>
                    </div>

                    <Button asChild className="w-full h-12 text-base font-medium">
                      <Link href="/onboarding">
                        Continue to Plan Selection
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                )}

                {status === "error" && (
                  <div className="space-y-4">
                    <div className="bg-card/50 border border-border rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-3">What you can do:</h4>
                      <ul className="text-muted-foreground text-sm space-y-2">
                        <li>• Check if the verification link has expired (24 hours)</li>
                        <li>• Request a new verification email from the login page</li>
                        <li>• Contact our support team if the problem persists</li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <Button asChild variant="outline" className="h-12 bg-transparent">
                        <Link href="/auth/login">Try Signing In Again</Link>
                      </Button>
                      <Button asChild variant="ghost" className="h-12">
                        <Link href="/auth/signup">Create New Account</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
