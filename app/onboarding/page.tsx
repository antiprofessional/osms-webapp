"use client"

import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/auth-actions"
import { createPayment } from "@/lib/payment-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  Check,
  Star,
  Shield,
  Globe,
  Zap,
  BarChart3,
  Headphones,
  ArrowRight,
  Crown,
  Building2,
  Loader2,
} from "lucide-react"
import { QRGenerator } from "@/components/qr-generator"
import { redirect } from "next/navigation"
import type { User, Payment } from "@/lib/supabase"

const pricingPlans = [
  {
    id: "professional",
    name: "Professional",
    description: "Perfect for growing businesses with higher volume",
    price: 149,
    credits: 10000,
    popular: true,
    icon: Building2,
    features: [
      "10,000 SMS credits",
      "200+ countries coverage",
      "Advanced sender ID spoofing",
      "Priority support",
      "Advanced analytics & reporting",
      "API access with webhooks",
      "Delivery confirmations",
      "Bulk messaging tools",
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "For established businesses with high volume needs",
    price: 299,
    credits: 25000,
    popular: false,
    icon: Zap,
    features: [
      "25,000 SMS credits",
      "Global coverage (200+ countries)",
      "Premium sender ID management",
      "Priority support with SLA",
      "Advanced analytics suite",
      "Custom API integrations",
      "Delivery confirmations",
      "Bulk messaging tools",
      "Custom compliance features",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with custom needs",
    price: 599,
    credits: 50000,
    popular: false,
    icon: Crown,
    features: [
      "50,000 SMS credits",
      "Global coverage (200+ countries)",
      "Premium sender ID management",
      "24/7 dedicated support",
      "Enterprise analytics suite",
      "Custom API integrations",
      "SLA guarantees",
      "White-label options",
      "Custom compliance features",
      "Dedicated account manager",
    ],
  },
]

const trustIndicators = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II compliant with 256-bit encryption",
    color: "text-blue-400",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Deliver messages to 200+ countries worldwide",
    color: "text-green-400",
  },
  {
    icon: BarChart3,
    title: "99.9% Uptime",
    description: "Guaranteed service level agreement",
    color: "text-purple-400",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated business support team",
    color: "text-yellow-400",
  },
]

