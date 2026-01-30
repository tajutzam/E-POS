import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/Header"
import { Outlet } from "react-router"

export function DashboardLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 overflow-y-auto">
                <Header />
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    )
}