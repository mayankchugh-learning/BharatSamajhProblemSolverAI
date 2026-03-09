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
  Globe,
  TrendingUp,
  MapPin,
  FileText,
  Mail,
  Reply,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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

interface TrafficStats {
  total: number;
  byDay: { date: string; count: number }[];
  topPages: { path: string; count: number }[];
  byCountry: { country: string; count: number }[];
  recentVisits: { path: string; country: string | null; region: string | null; city: string | null; createdAt: string }[];
}

async function fetchTrafficStats(days: number): Promise<TrafficStats> {
  const res = await fetch(`/api/v1/admin/traffic?days=${days}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch traffic");
  return res.json();
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

interface ContactRequest {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  adminResponse: string | null;
  respondedAt: string | null;
  createdAt: string;
}

async function fetchContactRequests(): Promise<ContactRequest[]> {
  const res = await fetch("/api/v1/admin/contact-requests", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch contact requests");
  return res.json();
}

async function respondToContactRequest(id: number, adminResponse: string) {
  const res = await fetch(`/api/v1/admin/contact-requests/${id}/respond`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminResponse }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to send response");
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

  const [trafficDays, setTrafficDays] = useState(30);
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/v1/admin/users"],
    queryFn: fetchAdminUsers,
    enabled: isAdmin,
  });

  const { data: traffic, isLoading: trafficLoading } = useQuery({
    queryKey: ["/api/v1/admin/traffic", trafficDays],
    queryFn: () => fetchTrafficStats(trafficDays),
    enabled: isAdmin,
  });

  const { data: contactRequests, isLoading: contactLoading } = useQuery({
    queryKey: ["/api/v1/admin/contact-requests"],
    queryFn: fetchContactRequests,
    enabled: isAdmin,
  });

  const [respondDialog, setRespondDialog] = useState<ContactRequest | null>(null);
  const [responseText, setResponseText] = useState("");
  const respondMutation = useMutation({
    mutationFn: ({ id, adminResponse }: { id: number; adminResponse: string }) =>
      respondToContactRequest(id, adminResponse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/admin/contact-requests"] });
      setRespondDialog(null);
      setResponseText("");
    },
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

        {/* Contact Requests */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Requests
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              View and respond to user inquiries from the Contact Us form
            </p>
          </CardHeader>
          <CardContent>
            {contactLoading ? (
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                Loading...
              </div>
            ) : (contactRequests ?? []).length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(contactRequests ?? []).map((cr) => (
                    <TableRow key={cr.id}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(cr.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{cr.name}</TableCell>
                      <TableCell className="font-mono text-sm">{cr.email}</TableCell>
                      <TableCell className="max-w-[180px] truncate">{cr.subject}</TableCell>
                      <TableCell>
                        <Badge variant={cr.status === "responded" ? "default" : "secondary"}>
                          {cr.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRespondDialog(cr);
                            setResponseText(cr.adminResponse ?? "");
                          }}
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          {cr.status === "responded" ? "View / Edit" : "Respond"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No contact requests yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Respond dialog */}
        <Dialog open={!!respondDialog} onOpenChange={(open) => !open && setRespondDialog(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {respondDialog?.name} — {respondDialog?.subject}
              </DialogTitle>
            </DialogHeader>
            {respondDialog && (
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-mono text-sm">{respondDialog.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Message</Label>
                  <p className="text-sm mt-1 p-3 rounded-md bg-muted whitespace-pre-wrap">
                    {respondDialog.message}
                  </p>
                </div>
                <div>
                  <Label htmlFor="admin-response">Your response</Label>
                  <Textarea
                    id="admin-response"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your response here. The user will receive it via email."
                    rows={5}
                    className="mt-1 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setRespondDialog(null)}>
                    Cancel
                  </Button>
                  <Button
                    disabled={responseText.trim().length < 5 || respondMutation.isPending}
                    onClick={() =>
                      respondMutation.mutate({ id: respondDialog.id, adminResponse: responseText.trim() })
                    }
                  >
                    {respondMutation.isPending ? "Sending..." : "Send response (email user)"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Traffic / Analytics */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Website Traffic
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Page views and visitor analytics. Location works when deployed (Vercel, Cloudflare, etc.) or accessed via public IP. Localhost shows Unknown.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="traffic-days" className="text-sm text-muted-foreground">Period</Label>
                <select
                  id="traffic-days"
                  value={trafficDays}
                  onChange={(e) => setTrafficDays(Number(e.target.value))}
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {trafficLoading ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                Loading traffic...
              </div>
            ) : traffic ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 rounded-lg border px-4 py-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{(traffic.total ?? 0).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total page views</p>
                    </div>
                  </div>
                </div>

                {(traffic.byCountry ?? []).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Traffic by location
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Country</TableHead>
                          <TableHead className="text-right">Views</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(traffic.byCountry ?? []).map((c) => (
                          <TableRow key={c.country}>
                            <TableCell>{c.country}</TableCell>
                            <TableCell className="text-right">{c.count.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {(traffic.topPages ?? []).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Top pages
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Path</TableHead>
                          <TableHead className="text-right">Views</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {traffic.topPages.map((p) => (
                          <TableRow key={p.path}>
                            <TableCell className="font-mono text-sm">{p.path || "/"}</TableCell>
                            <TableCell className="text-right">{p.count.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {(traffic.recentVisits ?? []).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent page views (path + location)</h4>
                    <div className="max-h-64 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Path</TableHead>
                            <TableHead>Location</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(traffic.recentVisits ?? []).map((v, i) => (
                            <TableRow key={`${v.path}-${v.createdAt}-${i}`}>
                              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                {new Date(v.createdAt).toLocaleString()}
                              </TableCell>
                              <TableCell className="font-mono text-sm">{v.path}</TableCell>
                              <TableCell className="text-sm">
                                {[v.city, v.region, v.country].filter(Boolean).join(", ") || "—"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {traffic.byDay.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Views by day</h4>
                    <div className="max-h-64 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[...(traffic.byDay ?? [])].reverse().map((d) => (
                            <TableRow key={d.date}>
                              <TableCell>{d.date}</TableCell>
                              <TableCell className="text-right">{d.count.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {(traffic.total ?? 0) === 0 && (
                  <p className="text-muted-foreground text-sm">No traffic data for this period yet.</p>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
