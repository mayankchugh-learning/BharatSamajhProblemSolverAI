import { Link, useRoute } from "wouter";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ListTodo,
  Shield,
  HelpCircle,
  BookOpen,
  LogOut,
  User,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrandLogo } from "@/components/BrandLogo";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/use-auth";

function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  const [isActive] = useRoute(href === "/" ? "/" : href);
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={!!isActive}>
        <Link href={href}>
          <Icon className="w-4 h-4" />
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout, isAdmin } = useAuth();

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <Link href="/">
            <BrandLogo size="sm" className="cursor-pointer" />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavLink href="/" icon={LayoutDashboard}>
                  Dashboard
                </NavLink>
                <NavLink href="/tasks" icon={ListTodo}>
                  Tasks
                </NavLink>
                {isAdmin && (
                  <NavLink href="/admin" icon={Shield}>
                    Admin
                  </NavLink>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Support</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavLink href="/help" icon={HelpCircle}>
                  Help
                </NavLink>
                <NavLink href="/resources" icon={BookOpen}>
                  Resources
                </NavLink>
                <NavLink href="/contact" icon={Mail}>
                  Contact
                </NavLink>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-2">
          <div className="flex items-center gap-2 px-2 py-2">
            <Avatar className="w-8 h-8 border border-sidebar-border">
              <AvatarImage src={user?.profileImageUrl || undefined} />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium truncate">{user?.firstName || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 group-data-[collapsible=icon]:justify-center">
            <FeedbackDialog />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => logout()}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 sm:gap-4 border-b bg-background/95 px-3 sm:px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
          </div>
        </header>
        <div className="flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