export default function OnboardingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [selectedPlan, setSelectedPlan] = useState("professional")
  const [selectedCrypto, setSelectedCrypto] = useState("BTC")
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const userData = await getCurrentUser()
      if (!userData) {
        redirect("/auth/login")
      } else if (!userData.email_verified) {
        redirect("/auth/verify-email")
      } else {
        setUser(userData)
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const handleCreatePayment = async () => {
    if (!selectedPlan) return

    setPaymentLoading(true)
    const result = await createPayment(selectedPlan, selectedCrypto)

    if (result.success && result.payment) {
      setCurrentPayment(result.payment)
    }

    setPaymentLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-3 text-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (currentPayment) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
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
          </div>
        </header>

        {/* Payment Content */}
        <main className="container mx-auto px-6 py-12">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Complete Your Payment</h1>
            <p className="text-xl text-muted-foreground">Secure cryptocurrency payment processing</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Payment Details */}
            <Card className="shadow-2xl border-border">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Payment Details</CardTitle>
                  <Badge className="bg-orange-600/20 text-orange-400">30 min remaining</Badge>
                </div>
                <CardDescription className="text-base">
                  Send exactly {currentPayment.crypto_amount.toFixed(8)} {currentPayment.crypto_currency}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex justify-center">
                  <QRGenerator value={currentPayment.payment_address} size={240} />
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Payment Address</label>
                    <div className="p-4 bg-input rounded-lg border border-border font-mono text-sm break-all text-foreground">
                      {currentPayment.payment_address}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Amount</label>
                      <div className="p-4 bg-input rounded-lg border border-border font-mono text-sm text-foreground">
                        {currentPayment.crypto_amount.toFixed(8)} {currentPayment.crypto_currency}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">USD Value</label>
                      <div className="p-4 bg-input rounded-lg border border-border font-mono text-sm text-foreground">
                        ${currentPayment.usd_amount}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                  <h4 className="font-semibold text-destructive mb-3">⚠️ Important Payment Instructions</h4>
                  <ul className="text-destructive/80 text-sm space-y-2">
                    <li>
                      • Send EXACTLY {currentPayment.crypto_amount.toFixed(8)} {currentPayment.crypto_currency}
                    </li>
                    <li>• Payment expires in 30 minutes</li>
                    <li>• Credits added automatically after confirmation</li>
                    <li>• Do not send from exchange wallets</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="shadow-2xl border-border">
              <CardHeader className="space-y-4">
                <CardTitle className="text-xl">Order Summary</CardTitle>
                <CardDescription className="text-base">Your selected business plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {pricingPlans.find((p) => p.id === selectedPlan)?.name} Plan
                    </h3>
                    <Badge className="bg-primary/20 text-primary">Selected</Badge>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {pricingPlans.find((p) => p.id === selectedPlan)?.description}
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SMS Credits:</span>
                      <span className="font-medium text-foreground">{currentPayment.credits.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan Price:</span>
                      <span className="font-medium text-foreground">${currentPayment.usd_amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="font-medium text-foreground">{currentPayment.crypto_currency}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-6">
                  <h4 className="font-semibold text-green-400 mb-3">✅ What happens next?</h4>
                  <ul className="text-green-400/80 text-sm space-y-2">
                    <li>• Payment confirmed automatically</li>
                    <li>• Credits added to your account</li>
                    <li>• Access to full platform features</li>
                    <li>• Welcome email with getting started guide</li>
                  </ul>
                </div>

                <Button onClick={() => setCurrentPayment(null)} variant="outline" className="w-full h-12">
                  Cancel Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
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
            <div className="text-muted-foreground text-sm">Welcome, {user?.full_name}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16 space-y-8 animate-fade-in">
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto">
            <Check className="h-12 w-12 text-white" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-foreground">Welcome to O'SMS Business!</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your account has been verified successfully. Choose your business plan to start sending professional SMS
              messages worldwide.
            </p>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-16">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Choose Your Business Plan</h2>
            <p className="text-xl text-muted-foreground">Flexible pricing for businesses of all sizes</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12 max-w-7xl mx-auto">
            {pricingPlans.map((plan) => {
              const IconComponent = plan.icon
              return (
                <Card
                  key={plan.id}
                  className={`relative shadow-2xl border-border cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedPlan === plan.id ? "ring-2 ring-primary shadow-primary/25" : ""
                  } ${plan.popular ? "ring-2 ring-yellow-400 shadow-yellow-400/25" : ""}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-yellow-400 text-black font-semibold px-4 py-2">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center space-y-6 pb-4">
                    <div className="flex items-center justify-center">
                      <IconComponent className={`h-12 w-12 ${plan.popular ? "text-yellow-400" : "text-primary"}`} />
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                    </div>
                    <div className="space-y-2">
                      <div className="text-5xl font-bold text-foreground">${plan.price}</div>
                      <div className="text-muted-foreground">/month</div>
                      <div className="text-sm text-muted-foreground">
                        {plan.credits.toLocaleString()} SMS credits included
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-green-400" />
                          </div>
                          <span className="text-muted-foreground text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Crypto Selection */}
          <Card className="shadow-2xl border-border mb-12 max-w-4xl mx-auto">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-2xl">Select Payment Method</CardTitle>
              <CardDescription className="text-lg">Secure cryptocurrency payments processed instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <TabsList className="grid w-full grid-cols-6 h-14">
                  {["BTC", "ETH", "USDT", "LTC", "XMR", "SOL"].map((crypto) => (
                    <TabsTrigger
                      key={crypto}
                      value={crypto}
                      className="text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {crypto}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="text-center space-y-6">
            <Button
              onClick={handleCreatePayment}
              disabled={paymentLoading}
              className="px-12 py-6 text-lg font-semibold"
              size="lg"
            >
              {paymentLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
            <p className="text-muted-foreground">Secure payment • 256-bit encryption • Instant activation</p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {trustIndicators.map((indicator, index) => {
            const IconComponent = indicator.icon
            return (
              <div key={index} className="text-center space-y-4">
                <div className="w-20 h-20 bg-card/50 rounded-full flex items-center justify-center mx-auto">
                  <IconComponent className={`h-10 w-10 ${indicator.color}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-foreground font-semibold text-lg">{indicator.title}</h3>
                  <p className="text-muted-foreground text-sm">{indicator.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
