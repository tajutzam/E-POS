import {
    LayoutDashboard,
    Users,
    Tags,
    Package,
    ShoppingCart,
    History,
    Settings,
    Database,
    ChevronRight,
    Store
} from "lucide-react"
import { NavLink } from "react-router"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="py-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Store className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
                        <span className="font-semibold leading-none">POS System</span>
                        <span className="text-xs text-muted-foreground mt-1">v1.0.0</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="Dashboard">
                                <NavLink to="/">
                                    <LayoutDashboard />
                                    <span>Dashboard</span>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Transactions</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="Cashier">
                                <NavLink to="/cashier">
                                    <ShoppingCart />
                                    <span>Cashier</span>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="History">
                                <NavLink to="/history">
                                    <History />
                                    <span>History Transactions</span>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Master Data</SidebarGroupLabel>
                    <SidebarMenu>
                        <Collapsible asChild className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip="Data">
                                        <Database />
                                        <span>Data</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton asChild>
                                                <NavLink to="/data/users">
                                                    <Users className="size-4" />
                                                    <span>Data User</span>
                                                </NavLink>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton asChild>
                                                <NavLink to="/data/categories">
                                                    <Tags className="size-4" />
                                                    <span>Data Category</span>
                                                </NavLink>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton asChild>
                                                <NavLink to="/data/products">
                                                    <Package className="size-4" />
                                                    <span>Data Products</span>
                                                </NavLink>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                </SidebarGroup>



                <SidebarGroup className="mt-auto">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="Settings">
                                <NavLink to="/settings">
                                    <Settings />
                                    <span>Settings</span>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}