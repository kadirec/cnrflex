import "server-only";

import path from "node:path";
import { Document, Font, Image as PdfImage, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Offer } from "@/lib/db";
import {
  cardUnitPrice,
  computeOffer,
  DEFAULT_OFFER_SETTINGS,
  formatMoney,
  formatNumber,
  formatOfferDate,
  formatPercent,
  formatRate,
} from "@/lib/offer-calc";

const FONT_DIR = path.join(process.cwd(), "lib/pdf/fonts");

Font.register({
  family: "Roboto",
  fonts: [
    { src: path.join(FONT_DIR, "Roboto-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONT_DIR, "Roboto-Bold.ttf"), fontWeight: 700 },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const NAVY = "#0f1f3a";
const NAVY_2 = "#16294a";
const LABEL_BG = "#cdd5e1";
const TEAL = "#0f4c5c";
const TEAL_LIGHT = "#d5e6ea";
const BORDER = "#9aa8bc";
const YELLOW = "#ffff00";

const s = StyleSheet.create({
  page: { fontFamily: "Roboto", fontSize: 7, color: "#111", padding: 24 },
  row: { flexDirection: "row" },
  cell: {
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: BORDER,
    paddingHorizontal: 4,
    justifyContent: "center",
  },
  bold: { fontWeight: 700 },
  white: { color: "#fff" },
  center: { textAlign: "center" },
  right: { textAlign: "right" },
});

export type OfferPdfCompany = {
  logo: Buffer | null;
  address: string;
  email: string;
  phone: string;
  website: string;
};

export type OfferPdfImages = Record<number, Buffer | null>;

/** Teklif PDF'i — A4 yatay, örnek teklif formatı. */
export function OfferDocument({
  offer,
  company,
  images,
}: {
  offer: Offer;
  company: OfferPdfCompany;
  images: OfferPdfImages;
}) {
  const st = { ...DEFAULT_OFFER_SETTINGS, ...offer.settings };
  const items = offer.items ?? [];
  const calc = computeOffer(items, st);
  const insts = st.showCard ? st.installments : [];
  const label = st.deferredLabel;
  const LABEL = label.toLocaleUpperCase("tr");
  const notes = (offer.notes ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Ürün tablosu kolon genişlikleri (flex oranları)
  const productCols = [
    { key: "img", title: "ÜRÜN GÖRSELİ", w: 1.1 },
    { key: "code", title: "ÜRÜN KODU", w: 1.4 },
    { key: "name", title: "ÜRÜN ADI / AÇIKLAMA", w: 1.9 },
    { key: "qty", title: "SİPARİŞ METRE", w: 0.9 },
    { key: "pkg", title: "PAKET İÇERİK\nBİLGİSİ (MT)", w: 0.9 },
    { key: "unit", title: "BİRİM FİYATI", w: 0.9 },
    ...insts.map((i) => ({ key: `c${i.count}`, title: `KREDİ KARTI\n${i.count} TAKSİT`, w: 1.15 })),
  ];
  const minRows = Math.max(0, 4 - items.length);

  // Sol / sağ blokların genişliği (sağ blok "SİPARİŞ METRE" kolonuyla hizalı)
  const leftW = productCols.slice(0, 3).reduce((a, c) => a + c.w, 0);
  const rightW = productCols.slice(3).reduce((a, c) => a + c.w, 0);

  const infoRows: [string, string][] = [
    ["TEKLİF TARİHİ", formatOfferDate(offer.offerDate)],
    ["MÜŞTERİ", offer.customerName.toLocaleUpperCase("tr")],
    ["YETKİLİ KİŞİ", (offer.contactPerson ?? "").toLocaleUpperCase("tr")],
    ["TELEFON", offer.phone ?? ""],
    ["ADRES", offer.address ?? ""],
    ["VERGİ DAİRESİ", offer.taxOffice ?? ""],
    ["VERGİ NO", offer.taxNumber ?? ""],
  ];

  return (
    <Document title={`Teklif - ${offer.customerName}`} author="CNR Seal">
      <Page size="A4" orientation="landscape" style={s.page}>
        {/* ÜST BLOK */}
        <View style={[s.row, { marginBottom: 6 }]}>
          <View style={{ flex: leftW, borderTopWidth: 0.5, borderLeftWidth: 0.5, borderColor: BORDER }}>
            {infoRows.map(([k, v]) => (
              <View key={k} style={[s.row, { height: 15 }]}>
                <View style={[s.cell, { width: 80, backgroundColor: NAVY }]}>
                  <Text style={[s.bold, s.white, { fontSize: 6.5 }]}>{k}</Text>
                </View>
                <View style={[s.cell, { flex: 1 }]}>
                  <Text>{v}</Text>
                </View>
              </View>
            ))}
          </View>
          <View
            style={{
              flex: rightW,
              backgroundColor: NAVY,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 18,
            }}
          >
            <View style={{ flex: 1.2, alignItems: "center" }}>
              {company.logo && <PdfImage src={company.logo} style={{ width: 170, height: 71, objectFit: "contain" }} />}
              <Text style={{ color: "#aab4c4", fontSize: 6, letterSpacing: 1.5, marginTop: 4 }}>
                TEKNİK FİTİL VE SIZDIRMAZLIK ÇÖZÜMLERİ
              </Text>
            </View>
            <View style={{ flex: 1, paddingLeft: 14 }}>
              <Text style={[s.white, s.bold, { fontSize: 7, lineHeight: 1.4 }]}>{company.address}</Text>
              <View style={{ borderBottomWidth: 0.5, borderColor: "#5b6a82", marginVertical: 5 }} />
              <Text style={[s.white, s.bold, { fontSize: 7.5, marginBottom: 4 }]}>{company.email}</Text>
              <Text style={[s.white, s.bold, { fontSize: 7.5 }]}>{company.phone}</Text>
              <View style={{ borderBottomWidth: 0.5, borderColor: "#5b6a82", marginVertical: 5 }} />
              <Text style={[s.bold, { color: "#e5e9f0", fontSize: 11 }]}>{company.website}</Text>
            </View>
          </View>
        </View>

        {/* ÜRÜN TABLOSU */}
        <View style={{ borderTopWidth: 0.5, borderLeftWidth: 0.5, borderColor: BORDER, marginBottom: 6 }}>
          <View style={[s.row, { backgroundColor: NAVY }]} fixed>
            {productCols.map((c) => (
              <View key={c.key} style={[s.cell, { flex: c.w, height: 24 }]}>
                <Text style={[s.bold, s.white, s.center, { fontSize: 6.5 }]}>{c.title}</Text>
              </View>
            ))}
          </View>
          {items.map((it, i) => (
            <View key={i} style={[s.row, { minHeight: 50 }]} wrap={false}>
              <View style={[s.cell, { flex: productCols[0].w, alignItems: "center", paddingVertical: 3 }]}>
                {images[i] && <PdfImage src={images[i]!} style={{ width: 54, height: 44, objectFit: "contain" }} />}
              </View>
              <View style={[s.cell, { flex: productCols[1].w }]}>
                <Text style={s.center}>{it.code}</Text>
              </View>
              <View style={[s.cell, { flex: productCols[2].w }]}>
                <Text>{it.name}</Text>
              </View>
              <View style={[s.cell, { flex: productCols[3].w }]}>
                <Text style={s.center}>{formatNumber(it.quantity)}</Text>
              </View>
              <View style={[s.cell, { flex: productCols[4].w }]}>
                <Text style={s.center}>{it.packageSize ? formatNumber(it.packageSize) : ""}</Text>
              </View>
              <View style={[s.cell, { flex: productCols[5].w }]}>
                <Text style={s.center}>{formatMoney(it.unitPrice)}</Text>
              </View>
              {insts.map((inst, j) => (
                <View key={inst.count} style={[s.cell, { flex: productCols[6 + j].w }]}>
                  <Text style={s.center}>{formatMoney(cardUnitPrice(it, inst))}</Text>
                </View>
              ))}
            </View>
          ))}
          {Array.from({ length: minRows }).map((_, i) => (
            <View key={`e${i}`} style={[s.row, { height: 15, backgroundColor: i % 2 === 0 ? "#f5f7fa" : "#fff" }]}>
              {productCols.map((c) => (
                <View key={c.key} style={[s.cell, { flex: c.w }]} />
              ))}
            </View>
          ))}
        </View>

        {/* NOTLAR + KREDİ KARTI */}
        <View style={[s.row, { marginBottom: 4 }]} wrap={false}>
          <View
            style={{
              flex: leftW,
              borderWidth: 0.5,
              borderColor: BORDER,
              padding: 5,
              marginRight: 0,
            }}
          >
            <Text style={{ fontSize: 6.5, marginBottom: 1 }}>NOT:</Text>
            {notes.map((n, i) => (
              <Text key={i} style={{ fontSize: 6.5, lineHeight: 1.3 }}>
                • {n}
              </Text>
            ))}
          </View>
          <View style={{ flex: rightW }}>
            <SummaryGrid
              header={["KREDİ KARTI", "Birim Fiyat", ...insts.map((i) => `${i.count} Taksit K.K`)]}
              rows={[
                {
                  label: "TOPLAM (KDV HARİÇ)",
                  values: [calc.cash.subtotal, ...calc.card.slice(0, insts.length).map((c) => c.subtotal)].map(formatMoney),
                },
                {
                  label: "KDV",
                  values: [calc.cash.vat, ...calc.card.slice(0, insts.length).map((c) => c.vat)].map(formatMoney),
                },
                {
                  label: "GENEL TOPLAM",
                  values: [calc.cash.total, ...calc.card.slice(0, insts.length).map((c) => c.total)].map(formatMoney),
                  dark: NAVY,
                },
              ]}
              labelBg={LABEL_BG}
            />
          </View>
        </View>

        {st.transferDiscount > 0 && (
          <View style={s.row}>
            <View style={{ flex: leftW }} />
            <View style={{ flex: rightW, backgroundColor: YELLOW, borderWidth: 0.5, borderColor: "#000", paddingVertical: 2 }}>
              <Text style={[s.center, { fontSize: 7.5 }]}>
                Havale Ödemelerde Ekstra %{formatNumber(st.transferDiscount)} İndirim Uygulanmaktadır.
              </Text>
            </View>
          </View>
        )}

        {/* PARAMETRELER + VADELİ ÖDEME */}
        {st.showDeferred && calc.deferred.length > 0 && (
          <View style={[s.row, { marginTop: 8 }]} wrap={false}>
            <View style={{ flex: leftW }}>
              <View style={{ borderTopWidth: 0.5, borderLeftWidth: 0.5, borderColor: BORDER }}>
                <View style={[s.row, { backgroundColor: NAVY, height: 15 }]}>
                  <View style={[s.cell, { flex: 1 }]}>
                    <Text style={[s.bold, s.white, s.center]}>HESAPLAMA PARAMETRELERİ</Text>
                  </View>
                </View>
                {[
                  ["KDV ORANI", formatRate(st.vatRate)],
                  [`${LABEL} İÇİN AYLIK VADE FARKI`, formatRate(st.monthlyRate)],
                  [`${LABEL} İÇİN PEŞİNAT ORANI`, formatRate(st.downPaymentRate)],
                ].map(([k, v]) => (
                  <View key={k} style={[s.row, { height: 15 }]}>
                    <View style={[s.cell, { flex: 1.2, backgroundColor: LABEL_BG }]}>
                      <Text style={s.bold}>{k}</Text>
                    </View>
                    <View style={[s.cell, { flex: 1 }]}>
                      <Text style={s.center}>{v}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ flex: rightW }}>
              <SummaryGrid
                header={[`${LABEL} İLE ÖDEME`, ...calc.deferred.map((_, i) => `${label} Vadesi ${i + 1}`)]}
                labelBg={TEAL_LIGHT}
                rows={[
                  { label: "VADE (GÜN)", values: calc.deferred.map((d) => `${d.days} gün`), boldValues: true, center: true },
                  { label: "VADE FARKI", values: calc.deferred.map((d) => formatPercent(d.rate)) },
                  { label: "TOPLAM (KDV HARİÇ)", values: calc.deferred.map((d) => formatMoney(d.subtotal)) },
                  { label: "KDV", values: calc.deferred.map((d) => formatMoney(d.vat)) },
                  { label: "GENEL TOPLAM", values: calc.deferred.map((d) => formatMoney(d.total)), dark: TEAL },
                  {
                    label: `PEŞİNAT (${formatRate(st.downPaymentRate)})`,
                    values: calc.deferred.map((d) => formatMoney(d.downPayment)),
                    boldValues: true,
                    light: true,
                  },
                  {
                    label: `${LABEL} YAZILACAK TUTAR`,
                    values: calc.deferred.map((d) => formatMoney(d.remaining)),
                    dark: NAVY_2,
                  },
                ]}
              />
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

type GridRow = {
  label: string;
  values: string[];
  dark?: string;
  light?: boolean;
  boldValues?: boolean;
  center?: boolean;
};

function SummaryGrid({ header, rows, labelBg }: { header: string[]; rows: GridRow[]; labelBg: string }) {
  const labelFlex = 1.5;
  return (
    <View style={{ borderTopWidth: 0.5, borderLeftWidth: 0.5, borderColor: BORDER }}>
      <View style={[s.row, { backgroundColor: NAVY, height: 15 }]}>
        {header.map((h, i) => (
          <View key={i} style={[s.cell, { flex: i === 0 ? labelFlex : 1 }]}>
            <Text style={[s.bold, s.white, s.center, { fontSize: 6.5 }]}>{h}</Text>
          </View>
        ))}
      </View>
      {rows.map((r) => {
        const bg = r.dark ?? (r.light ? TEAL_LIGHT : "#fff");
        const fg = r.dark ? "#fff" : "#111";
        return (
          <View key={r.label} style={[s.row, { height: 18, backgroundColor: bg }]}>
            <View style={[s.cell, { flex: labelFlex, backgroundColor: r.dark ?? labelBg }]}>
              <Text style={[s.bold, { color: fg }]}>{r.label}</Text>
            </View>
            {r.values.map((v, i) => (
              <View key={i} style={[s.cell, { flex: 1 }]}>
                <Text
                  style={[
                    { color: fg },
                    r.center || r.dark || r.boldValues ? s.center : s.right,
                    r.dark || r.boldValues ? s.bold : {},
                  ]}
                >
                  {v}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}
