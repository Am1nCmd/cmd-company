import Header from "@/components/header";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return (
    <>
      <Header user={session?.user} />
      <main className="container mx-auto px-4 py-4">{children}</main>
    </>
  );
}
