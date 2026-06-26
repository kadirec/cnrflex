import type { Locale } from "@/lib/site";

type Translated = Record<Locale, string>;

export type Product = {
  code: string;
  slug: string;
  name: Translated;
  description: Translated;
  image?: string;
  specs?: { label: Translated; value: Translated }[];
};

export type Category = {
  slug: string;
  name: Translated;
  shortDescription: Translated;
  description: Translated;
  image?: string;
  icon?: string;
  products: Product[];
};

export const categories: Category[] = [
  {
    slug: "otomatik-kepenk-fitilleri",
    name: { tr: "Otomatik Kepenk Fitilleri", en: "Automatic Shutter Seals" },
    image: "/kategoriler/kepenk_fitilleri.png",
    shortDescription: {
      tr: "Alüminyum ve çelik sarmal kapı sistemleri için sessiz çalışma ve tam yalıtım sağlayan fitil profilleri.",
      en: "Seal profiles for aluminum and steel rolling shutter systems offering silent operation and complete insulation.",
    },
    description: {
      tr: "Otomatik kepenk sistemlerinde sürtünmeyi azaltarak gürültüyü kesen, toz, rüzgar ve yağmura karşı sızdırmaz koruma sağlayan profesyonel fitil profillerimiz; iş yerleri, mağazalar ve garajlar için sistem ömrünü uzatır, bakım maliyetlerini düşürür.",
      en: "Professional seal profiles for automatic shutter systems that reduce friction, eliminate noise and provide watertight protection against dust, wind and rain — extending system lifespan and lowering maintenance costs for businesses, stores and garages.",
    },
    products: [
      {
        code: "CNR-OK-01",
        slug: "firca-li-dikme-fitili",
        name: { tr: "Otomatik Kepenk Fırçalı Dikme Fitili", en: "Brushed Vertical Shutter Seal" },
        description: {
          tr: "Fırçalı yapısı sayesinde toz ve böcek girişini engelleyen, kepenk dikmelerine kolayca monte edilebilen profil.",
          en: "Brushed structure prevents dust and insect intrusion; easy to install on shutter vertical posts.",
        },
      },
      {
        code: "CNR-OK-02",
        slug: "dikme-fitili",
        name: { tr: "Otomatik Kepenk Dikme Fitili", en: "Vertical Shutter Seal" },
        description: {
          tr: "Standart dikme fitili — sessiz çalışma ve hava sızdırmazlığı için optimize edilmiştir.",
          en: "Standard vertical seal optimized for silent operation and airtight sealing.",
        },
      },
      {
        code: "CNR-OK-03",
        slug: "alt-baza-fitili-standart",
        name: { tr: "Otomatik Kepenk Alt Baza Fitili", en: "Lower Base Shutter Seal" },
        description: {
          tr: "Kepenk alt baza için yumuşak dokulu, zemin uyumlu fitil.",
          en: "Soft-textured, floor-compatible seal for the lower base of shutters.",
        },
      },
      {
        code: "CNR-OK-04",
        slug: "celik-alt-baza-fitili",
        name: { tr: "Otomatik Kepenk Çelik Alt Baza Fitili", en: "Steel Lower Base Shutter Seal" },
        description: {
          tr: "Çelik baza sistemleri için yüksek dayanımlı sızdırmazlık profili.",
          en: "High-durability sealing profile for steel base systems.",
        },
      },
      {
        code: "CNR-OK-05",
        slug: "genis-alt-parca-fitili",
        name: { tr: "Otomatik Kepenk Geniş Alt Parça Fitili", en: "Wide Lower Section Shutter Seal" },
        description: {
          tr: "Geniş açıklıklarda yüksek yalıtım sağlayan genişletilmiş profil.",
          en: "Extended profile providing superior insulation for wide openings.",
        },
      },
      {
        code: "CNR-OK-06",
        slug: "alt-baza-fitili-v2",
        name: { tr: "Otomatik Kepenk Alt Baza Fitili (Tip 2)", en: "Lower Base Shutter Seal (Type 2)" },
        description: {
          tr: "Alternatif kesit geometrisi ile farklı kepenk markalarına uyumlu fitil.",
          en: "Alternative cross-section compatible with various shutter brands.",
        },
      },
      {
        code: "CNR-OK-07",
        slug: "alt-baza-fitili-v3",
        name: { tr: "Otomatik Kepenk Alt Baza Fitili (Tip 3)", en: "Lower Base Shutter Seal (Type 3)" },
        description: {
          tr: "Yüksek esneklik ve uzun ömür için optimize edilmiş baza fitili.",
          en: "Base seal optimized for high flexibility and long service life.",
        },
      },
      {
        code: "CNR-OK-08",
        slug: "alt-baza-fitili-v4",
        name: { tr: "Otomatik Kepenk Alt Baza Fitili (Tip 4)", en: "Lower Base Shutter Seal (Type 4)" },
        description: {
          tr: "Endüstriyel tip kepenkler için güçlendirilmiş alt baza fitili.",
          en: "Reinforced lower base seal for industrial-grade shutters.",
        },
      },
    ],
  },
  {
    slug: "tente-fitil-profilleri",
    name: { tr: "Tente Fitil Profilleri", en: "Awning Seal Profiles" },
    image: "/kategoriler/tente_fitilleri.png",
    shortDescription: {
      tr: "Tente sistemlerinde kumaş tutucu ve sızdırmaz birleşim profilleri.",
      en: "Fabric retention and watertight joining profiles for awning systems.",
    },
    description: {
      tr: "Endüstriyel ve mağaza tentelerinde kumaş ile alüminyum profili güvenli şekilde birleştiren, hava şartlarına dayanıklı tente fitilleri.",
      en: "Weather-resistant awning seals that securely join fabric and aluminum profile in industrial and storefront awnings.",
    },
    products: [
      {
        code: "CNR-TN-01",
        slug: "tente-kumas-fitili",
        name: { tr: "Tente Kumaş Fitili", en: "Awning Fabric Seal" },
        description: {
          tr: "Tente kumaşını alüminyum kanala sıkıca sabitleyen profil.",
          en: "Profile that firmly secures awning fabric to the aluminum channel.",
        },
      },
      {
        code: "CNR-TN-02",
        slug: "tente-yan-fitili",
        name: { tr: "Tente Yan Fitili", en: "Awning Side Seal" },
        description: {
          tr: "Yan profillerde su girişini engelleyen fitil.",
          en: "Side profile seal preventing water ingress.",
        },
      },
    ],
  },
  {
    slug: "pergola-fitilleri",
    name: { tr: "Pergola Fitilleri", en: "Pergola Seals" },
    image: "/kategoriler/pergola_fitilleri.png",
    shortDescription: {
      tr: "Pergola sistemlerinde su, rüzgar ve UV dayanımı sağlayan özel profil çözümleri.",
      en: "Specialty profile solutions providing water, wind and UV resistance for pergola systems.",
    },
    description: {
      tr: "Pergola sistemlerinin estetiği ve performansını birleştirmek için tasarlanan profillerimiz; tente kumaşı, alüminyum kanal ve panel birleşim noktalarında üstün sızdırmazlık ve UV dayanımı sunar.",
      en: "Our profiles, designed to combine aesthetics and performance for pergola systems, deliver superior sealing and UV resistance at fabric, aluminum channel and panel joints.",
    },
    products: [
      {
        code: "CNR-PG-01",
        slug: "pergola-yan-fitili",
        name: { tr: "Pergola Yan Fitili", en: "Pergola Side Seal" },
        description: {
          tr: "Pergola yan profillerinde su geçirmezlik sağlar.",
          en: "Provides waterproofing at pergola side profiles.",
        },
      },
      {
        code: "CNR-PG-02",
        slug: "pergola-kanat-fitili",
        name: { tr: "Pergola Kanat Fitili", en: "Pergola Blade Seal" },
        description: {
          tr: "Bioklimatik pergola kanatlarının arasındaki sızdırmazlık için.",
          en: "For sealing between blades in bioclimatic pergolas.",
        },
      },
      {
        code: "CNR-PG-03",
        slug: "pergola-tente-fitili",
        name: { tr: "Pergola Tente Fitili", en: "Pergola Awning Seal" },
        description: {
          tr: "Tente kumaşının profile sabitlenmesini sağlayan fitil.",
          en: "Seal that secures awning fabric to the profile.",
        },
      },
    ],
  },
  {
    slug: "kapi-fitilleri",
    name: { tr: "Kapı Fitilleri", en: "Door Seals" },
    image: "/kategoriler/kapi_fitilleri2.png",
    shortDescription: {
      tr: "İç ve dış mekan kapılarında hava, ses ve ısı yalıtımı sağlayan profesyonel fitiller.",
      en: "Professional seals providing air, sound and thermal insulation for interior and exterior doors.",
    },
    description: {
      tr: "Çelik kapı, alüminyum doğrama ve iç kapılar için tasarlanan fitil çeşitlerimiz; enerji tasarrufu, ses yalıtımı ve uzun ömürlü performans sağlar.",
      en: "Our seal range for steel doors, aluminum joinery and interior doors delivers energy savings, sound insulation and long-lasting performance.",
    },
    products: [
      {
        code: "CNR-KP-01",
        slug: "celik-kapi-fitili",
        name: { tr: "Çelik Kapı Fitili", en: "Steel Door Seal" },
        description: {
          tr: "Çelik kapı kasalarına uyumlu, yüksek esneklikli fitil.",
          en: "High-flexibility seal compatible with steel door frames.",
        },
      },
      {
        code: "CNR-KP-02",
        slug: "aluminyum-kapi-fitili",
        name: { tr: "Alüminyum Kapı Fitili", en: "Aluminum Door Seal" },
        description: {
          tr: "Alüminyum doğrama profilleri için EPDM benzeri performans.",
          en: "EPDM-grade performance for aluminum joinery profiles.",
        },
      },
      {
        code: "CNR-KP-03",
        slug: "ic-kapi-fitili",
        name: { tr: "İç Kapı Fitili", en: "Interior Door Seal" },
        description: {
          tr: "İç mekan kapılarında ses yalıtımı için yumuşak fitil.",
          en: "Soft seal for sound insulation in interior doors.",
        },
      },
    ],
  },
  {
    slug: "biyoklimatik-fitiller",
    name: { tr: "Biyoklimatik Fitiller", en: "Bioclimatic Seals" },
    image: "/kategoriler/biyoklimatik_fitili.png",
    shortDescription: {
      tr: "Biyoklimatik pergola ve panjur sistemleri için yüksek performanslı sızdırmazlık profilleri.",
      en: "High-performance sealing profiles for bioclimatic pergola and louver systems.",
    },
    description: {
      tr: "Hareketli kanatlı biyoklimatik sistemler için tasarlanan fitillerimiz, açılır-kapanır mekanizmalarda sızdırmazlığı korurken aşınma direnci ve düşük sürtünme katsayısı sunar.",
      en: "Our seals for movable-blade bioclimatic systems maintain sealing in opening-closing mechanisms while delivering wear resistance and a low friction coefficient.",
    },
    products: [
      {
        code: "CNR-BK-01",
        slug: "biyoklimatik-kanat-arasi",
        name: { tr: "Kanat Arası Fitili", en: "Inter-Blade Seal" },
        description: {
          tr: "Kanatlar arasındaki temas noktalarında sessizlik ve sızdırmazlık.",
          en: "Silent operation and sealing at inter-blade contact points.",
        },
      },
      {
        code: "CNR-BK-02",
        slug: "biyoklimatik-yan-fitili",
        name: { tr: "Yan Çerçeve Fitili", en: "Side Frame Seal" },
        description: {
          tr: "Çerçeve ile kanat arasında su ve hava sızdırmazlığı.",
          en: "Water and air sealing between frame and blade.",
        },
      },
    ],
  },
  {
    slug: "lightbox-fitilleri",
    name: { tr: "Lightbox Fitilleri", en: "Lightbox Seals" },
    image: "/kategoriler/lightbox_fitilleri.png",
    shortDescription: {
      tr: "Aydınlatmalı reklam panoları ve ışıklı tabelalar için kumaş gergi profilleri.",
      en: "Fabric tension profiles for illuminated advertising boards and lightbox signage.",
    },
    description: {
      tr: "Lightbox ve aydınlatmalı tabela sistemlerinde gerilimli kumaşın çerçeveye sabitlenmesi için tasarlanan silikonlu fitiller; pürüzsüz yüzey ve uzun ömürlü tutuş sağlar.",
      en: "Silicone-edge seals designed to secure tensioned fabric to lightbox and illuminated signage frames — delivering a smooth surface and long-lasting grip.",
    },
    products: [
      {
        code: "CNR-LB-01",
        slug: "lightbox-silikon-fitili",
        name: { tr: "Silikon Lightbox Fitili", en: "Silicone Lightbox Seal" },
        description: {
          tr: "Silikon bantlı, gergi kumaş sistemleri için standart fitil.",
          en: "Silicone-edge standard seal for tensioned fabric systems.",
        },
      },
      {
        code: "CNR-LB-02",
        slug: "lightbox-kose-fitili",
        name: { tr: "Lightbox Köşe Fitili", en: "Lightbox Corner Seal" },
        description: {
          tr: "Köşe birleşimlerinde pürüzsüz görünüm sağlayan profil.",
          en: "Profile delivering a smooth appearance at corner joints.",
        },
      },
    ],
  },
  {
    slug: "paspas-profilleri",
    name: { tr: "Paspas Profilleri", en: "Doormat Profiles" },
    image: "/kategoriler/paspas_fitilleri.png",
    shortDescription: {
      tr: "Giriş paspas sistemleri için alüminyum çerçeve fitilleri ve birleşim profilleri.",
      en: "Aluminum frame seals and joining profiles for entrance doormat systems.",
    },
    description: {
      tr: "Otel, AVM ve ofis girişlerinde kullanılan alüminyum paspas sistemleri için tasarlanan birleşim ve sızdırmazlık profilleri; kayma karşıtı yapı ve estetik bitiş sunar.",
      en: "Joining and sealing profiles for aluminum doormat systems used in hotel, mall and office entrances — providing anti-slip structure and an aesthetic finish.",
    },
    products: [
      {
        code: "CNR-PS-01",
        slug: "paspas-cerceve-fitili",
        name: { tr: "Paspas Çerçeve Fitili", en: "Doormat Frame Seal" },
        description: {
          tr: "Alüminyum paspas çerçevesinde sızdırmazlık ve titreşim emici.",
          en: "Sealing and vibration absorption in aluminum doormat frames.",
        },
      },
      {
        code: "CNR-PS-02",
        slug: "paspas-birlesim-profili",
        name: { tr: "Paspas Birleşim Profili", en: "Doormat Joining Profile" },
        description: {
          tr: "Paspas modüllerinin sessiz birleşimi için profil.",
          en: "Profile for silent joining of doormat modules.",
        },
      },
    ],
  },
];

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProduct(categorySlug: string, productSlug: string): { category: Category; product: Product } | undefined {
  const category = getCategory(categorySlug);
  if (!category) return undefined;
  const product = category.products.find((p) => p.slug === productSlug);
  if (!product) return undefined;
  return { category, product };
}
