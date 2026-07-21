import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions-auth";

export function PanelTopbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="text-sm text-slate-500">
          <span className="hidden sm:inline">Yönetim Paneli</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="text-sm text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-slate-100"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Siteyi görüntüle
        </Link>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="sm" className="gap-1.5">
            <LogOut className="w-4 h-4" />
            Çıkış
          </Button>
        </form>
      </div>
    </header>
  );
}
