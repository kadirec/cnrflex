import type { Locale } from "@/lib/site";

export type BlogPost = {
  slug: string;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  content: Record<Locale, string>;
  date: string;
  author: string;
  readingTime: number;
};

export const posts: BlogPost[] = [
  {
    slug: "pvc-tpe-tpu-arasindaki-farklar",
    title: {
      tr: "PVC, TPE ve TPU Arasındaki Farklar Nelerdir?",
      en: "What Are the Differences Between PVC, TPE and TPU?",
    },
    excerpt: {
      tr: "Plastik fitil ve profil tedariğinde ve üretiminde kullanılan üç temel hammaddenin teknik özellikleri ve uygulama alanlarını karşılaştırıyoruz.",
      en: "We compare the technical properties and application areas of the three core raw materials used in plastic seal and profile supply and manufacturing.",
    },
    date: "2025-12-01",
    author: "CNRFlexis",
    readingTime: 5,
    content: {
      tr: `## Hangi malzemeyi ne zaman seçmeli?

Plastik fitil ve profil tedariğinde **PVC**, **TPE** ve **TPU** olmak üzere üç temel hammadde grubu kullanılır. Doğru malzeme seçimi, ürünün performansını ve uzun ömürlülüğünü doğrudan etkiler.

### PVC (Polivinil Klorür)

Sert ve yumuşak (esnek) versiyonlarda üretilebilir. Maliyet-performans dengesi yüksektir. Pencere, kapı ve genel amaçlı fitillerde sıkça tercih edilir.

- Kimyasallara ve UV'ye yüksek direnç
- Ekonomik üretim
- Geniş sertlik (Shore A) aralığı

### TPE (Termoplastik Elastomer)

Lastik gibi esnek ancak plastik gibi şekillendirilebilir. Sıkıştırma seti düşük, geri kazanım performansı yüksek.

- Düşük sıcaklıkta esneklik
- Kolay geri dönüştürülebilir
- Soft-touch yüzey

### TPU (Termoplastik Poliüretan)

Yüksek mekanik dayanım gerektiren uygulamalarda kullanılır. Aşınma direnci PVC'den belirgin şekilde daha yüksektir.

- Mükemmel aşınma direnci
- Yağ ve solvent direnci
- Yüksek elastikiyet

## Sonuç

Uygulamanıza en uygun malzemeyi seçmek için mühendislik ekibimizle iletişime geçin. Her proje için optimum çözümü tasarlıyoruz.`,
      en: `## Which material should you choose, and when?

Three primary raw materials are used in plastic seal and profile supply: **PVC**, **TPE** and **TPU**. Selecting the right material directly affects product performance and longevity.

### PVC (Polyvinyl Chloride)

Available in rigid and flexible variants. Strong cost-performance ratio. Commonly preferred in window, door and general-purpose seals.

- High resistance to chemicals and UV
- Economical production
- Wide hardness (Shore A) range

### TPE (Thermoplastic Elastomer)

Flexible like rubber yet processable like plastic. Low compression set and excellent recovery performance.

- Flexibility at low temperatures
- Easy to recycle
- Soft-touch surface

### TPU (Thermoplastic Polyurethane)

Used in applications requiring high mechanical strength. Abrasion resistance is significantly higher than PVC.

- Excellent abrasion resistance
- Oil and solvent resistance
- High elasticity

## Conclusion

Contact our engineering team to choose the most suitable material for your application. We design the optimum solution for every project.`,
    },
  },
  {
    slug: "otomatik-kepenk-fitili-secimi",
    title: {
      tr: "Otomatik Kepenk Fitili Seçiminde Dikkat Edilmesi Gerekenler",
      en: "Key Considerations When Selecting an Automatic Shutter Seal",
    },
    excerpt: {
      tr: "Doğru fitil seçimi kepenk sisteminizin ömrünü ikiye katlayabilir. İşte uzmanlarımızdan 5 kritik ipucu.",
      en: "The right seal choice can double the life of your shutter system. Here are 5 critical tips from our experts.",
    },
    date: "2025-11-20",
    author: "CNRFlexis",
    readingTime: 4,
    content: {
      tr: `## Doğru fitil ile sistem ömrünü uzatın

Otomatik kepenk sistemlerinde fitil, sadece sızdırmazlık değil aynı zamanda **sessiz çalışma** ve **sistem koruması** anlamına gelir.

### 1. Profil ölçüsünü doğru alın

Mevcut kepenk profilinin kanalına tam uyan kesit ölçüsünü seçin. Yanlış ölçü, hava sızıntısı veya zorlu mekanik sürtünme yaratır.

### 2. Sertlik (Shore A) önemlidir

Çok yumuşak fitil hızlı aşınır, çok sert fitil ise gürültülü çalışır. Standart endüstriyel uygulamalar için **70-80 Shore A** ideal aralıktır.

### 3. Hava şartlarına uygunluk

Dış mekana açık sistemlerde UV ve sıcaklık dayanımı önceliklidir. Bu noktada TPE/TPU karışım fitiller PVC'ye göre daha uzun ömürlüdür.

### 4. Renk ve estetik

Genelde siyah veya gri tercih edilir; ancak CNRFlexis olarak özel renk talepleri karşılayabiliyoruz.

### 5. Tedarikçi güvenilirliği

Stoklu tedarik ve hızlı sevkiyat, projenizin aksamaması için kritiktir.`,
      en: `## Extend system life with the right seal

In automatic shutter systems, the seal means not only watertightness but also **silent operation** and **system protection**.

### 1. Measure the profile correctly

Choose a cross-section that fits exactly into the existing shutter profile channel. Incorrect sizing causes air leakage or harsh mechanical friction.

### 2. Hardness (Shore A) matters

A too-soft seal wears quickly, while a too-hard seal operates noisily. The ideal range for standard industrial applications is **70-80 Shore A**.

### 3. Weather compatibility

UV and temperature resistance are priorities for outdoor systems. TPE/TPU blends offer longer life than PVC here.

### 4. Color and aesthetics

Black or gray are usually preferred, but at CNRFlexis we can accommodate custom color requests.

### 5. Supplier reliability

Stocked supply and fast shipping are critical to keep your project on schedule.`,
    },
  },
  {
    slug: "biyoklimatik-pergola-fitilleri",
    title: {
      tr: "Biyoklimatik Pergolalarda Fitil Performansı",
      en: "Seal Performance in Bioclimatic Pergolas",
    },
    excerpt: {
      tr: "Hareketli kanatlı biyoklimatik pergolalarda fitil tasarımının önemi ve doğru seçim için ipuçları.",
      en: "Why seal design matters for movable-blade bioclimatic pergolas and how to choose the right one.",
    },
    date: "2025-10-12",
    author: "CNRFlexis",
    readingTime: 3,
    content: {
      tr: `## Biyoklimatik sistemler ne ister?

Biyoklimatik pergolalarda kanatlar açılıp kapandığı için fitil sürekli mekanik strese maruz kalır. Bu nedenle:

- Düşük sürtünme katsayısı önemlidir
- Sıkıştırma seti düşük olmalıdır
- UV ve yağmur dayanımı olmazsa olmaz

CNRFlexis biyoklimatik fitilleri, bu üç özelliği bir arada sunacak şekilde TPE bazlı yapıda sunulur.`,
      en: `## What do bioclimatic systems demand?

In bioclimatic pergolas the blades open and close, so the seal is under constant mechanical stress. Therefore:

- A low friction coefficient is important
- Compression set must be low
- UV and rain resistance is a must-have

CNRFlexis bioclimatic seals are offered with a TPE base, delivering all three characteristics together.`,
    },
  },
];

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
