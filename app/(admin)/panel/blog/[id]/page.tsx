import { notFound } from "next/navigation";
import { PageHeader } from "@/components/panel/page-header";
import { BlogForm } from "@/components/panel/blog-form";
import { updateBlogPost } from "@/lib/actions-blog";
import { getPostForPanel } from "@/lib/blog";

export const metadata = { title: "Yazı düzenle — Blog Paneli" };

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) notFound();

  const post = await getPostForPanel(numId);
  if (!post) notFound();

  const boundAction = updateBlogPost.bind(null, numId);

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Yazıyı düzenle" description={post.titleTr} backHref="/panel/blog" />
      <BlogForm post={post} action={boundAction} mode="edit" />
    </div>
  );
}
