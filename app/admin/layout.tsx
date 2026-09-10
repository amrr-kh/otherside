export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-warm-white font-sans text-soft-black">
      {children}
    </div>
  );
}
