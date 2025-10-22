"use client";

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LayoutDashboard, Package, Users, Calendar, Tag, AlertCircle, TrendingUp, ShoppingBag, UserCheck, Plus, Edit2, Trash2, DollarSign, Shield } from 'lucide-react';
import { ListingStatus, BookingStatus, Role } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CardDescription } from '@/components/ui/card';

interface Listing {
  id: string;
  title: string;
  status: ListingStatus;
  owner: { name: string | null; email: string | null };
  createdAt: string;
}

type AdminCategory = { id: string; name: string };

interface Metrics {
  activeListings: number;
  totalUsers: number;
  bookings: Record<string, number>;
  disputes: number;
}

interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
  createdAt: string;
}

interface AdminBooking {
  id: string;
  status: BookingStatus;
  totalAmount: number;
  depositHeld: number;
  createdAt: string;
  listing: { id: string; title: string; ownerId: string };
  borrower: { id: string; name: string | null; email: string | null };
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isMetricsLoading, setIsMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetch('/api/admin/listings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch listings or you are not an admin.');
        return res.json();
      })
      .then(data => {
        setListings(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch metrics or you are not an admin.');
        return res.json();
      })
      .then(data => {
        setMetrics(data);
        setIsMetricsLoading(false);
      })
      .catch(err => {
        setMetricsError(err.message);
        setIsMetricsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => { if (!res.ok) throw new Error('Failed to fetch users'); return res.json(); })
      .then(data => { setUsers(data); setUsersLoading(false); })
      .catch(err => { setUsersError(err.message); setUsersLoading(false); });
  }, []);

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then(res => { if (!res.ok) throw new Error('Failed to fetch bookings'); return res.json(); })
      .then(data => { setBookings(data); setBookingsLoading(false); })
      .catch(err => { setBookingsError(err.message); setBookingsLoading(false); });
  }, []);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => { if (!res.ok) throw new Error('Failed to fetch categories'); return res.json(); })
      .then(data => { setCategories(data); setCategoriesLoading(false); })
      .catch(err => { setCategoriesError(err.message); setCategoriesLoading(false); });
  }, []);

  const handleStatusChange = async (listingId: string, status: ListingStatus) => {
    const originalListings = [...listings];
    setListings(listings.map(l => l.id === listingId ? { ...l, status: 'UPDATING' as any } : l));

    try {
      const response = await fetch(`/api/admin/listings/${listingId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedListing = await response.json();
      setListings(listings.map(l => l.id === listingId ? updatedListing : l));
    } catch (err) {
      setListings(originalListings);
      toast({ title: "Error", description: "Failed to update listing status.", variant: "destructive" });
    }
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    try {
      const res = await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      if (!res.ok) throw new Error('Failed to create category');
      const created = await res.json();
      setCategories([...categories, created].sort((a,b) => a.name.localeCompare(b.name)));
      setNewCategoryName("");
      toast({ title: "Success", description: "Category created successfully." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to create category.", variant: "destructive" });
    }
  };

  const handleRenameCategory = async (cat: AdminCategory) => {
    const name = prompt('New category name', cat.name)?.trim();
    if (!name || name === cat.name) return;
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      if (!res.ok) throw new Error('Failed to rename category');
      const updated = await res.json();
      setCategories(categories.map(c => c.id === cat.id ? updated : c).sort((a,b) => a.name.localeCompare(b.name)));
      toast({ title: "Success", description: "Category renamed successfully." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to rename category.", variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (cat: AdminCategory) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete category');
      setCategories(categories.filter(c => c.id !== cat.id));
      toast({ title: "Success", description: "Category deleted successfully." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete category.", variant: "destructive" });
    }
  };

  const handleUserRoleChange = async (userId: string, role: Role) => {
    const original = [...users];
    setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role })
      });
      if (!res.ok) throw new Error('Failed to update user role');
      const updated = await res.json();
      setUsers(users.map(u => u.id === userId ? updated : u));
      toast({ title: "Success", description: "User role updated successfully." });
    } catch (e) {
      setUsers(original);
      toast({ title: "Error", description: "Failed to update user role.", variant: "destructive" });
    }
  };

  const handleBookingStatusChange = async (bookingId: string, status: BookingStatus) => {
    const original = [...bookings];
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status } : b));
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update booking status');
      const updated = await res.json();
      setBookings(bookings.map(b => b.id === bookingId ? updated : b));
      toast({ title: "Success", description: "Booking status updated successfully." });
    } catch (e) {
      setBookings(original);
      toast({ title: "Error", description: "Failed to update booking status.", variant: "destructive" });
    }
  };

  const handleRefund = async (booking: AdminBooking) => {
    const input = prompt('Enter refund amount (leave blank for full):', '');
    let amount: number | undefined = undefined;
    if (input && !Number.isNaN(Number(input))) amount = Number(input);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/refund`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount })
      });
      if (!res.ok) throw new Error('Refund failed');
      const data = await res.json();
      toast({ title: "Success", description: `Refund successful: ₹${data.amount/100}` });
    } catch (e) {
      toast({ title: "Error", description: "Refund failed.", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      ACTIVE: "default",
      APPROVED: "default",
      CONFIRMED: "default",
      PENDING: "secondary",
      REJECTED: "destructive",
      FLAGGED: "destructive",
      DISPUTE: "destructive",
      CANCELLED: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const activeTab = useAppSelector((state) => state.admin.activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {isMetricsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : metricsError ? (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <p>Error: {metricsError}</p>
                  </div>
                </CardContent>
              </Card>
            ) : metrics ? (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{metrics.activeListings}</div>
                      <p className="text-xs text-muted-foreground mt-1">Currently available</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{metrics.totalUsers}</div>
                      <p className="text-xs text-muted-foreground mt-1">Registered members</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{Object.values(metrics.bookings).reduce((a, b) => a + b, 0)}</div>
                      <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Disputes</CardTitle>
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{metrics.disputes}</div>
                      <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
                    </CardContent>
                  </Card>
                </div>
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Booking Status Breakdown</CardTitle>
                    <CardDescription>Overview of all booking statuses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {Object.entries(metrics.bookings).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between rounded-lg border p-3">
                          <span className="text-sm font-medium">{k}</span>
                          <Badge variant="secondary">{v}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>
        );
      case 'categories':
        return (
          <div className="space-y-6">
            {categoriesLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : categoriesError ? (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <p>Error: {categoriesError}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Category Management</CardTitle>
                  <CardDescription>Create and manage listing categories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-2">
                    <Input className="flex-1" placeholder="New category name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                    <Button onClick={handleCreateCategory} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Category
                    </Button>
                  </div>
                  <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map(cat => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleRenameCategory(cat)} className="gap-1">
                          <Edit2 className="h-3 w-3" />
                          Rename
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(cat)} className="gap-1">
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        );
      case 'listings':
        return (
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : error ? (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <p>Error: {error}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Listings Management</CardTitle>
                  <CardDescription>Moderate and manage all listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map(listing => (
                  <TableRow key={listing.id}>
                    <TableCell className="font-medium">{listing.title}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{listing.owner.name}</div>
                        <div className="text-muted-foreground">{listing.owner.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(listing.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Select value={listing.status} onValueChange={(value) => handleStatusChange(listing.id, value as ListingStatus)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(ListingStatus).map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>)
                )}
              </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        );
      case 'users':
        return (
          <div className="space-y-6">
            {usersLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : usersError ? (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <p>Error: {usersError}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user roles and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email ?? '—'}</TableCell>
                    <TableCell>
                      <Select value={u.role} onValueChange={(value) => handleUserRoleChange(u.id, value as Role)}>
                        <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.values(Role).map(r => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        );
      case 'bookings':
        return (
          <div className="space-y-6">
            {bookingsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : bookingsError ? (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <p>Error: {bookingsError}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Bookings Management</CardTitle>
                  <CardDescription>Manage bookings and process refunds</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Listing</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Deposit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map(b => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.listing.title}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{b.borrower.name ?? '—'}</div>
                        <div className="text-muted-foreground">{b.borrower.email ?? '—'}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">₹{b.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground">₹{b.depositHeld.toFixed(2)}</TableCell>
                    <TableCell>
                      <Select value={b.status} onValueChange={(value) => handleBookingStatusChange(b.id, value as BookingStatus)}>
                        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.values(BookingStatus).map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleRefund(b)} className="gap-1">
                        <DollarSign className="h-3 w-3" />
                        Refund
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your platform</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {renderContent()}
      </div>
    </div>
  );
}
