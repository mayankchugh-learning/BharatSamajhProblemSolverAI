import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  FileQuestion,
  CreditCard,
  MessageSquare,
  Shield,
  ShieldOff,
  ArrowLeft,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Link } from "wouter";
import { useDocumentHead } from "@/hooks/use-document-head";
import { useAdminAuth } from "@/hooks/use-admin-auth";

interface AdminStats {
  users: number;
  problems: number;
  trial: number;
  active: number;
  expired: number;
  feedback: number;
}

interface UserWithProfile {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profile: {
    subscriptionStatus: string;
    accessStatus: string;
    referralCode: string;
    trialStartDate: string;
  } | null;
}

async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch("/api/v1/admin/stats", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

async function fetchAdminUsers(): Promise<UserWithProfile[]> {
  const res = await fetch("/api/v1/admin/users", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

async function updateUserAccess(userId: string, accessStatus: "active" | "suspended") {
  const res = await fetch(`/api/v1/admin/users/${userId}/access`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessStatus }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update access");
  return res.json();
}

function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoggingIn } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ username: username.trim(), password });
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <CardTitle>Admin Login</CardTitle>
              <p className="text-sm text-muted-foreground">Enter your admin credentials</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="admin-username">Username</Label>
              <Input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin username"
                required
                autoComplete="username"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="current-password"
                className="mt-1"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? "Signing in..." : "Sign in"}
            </Button>
            <div className="text-center">
              <Link href="/">
                <Button type="button" variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to app
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Admin() {
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: authLoading } = useAdminAuth();

  useDocumentHead({
    title: "Admin",
    description: "Application statistics and user access control",
    canonicalPath: "/admin",
    noIndex: true,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/v1/admin/stats"],
    queryFn: fetchAdminStats,
    enabled: isAdmin,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/v1/admin/users"],
    queryFn: fetchAdminUsers,
    enabled: isAdmin,
  });

  const accessMutation = useMutation({
    mutationFn: ({ userId, accessStatus }: { userId: string; accessStatus: "active" | "suspended" }) =>
      updateUserAccess(userId, accessStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/admin/users"] });
    },
  });

  const { logout } = useAdminAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <div className="absolute top-4 right-4 flex gap-2">
          <ThemeToggle />
          <BrandLogo />
        </div>
        <AdminLoginForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/v1/admin/me"] })} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              <LogOut className="w-4 h-4 mr-2" />
              Admin Logout
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Application stats and user access control</p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
          {statsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">—</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 rounded bg-muted animate-pulse" />
                </CardContent>
              </Card>
            ))
          ) : stats ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Users</CardTitle>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.users}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Problems</CardTitle>
                  <FileQuestion className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.problems}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Trial</CardTitle>
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.trial}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active</CardTitle>
                  <CreditCard className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.active}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Expired</CardTitle>
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.expired}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Feedback</CardTitle>
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.feedback}</div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>

        {/* Users table */}
        <Card>
          <CardHeader>
            <CardTitle>Users & Access Control</CardTitle>
            <p className="text-sm text-muted-foreground">Suspend or activate user accounts</p>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                Loading users...
              </div>
            ) : users && users.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => {
                    const profile = u.profile;
                    const isSuspended = profile?.accessStatus === "suspended";
                    return (
                      <TableRow key={u.id}>
                        <TableCell>
                          {u.firstName || u.lastName
                            ? [u.firstName, u.lastName].filter(Boolean).join(" ")
                            : "—"}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{u.email ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant={isSuspended ? "destructive" : "default"}>
                            {isSuspended ? "Suspended" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{profile?.subscriptionStatus ?? "—"}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={isSuspended ? "default" : "destructive"}
                            size="sm"
                            disabled={accessMutation.isPending}
                            onClick={() =>
                              accessMutation.mutate({
                                userId: u.id,
                                accessStatus: isSuspended ? "active" : "suspended",
                              })
                            }
                          >
                            {isSuspended ? (
                              <>
                                <Shield className="w-4 h-4 mr-1" />
                                Activate
                              </>
                            ) : (
                              <>
                                <ShieldOff className="w-4 h-4 mr-1" />
                                Suspend
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">No users yet</div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
