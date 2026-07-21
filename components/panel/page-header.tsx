import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  backHref?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, description, backHref, actions }: Props) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 mb-1.5"
          >
            <ChevronLeft className="w-3 h-3" />
            Geri
          </Link>
        )}
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
