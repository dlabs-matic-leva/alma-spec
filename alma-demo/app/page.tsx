import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarLayout,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function Page() {
  const { cookies } = await import("next/headers")
  return "hi"
}
