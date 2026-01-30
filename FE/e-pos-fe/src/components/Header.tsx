import { LogOut, Settings, User } from 'lucide-react'
import { SidebarTrigger } from './ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export function Header() {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <div className="h-4 w-px bg-border mx-2" />
                <span className="text-sm font-medium">E POS</span>
            </div>

            {/* Kanan: User Profile */}
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="outline-none">
                            <Avatar className="h-8 w-8 rounded-lg border shadow-sm transition-all hover:ring-2 hover:ring-primary/20">
                                <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                                <AvatarFallback className="rounded-lg bg-primary/10 text-primary">AD</AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56 mt-2 shadow-lg">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1 py-1">
                                <p className="text-sm font-semibold leading-none">Administrator</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    admin@example.com
                                </p>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 size-4 opacity-70" />
                            <span>Profile</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 size-4 opacity-70" />
                            <span>Settings</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <LogOut className="mr-2 size-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

export default Header