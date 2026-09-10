import { auth } from "@/auth";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export default async function AdminSettingsPage() {
  const session = await auth();

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold text-soft-black">Settings</h1>
      <p className="mt-1 text-sm text-soft-black/50">
        Signed in as {session?.user?.email}.
      </p>

      <div className="mt-8 rounded-lg border border-soft-black/10 bg-white p-5">
        <h2 className="text-sm font-semibold text-soft-black">
          Change Password
        </h2>
        <p className="mt-1 text-xs text-soft-black/50">
          Use a password only you know — this account has full access to
          orders, customers, and store settings.
        </p>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
