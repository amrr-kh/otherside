import { auth } from "@/auth";
import { Sidebar } from "@/components/admin/Sidebar";
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
        <header className="flex h-16 items-center justify-between border-b border-soft-black/10 px-8">
          <span className="text-sm font-medium">OtherSide Admin</span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-soft-black/50">
              {session?.user?.email}
            </span>
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
