"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ReduxProvider from "@/components/ReduxProvider";

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session?.user?.id) {
      router.push("/signin");
      return;
    }

    // Check if user is admin by fetching from API
    fetch('/api/admin/check-role')
      .then(res => {
        if (!res.ok) {
          router.push("/");
        }
      })
      .catch(() => {
        router.push("/");
      });
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ReduxProvider>
  );
}
