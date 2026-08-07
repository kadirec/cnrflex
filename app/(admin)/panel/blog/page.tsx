import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { getAllPostsForPanel, getCategoryLabel } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/panel/page-header";
import { DeleteBlogButton } from "./delete-button";

export const metadata = { title: "Blog — CNR Seal Panel" };

export default async function BlogListPage() {
  const rows = await getAllPostsForPanel();

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Blog"
        description={`Toplam ${rows.length} yazı`}
        actions={
          <Link href="/panel/blog/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Yeni yazı
            </Button>
          </Link>
        }
      />

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-slate-500 mb-4">Henüz blog yazısı yok.</p>
            <Link href="/panel/blog/new">
              <Button>İlk yazıyı ekle</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[80px_1fr_180px_120px_180px] gap-4 px-5 py-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div></div>
            <div>Başlık</div>
            <div>Kategori</div>
            <div>Durum</div>
            <div className="text-right">İşlem</div>
          </div>
          {rows.map((post) => {
            const published = post.publishedAt && new Date(post.publishedAt) <= new Date();
            return (
              <div
                key={post.id}
                className="grid grid-cols-[80px_1fr_180px_120px_180px] gap-4 px-5 py-3 border-b border-slate-100 last:border-b-0 items-center hover:bg-slate-50/60 transition"
              >
                <div className="w-16 h-12 rounded-md bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {post.coverImageUrl ? (
                    <Image
                      src={post.coverImageUrl}
                      alt=""
                      width={64}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-slate-900 truncate">{post.titleTr}</div>
                  <div className="text-xs text-slate-500 truncate">/{post.slug}</div>
                </div>
                <div className="text-sm text-slate-600">{getCategoryLabel(post.category, "tr")}</div>
                <div>
                  {published ? (
                    <Badge>Yayında</Badge>
                  ) : (
                    <Badge variant="secondary">Taslak</Badge>
                  )}
                </div>
                <div className="flex items-center justify-end gap-1">
                  {published && (
                    <a
                      href={`/tr/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 px-2 py-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <Link href={`/panel/blog/${post.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Pencil className="w-3.5 h-3.5" />
                      Düzenle
                    </Button>
                  </Link>
                  <DeleteBlogButton id={post.id} title={post.titleTr} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
