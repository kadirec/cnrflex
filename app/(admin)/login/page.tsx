import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Giriş — CNR Seal Panel" };

export default async function LoginPage() {
  const session = await getSession();
  if (session.userId) redirect("/panel");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src="/logo.png"
            alt="CNR Seal"
            width={1000}
            height={339}
            priority
            className="mx-auto h-12 w-auto mb-3"
          />
          <p className="text-sm text-slate-600">Yönetim Paneli</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-xl font-semibold text-slate-900 mb-1">Giriş yapın</h1>
          <p className="text-sm text-slate-500 mb-6">Yönetim paneline erişim için kimlik bilgilerinizi girin.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
