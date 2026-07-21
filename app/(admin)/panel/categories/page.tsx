import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, CornerDownRight, FolderPlus } from "lucide-react";
import { getAllCategoriesFlat } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/panel/page-header";
import { DeleteCategoryButton } from "./delete-button";

export default async function CategoriesListPage() {
  const rows = await getAllCategoriesFlat();

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Kategoriler"
        description={`Toplam ${rows.length} kategori (kök hariç)`}
        actions={
          <Link href="/panel/categories/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Yeni kategori
            </Button>
          </Link>
        }
      />

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-slate-500 mb-4">Henüz kategori yok.</p>
            <Link href="/panel/categories/new">
              <Button>İlk kategoriyi ekle</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[64px_1fr_120px_120px_180px] gap-4 px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div></div>
            <div>Ad</div>
            <div>Sıra</div>
            <div>Ürünler</div>
            <div className="text-right">İşlem</div>
          </div>
          {rows.map((c) => {
            const productCount = c.products.length;
            const childCount = c.children.length;
            return (
              <div
                key={c.id}
                className="grid grid-cols-[64px_1fr_120px_120px_180px] gap-4 px-5 py-3 border-b border-slate-100 last:border-b-0 items-center hover:bg-slate-50/60 transition"
              >
                <div className="w-12 h-12 rounded-md bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt=""
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </div>
                <div className="min-w-0 flex items-center gap-2" style={{ paddingLeft: `${c.depth * 20}px` }}>
                  {c.depth > 0 && <CornerDownRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  <div className="min-w-0">
                    <div className="font-medium text-slate-900 truncate">{c.name.tr}</div>
                    <div className="text-xs text-slate-500 truncate">
                      /{c.slug}
                      {childCount > 0 && (
                        <span className="ml-2 text-slate-400">• {childCount} alt kategori</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-600">{c.sortOrder}</div>
                <div>
                  <Badge variant="secondary">{productCount}</Badge>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/panel/categories/new?parent=${c.id}`} title="Bunun altına yeni kategori">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-slate-500">
                      <FolderPlus className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  <Link href={`/panel/categories/${c.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Pencil className="w-3.5 h-3.5" />
                      Düzenle
                    </Button>
                  </Link>
                  <DeleteCategoryButton id={c.id} name={c.name.tr} productCount={productCount + childCount} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
