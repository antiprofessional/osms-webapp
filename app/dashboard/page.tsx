import { getCurrentUser } from "@/lib/auth-actions"
import { redirect } from "next/navigation"
import OSMSPlatform from "@/components/osms-platform"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  if (!user.email_verified) {
    redirect("/auth/verify-email")
  }

  if (user.credits === 0) {
    redirect("/onboarding")
  }

  return <OSMSPlatform user={user} />
}
