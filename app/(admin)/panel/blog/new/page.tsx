import { PageHeader } from "@/components/panel/page-header";
import { BlogForm } from "@/components/panel/blog-form";
import { createBlogPost } from "@/lib/actions-blog";

export const metadata = { title: "Yeni yazı — Blog Paneli" };

export default function NewBlogPostPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Yeni yazı" backHref="/panel/blog" />
      <BlogForm action={createBlogPost} mode="create" />
    </div>
  );
}
