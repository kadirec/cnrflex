import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
        <div className="font-display text-7xl lg:text-8xl font-bold text-accent-500">404</div>
        <h1 className="mt-6 text-3xl lg:text-4xl font-bold text-brand-950">Sayfa Bulunamadı / Page Not Found</h1>
        <p className="mt-4 text-lg text-brand-700">
          Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
          <br />
          The page you are looking for may have been moved or never existed.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/tr" className="rounded-md bg-accent-500 hover:bg-accent-600 px-6 py-3 text-base font-semibold text-white transition">
            Ana Sayfa
          </Link>
          <Link href="/en" className="rounded-md bg-brand-100 hover:bg-brand-200 px-6 py-3 text-base font-semibold text-brand-900 transition">
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
