import { getCurrentUser } from "@/lib/auth-actions"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const user = await getCurrentUser()

  if (user) {
    if (user.credits > 0) {
      redirect("/dashboard")
    } else {
      redirect("/onboarding")
    }
  } else {
    redirect("/auth/login")
  }
}
