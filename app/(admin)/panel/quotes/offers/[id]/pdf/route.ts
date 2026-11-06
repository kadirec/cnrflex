import { readFile } from "node:fs/promises";
import path from "node:path";
import { createElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import sharp from "sharp";
import { getSession } from "@/lib/auth";
import { getOffer } from "@/lib/offers";
import { getSiteSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";
import { slugify } from "@/lib/slug";
import { OfferDocument, type OfferPdfImages } from "@/lib/pdf/offer-document";

export const runtime = "nodejs";

/** react-pdf yalnızca PNG/JPG okuyabildiği için görselleri küçük PNG'ye çeviriyoruz. */
async function loadImage(url: string | null | undefined): Promise<Buffer | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const input = Buffer.from(await res.arrayBuffer());
    return await sharp(input)
      .resize(240, 200, { fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .png()
      .toBuffer();
  } catch {
    return null;
  }
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.userId) return new Response("Yetkisiz", { status: 401 });

  const { id: idRaw } = await ctx.params;
  const id = Number(idRaw);
  if (!Number.isInteger(id)) return new Response("Bulunamadı", { status: 404 });

  const offer = await getOffer(id);
  if (!offer) return new Response("Bulunamadı", { status: 404 });

  const [settings, logo, imageList] = await Promise.all([
    getSiteSettings(),
    readFile(path.join(process.cwd(), "public/logo-white.png")).catch(() => null),
    Promise.all((offer.items ?? []).map((it) => loadImage(it.image))),
  ]);

  const images: OfferPdfImages = Object.fromEntries(imageList.map((b, i) => [i, b]));
  const website = siteConfig.url.replace(/^https?:\/\//, "");

  const element = createElement(OfferDocument, {
    offer,
    images,
    company: {
      logo,
      address: settings.addressTr,
      email: settings.contactEmail,
      phone: settings.contactPhone,
      website: `www.${website.replace(/^www\./, "")}`,
    },
  }) as unknown as React.ReactElement<DocumentProps>;

  const pdf = await renderToBuffer(element);

  const filename = `${slugify(offer.customerName).toUpperCase().replace(/-/g, "_") || "TEKLIF"}_TEKLIF_${offer.offerDate
    .split("-")
    .reverse()
    .join(".")}.pdf`;

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
