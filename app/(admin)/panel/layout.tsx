import { requireSession } from "@/lib/auth";
import { PanelSidebar } from "@/components/panel/sidebar";
import { PanelTopbar } from "@/components/panel/topbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata = { title: "Panel — CNR Seal" };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireSession();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <PanelSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PanelTopbar />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
