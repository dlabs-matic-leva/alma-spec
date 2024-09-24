import type {Metadata} from "next";
import "@/app/globals.css";
import {SidebarLayout} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { cookies } = await import("next/headers")
  return (
      <>
      <SidebarLayout
          defaultOpen={cookies().get("sidebar:state")?.value === "true"}
      >
        <AppSidebar />
        <main className="flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
          <div className="h-full rounded-md border-2 border-dashed p-2">
            {children}
          </div>
        </main>
      </SidebarLayout>
      </>
  );
}
