import { auth } from "@/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { MobileSidebarToggle } from "@/components/admin/MobileSidebarToggle";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-3 border-b border-soft-black/10 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <MobileSidebarToggle />
            <span className="text-sm font-medium">OtherSide Admin</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="hidden text-xs text-soft-black/50 sm:inline">
              {session?.user?.email}
            </span>
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
