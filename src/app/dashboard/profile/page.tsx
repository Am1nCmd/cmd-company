import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  const is2FAActive = session.user?.twoFactorEnabled;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Link
          href="/dashboard/settings"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Settings 2FA
        </Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-black mb-4">Informasi Akun</h2>
        <div className="space-y-4">
          <p className="text-black">
            <strong>Nama:</strong> {session?.user?.name}
          </p>
          <p className="text-black">
            <strong>Email:</strong> {session?.user?.email}
          </p>
          <p className="flex items-center gap-2 text-black">
            <strong>Status 2FA:</strong>
            {is2FAActive ? (
              <button className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                Aktif
              </button>
            ) : (
              <button className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                Tidak aktif
              </button>
            )}
          </p>
          <div className="flex justify-center pt-4">
            <div className="bg-red-500 hover:bg-red-600 text-black px-6 py-2 rounded-md shadow-md transition duration-200">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
