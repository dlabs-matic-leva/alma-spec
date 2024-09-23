"use client"

import {
  ArrowLeftRight,
  Atom,
  CirclePercent,
  CreditCard,
  Frame,
  HandCoins,
  HousePlus,
  Landmark,
  LifeBuoy,
  Map,
  PieChart,
  PiggyBank,
  ReceiptText,
  Send,
  Users,
  WalletCards,
} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {NavSecondary} from "@/components/nav-secondary"
import {NavUser} from "@/components/nav-user"
import {TeamSwitcher} from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel, useSidebar,
} from "@/components/ui/sidebar"
import {useEffect} from "react";

const data = {
  teams: [
    {
      name: "Alma Back office",
      logo: Atom,
      plan: "Enterprise",
    },
  ],
  user: {
    name: "Alma Team",
    email: "can-we-get-10k@dlabs.si",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Clients",
      url: "#",
      icon: Users,
      isActive: true,
    },
    {
      title: "Bank accounts",
      url: "#",
      icon: PiggyBank,
    },
    {
      title: "Treasury",
      url: "#",
      icon: Landmark,
    },
    {
      title: "Transactions",
      url: "#",
      icon: ReceiptText,
    },
    {
      title: "FX",
      url: "#",
      icon: ArrowLeftRight,
    },
    {
      title: "Credit cards",
      url: "#",
      icon: CreditCard,
    },
    {
      title: "Virtual cards",
      url: "#",
      icon: WalletCards,
    },
    {
      title: "Investments",
      url: "#",
      icon: CirclePercent,
    },
    {
      title: "Short term loans",
      url: "#",
      icon: HandCoins,
    },
    {
      title: "Mortgages",
      url: "#",
      icon: HousePlus,
    },
  ],

  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
  searchResults: [
    {
      title: "Routing Fundamentals",
      teaser:
        "The skeleton of every application is routing. This page will introduce you to the fundamental concepts of routing for the web and how to handle routing in Next.js.",
      url: "#",
    },
    {
      title: "Layouts and Templates",
      teaser:
        "The special files layout.js and template.js allow you to create UI that is shared between routes. This page will guide you through how and when to use these special files.",
      url: "#",
    },
    {
      title: "Data Fetching, Caching, and Revalidating",
      teaser:
        "Data fetching is a core part of any application. This page goes through how you can fetch, cache, and revalidate data in React and Next.js.",
      url: "#",
    },
    {
      title: "Server and Client Composition Patterns",
      teaser:
        "When building React applications, you will need to consider what parts of your application should be rendered on the server or the client. ",
      url: "#",
    },
    {
      title: "Server Actions and Mutations",
      teaser:
        "Server Actions are asynchronous functions that are executed on the server. They can be used in Server and Client Components to handle form submissions and data mutations in Next.js applications.",
      url: "#",
    },
  ],
}

export function AppSidebar() {
  const { open, onOpenChange } = useSidebar()
  useEffect(() => {
    if(!open)
        onOpenChange(true)
  }, []);
  return (
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem>
          <NavMain items={data.navMain} searchResults={data.searchResults} />
        </SidebarItem>
        <SidebarItem className="mt-auto">
          <SidebarLabel>Help</SidebarLabel>
          <NavSecondary items={data.navSecondary} />
        </SidebarItem>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
