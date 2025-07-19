"use client"

import { useState, useEffect } from "react"
import {
  MessageSquare,
  Send,
  Inbox,
  UserX,
  CreditCard,
  Settings,
  LayoutDashboard,
  Globe,
  Copy,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  Timer,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { QRGenerator } from "./qr-generator"
import { sendSMS } from "@/lib/sms-actions"
import { createPayment, checkPaymentStatus } from "@/lib/payment-actions"
import { signOut } from "@/lib/auth-actions"
import type { User, Payment } from "@/lib/supabase"

const countries = [
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+91", name: "India", flag: "🇮🇳" },
]

const pricingPackages = [
  { id: "professional", credits: 10000, price: 149.0, popular: true },
  { id: "business", credits: 25000, price: 299.0, popular: false },
  { id: "enterprise", credits: 50000, price: 599.0, popular: false },
]

interface OSMSPlatformProps {
  user: User
}

export default function OSMSPlatform({ user: initialUser }: OSMSPlatformProps) {
  const [activeView, setActiveView] = useState("send-sms")
  const [user, setUser] = useState(initialUser)
  const [phoneNumbers, setPhoneNumbers] = useState([""])
  const [selectedCountry, setSelectedCountry] = useState("+1")
  const [spoofedSender, setSpoofedSender] = useState("")
  const [message, setMessage] = useState("")
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [selectedCrypto, setSelectedCrypto] = useState("BTC")
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null)
  const [paymentTimer, setPaymentTimer] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [smsResult, setSmsResult] = useState<{ success?: boolean; error?: string; message?: string } | null>(null)

  const menuItems = [
    { id: "send-sms", label: "Send SMS", icon: Send },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inbox", label: "Inbox", icon: Inbox },
    { id: "spoof-sender", label: "Spoof Sender ID", icon: UserX },
    { id: "crypto-payments", label: "Buy Credits", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  // Timer for payment expiration
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (currentPayment && paymentTimer > 0) {
      interval = setInterval(() => {
        setPaymentTimer((prev) => {
          if (prev <= 1) {
            setCurrentPayment(null)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [currentPayment, paymentTimer])

  // Check payment status periodically
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (currentPayment && currentPayment.status === "pending") {
      interval = setInterval(async () => {
        const result = await checkPaymentStatus(currentPayment.id)
        if (result.success && result.status === "confirmed") {
          setUser((prev) => ({ ...prev, credits: prev.credits + currentPayment.credits }))
          setCurrentPayment(null)
          setPaymentTimer(0)
        }
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [currentPayment])

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, ""])
  }

  const removePhoneNumber = (index: number) => {
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index))
  }

  const updatePhoneNumber = (index: number, value: string) => {
    const updated = [...phoneNumbers]
    updated[index] = value
    setPhoneNumbers(updated)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSendSMS = async (formData: FormData) => {
    setLoading(true)
    setSmsResult(null)

    const result = await sendSMS(formData)
    setSmsResult(result)

    if (result.success) {
      const recipientCount = phoneNumbers.filter((num) => num.trim()).length
      setUser((prev) => ({ ...prev, credits: prev.credits - recipientCount }))
      setPhoneNumbers([""])
      setSpoofedSender("")
      setMessage("")
    }

    setLoading(false)
  }

  const handleCreatePayment = async () => {
    if (!selectedPackage) return

    setLoading(true)
    const result = await createPayment(selectedPackage, selectedCrypto)

    if (result.success && result.payment) {
      setCurrentPayment(result.payment)
      setPaymentTimer(30 * 60)
    }

    setLoading(false)
  }

  const renderSendSMS = () => {
    const totalRecipients = phoneNumbers.filter((num) => num.trim() !== "").length
    const hasEnoughCredits = user.credits >= totalRecipients

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-foreground">Send SMS</h2>
          <p className="text-xl text-muted-foreground">Send messages globally with custom sender IDs</p>
        </div>

        {user.credits === 0 && (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-destructive font-medium text-lg">No SMS Credits Available</p>
                  <p className="text-destructive/80">You need to purchase credits before sending messages</p>
                </div>
                <Button
                  onClick={() => setActiveView("crypto-payments")}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Buy Credits
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-xl border-border">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-foreground">Compose Message</CardTitle>
              <div className="text-right space-y-1">
                <p className="text-sm text-muted-foreground">Available Credits</p>
                <p className="text-2xl font-bold text-foreground">{user.credits.toLocaleString()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form action={handleSendSMS} className="space-y-6">
              {smsResult && (
                <div
                  className={`flex items-center space-x-3 p-4 rounded-lg animate-fade-in ${
                    smsResult.success
                      ? "bg-green-600/10 border border-green-600/20"
                      : "bg-destructive/10 border border-destructive/20"
                  }`}
                >
                  {smsResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  )}
                  <p className={`text-sm font-medium ${smsResult.success ? "text-green-400" : "text-destructive"}`}>
                    {smsResult.message || smsResult.error}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="countryCode" className="text-foreground font-medium">
                    Country Code
                  </Label>
                  <Select name="countryCode" value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.flag} {country.code} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senderId" className="text-foreground font-medium">
                    Sender ID
                  </Label>
                  <Input
                    name="senderId"
                    placeholder="e.g., BANK-ALERT, DELIVERY"
                    value={spoofedSender}
                    onChange={(e) => setSpoofedSender(e.target.value)}
                    className="h-12"
                    disabled={user.credits === 0}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground font-medium">Phone Numbers</Label>
                  <Button
                    type="button"
                    onClick={addPhoneNumber}
                    size="sm"
                    variant="outline"
                    disabled={user.credits === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Number
                  </Button>
                </div>
                <div className="space-y-3">
                  {phoneNumbers.map((number, index) => (
                    <div key={index} className="flex gap-3">
                      <Input
                        placeholder={`${selectedCountry}1234567890`}
                        value={number}
                        onChange={(e) => updatePhoneNumber(index, e.target.value)}
                        className="h-12"
                        disabled={user.credits === 0}
                      />
                      {phoneNumbers.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removePhoneNumber(index)}
                          size="sm"
                          variant="outline"
                          className="h-12 px-3 border-destructive/20 text-destructive hover:bg-destructive/10"
                          disabled={user.credits === 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <input type="hidden" name="recipients" value={phoneNumbers.filter((num) => num.trim()).join(",")} />
              </div>

              <div className="space-y-4">
                <Label htmlFor="message" className="text-foreground font-medium">
                  Message
                </Label>
                <Textarea
                  name="message"
                  placeholder="Enter your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] resize-none"
                  disabled={user.credits === 0}
                  required
                />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{message.length}/160 characters</span>
                  <span className="text-muted-foreground">
                    Cost: {totalRecipients} credit{totalRecipients !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {!hasEnoughCredits && totalRecipients > 0 && user.credits > 0 && (
                <div className="p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    Insufficient credits. You need {totalRecipients} credits but only have {user.credits}.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium"
                disabled={user.credits === 0 || !hasEnoughCredits || totalRecipients === 0 || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : user.credits === 0 ? (
                  "Purchase Credits to Send"
                ) : !hasEnoughCredits ? (
                  "Insufficient Credits"
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send SMS
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderCryptoPayments = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-foreground">Buy SMS Credits</h2>
        <p className="text-xl text-muted-foreground">Choose a package and pay with cryptocurrency</p>
      </div>

      {!currentPayment && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {pricingPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`shadow-xl border-border cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedPackage === pkg.id ? "ring-2 ring-primary shadow-primary/25" : ""
                } ${pkg.popular ? "ring-2 ring-yellow-400 shadow-yellow-400/25" : ""}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <CardHeader className="text-center space-y-4 pb-4">
                  {pkg.popular && <Badge className="w-fit mx-auto bg-yellow-400 text-black">Most Popular</Badge>}
                  <div className="space-y-2">
                    <CardTitle className="text-3xl text-foreground">${pkg.price}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                      {pkg.credits.toLocaleString()} SMS Credits
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    ${((pkg.price / pkg.credits) * 1000).toFixed(2)} per 1,000 SMS
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedPackage && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="shadow-xl border-border">
                <CardHeader className="space-y-4">
                  <CardTitle className="text-xl">Select Cryptocurrency</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedCrypto} onValueChange={setSelectedCrypto}>
                    <TabsList className="grid w-full grid-cols-6 h-12">
                      {["BTC", "ETH", "USDT", "LTC", "XMR", "SOL"].map((crypto) => (
                        <TabsTrigger
                          key={crypto}
                          value={crypto}
                          className="font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          {crypto}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-border">
                <CardHeader className="space-y-4">
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Package:</span>
                      <span className="text-foreground font-medium">
                        {pricingPackages.find((p) => p.id === selectedPackage)?.credits.toLocaleString()} Credits
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price (USD):</span>
                      <span className="text-foreground font-bold text-lg">
                        ${pricingPackages.find((p) => p.id === selectedPackage)?.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="text-foreground font-medium">{selectedCrypto}</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleCreatePayment}
                    className="w-full h-12 text-base font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Payment...
                      </>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {currentPayment && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="shadow-xl border-border">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Payment Details</CardTitle>
                <div className="flex items-center space-x-2 text-orange-400">
                  <Timer className="h-4 w-4" />
                  <span className="font-mono text-lg">{formatTime(paymentTimer)}</span>
                </div>
              </div>
              <CardDescription className="text-base">
                Send exactly {currentPayment.crypto_amount.toFixed(8)} {currentPayment.crypto_currency}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <QRGenerator value={currentPayment.payment_address} size={200} />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Payment Address</Label>
                  <div className="flex gap-2">
                    <Input value={currentPayment.payment_address} readOnly className="font-mono text-sm" />
                    <Button onClick={() => copyToClipboard(currentPayment.payment_address)} size="sm" variant="outline">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm font-medium mb-2">⚠️ Important:</p>
                <ul className="text-destructive/80 text-sm space-y-1">
                  <li>
                    • Send EXACTLY {currentPayment.crypto_amount.toFixed(8)} {currentPayment.crypto_currency}
                  </li>
                  <li>• Payment expires in {formatTime(paymentTimer)}</li>
                  <li>• Credits will be added automatically after confirmation</li>
                  <li>• Do not send from an exchange wallet</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-border">
            <CardHeader className="space-y-4">
              <CardTitle className="text-xl">Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-foreground font-medium text-lg">Waiting for Payment</p>
                  <p className="text-muted-foreground">Monitoring blockchain for transaction</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="text-foreground font-mono">
                    {currentPayment.crypto_amount.toFixed(8)} {currentPayment.crypto_currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">USD Value:</span>
                  <span className="text-foreground font-medium">${currentPayment.usd_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credits:</span>
                  <span className="text-foreground font-medium">{currentPayment.credits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400">
                    {currentPayment.status}
                  </Badge>
                </div>
              </div>

              <Button onClick={() => setCurrentPayment(null)} variant="outline" className="w-full h-12">
                Cancel Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )

  const renderDashboard = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-foreground">Dashboard</h2>
        <p className="text-xl text-muted-foreground">Welcome back, {user.full_name}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-xl border-border">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-lg font-medium text-muted-foreground">SMS Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-2">{user.credits.toLocaleString()}</div>
            <p className="text-sm text-primary">Available to send</p>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-border">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-lg font-medium text-muted-foreground">Messages Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-2">0</div>
            <p className="text-sm text-green-400">This month</p>
          </CardContent>
        </Card>
        <Card className="shadow-xl border-border">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-lg font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-2">--</div>
            <p className="text-sm text-blue-400">Delivery rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeView) {
      case "send-sms":
        return renderSendSMS()
      case "crypto-payments":
        return renderCryptoPayments()
      case "dashboard":
        return renderDashboard()
      default:
        return renderSendSMS()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <Sidebar className="border-border">
          <SidebarHeader className="border-b border-border p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-foreground">O'SMS</span>
                <Badge variant="secondary" className="text-xs">
                  Business
                </Badge>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveView(item.id)}
                        isActive={activeView === item.id}
                        className="w-full justify-start px-3 py-3 text-muted-foreground hover:text-foreground hover:bg-accent data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Credits</span>
              <span className="text-lg font-bold text-foreground">{user.credits.toLocaleString()}</span>
            </div>
            <Button onClick={() => signOut()} variant="outline" size="sm" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-6">
            <SidebarTrigger className="text-foreground hover:bg-accent" />
            <div className="flex items-center space-x-2 ml-auto">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Global SMS Platform</span>
            </div>
          </header>
          <main className="flex-1 p-8">{renderContent()}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
