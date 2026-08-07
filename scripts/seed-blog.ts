import { getDb, blogPosts, type BlogCategory } from "@/lib/db";
import { eq } from "drizzle-orm";

type Seed = {
  slug: string;
  category: BlogCategory;
  titleTr: string;
  titleEn: string;
  excerptTr: string;
  excerptEn: string;
  contentTr: string;
  contentEn: string;
  readingTime: number;
  sortOrder: number;
};

const posts: Seed[] = [
  // ============================================================
  // MALZEME REHBERLERİ
  // ============================================================
  {
    slug: "pvc-tpe-tpv-epdm-karsilastirmasi",
    category: "malzeme-rehberleri",
    sortOrder: 10,
    readingTime: 7,
    titleTr: "PVC, TPE, TPV ve EPDM Karşılaştırması: Hangi Malzeme Hangi Uygulama İçin?",
    titleEn: "PVC, TPE, TPV and EPDM Compared: Which Material for Which Application?",
    excerptTr:
      "PVC, TPE, TPV ve EPDM malzemelerin teknik özelliklerini, avantajlarını, dezavantajlarını ve kullanım alanlarını karşılaştırmalı olarak inceleyin. Doğru malzeme seçimi için kapsamlı rehber.",
    excerptEn:
      "A comparative look at the technical properties, pros, cons and applications of PVC, TPE, TPV and EPDM. A comprehensive guide for choosing the right material.",
    contentTr: `
<p>Teknik fitil ve ekstrüzyon profillerinde ürün performansını belirleyen en önemli unsurlardan biri doğru hammadde seçimidir. Aynı profil tasarımına sahip iki ürün bile farklı malzemeler kullanıldığında dayanıklılık, esneklik, sıcaklık direnci ve kullanım ömrü açısından tamamen farklı sonuçlar verebilir.</p>
<p>Bu nedenle malzeme seçimi yalnızca maliyet odaklı değil; ürünün kullanılacağı ortam, maruz kalacağı mekanik yükler, sıcaklık değişimleri, UV ışınları ve kimyasal etkilere göre değerlendirilmelidir.</p>
<p>Bu yazımızda teknik fitil ve ekstrüzyon profillerinde en yaygın kullanılan dört temel malzemeyi karşılaştırıyoruz.</p>

<h3>PVC (Polivinil Klorür)</h3>
<p>PVC, teknik ekstrüzyon sektöründe en yaygın kullanılan malzemelerden biridir. İşlenebilirliği kolay, maliyeti ekonomik ve farklı sertliklerde üretilebilmesi sayesinde çok geniş bir kullanım alanına sahiptir.</p>
<p><strong>Avantajları:</strong></p>
<ul>
<li>Ekonomik maliyet</li>
<li>Kolay işlenebilir yapı</li>
<li>Farklı sertliklerde üretilebilir</li>
<li>Renk çeşitliliği yüksektir</li>
<li>İyi yüzey kalitesi sağlar</li>
</ul>
<p><strong>Dezavantajları:</strong></p>
<ul>
<li>Çok düşük sıcaklıklarda sertleşebilir</li>
<li>Uzun süre yoğun UV ışınlarına maruz kaldığında performansı düşebilir</li>
<li>Sürekli dinamik hareket gerektiren uygulamalarda elastikiyetini zamanla kaybedebilir</li>
</ul>
<p><strong>Kullanım Alanları:</strong> Lightbox fitilleri, reklam sistemleri, mobilya profilleri, dekoratif plastik profiller, genel amaçlı ekstrüzyon profilleri.</p>

<h3>TPE (Termoplastik Elastomer)</h3>
<p>TPE, plastik ile kauçuğun avantajlarını bir araya getiren modern mühendislik malzemelerinden biridir. Yumuşak yapısı, esnekliği ve geri dönüşüm avantajı sayesinde birçok teknik uygulamada tercih edilmektedir.</p>
<p><strong>Avantajları:</strong></p>
<ul>
<li>Yüksek elastikiyet</li>
<li>Kolay şekillendirilebilir</li>
<li>Geri dönüştürülebilir</li>
<li>PVC'ye göre daha yumuşak yapı</li>
<li>İyi sızdırmazlık performansı</li>
</ul>
<p><strong>Dezavantajları:</strong></p>
<ul>
<li>PVC'ye göre maliyeti daha yüksektir</li>
<li>Bazı uygulamalarda EPDM kadar yüksek sıcaklık dayanımı sağlamaz</li>
</ul>
<p><strong>Kullanım Alanları:</strong> Otomotiv fitilleri, beyaz eşya profilleri, teknik conta uygulamaları, endüstriyel kapı sistemleri.</p>

<h3>TPV (Termoplastik Vulkanizat)</h3>
<p>TPV, vulkanize kauçuğun dayanımını termoplastik işlenebilirliği ile birleştiren gelişmiş bir elastomer malzemedir. Yüksek sıcaklık direnci ve uzun ömürlü elastik yapısı sayesinde ağır çalışma koşullarında tercih edilir.</p>
<p><strong>Avantajları:</strong></p>
<ul>
<li>Yüksek sıcaklık dayanımı</li>
<li>Uzun ömür</li>
<li>Kimyasallara karşı direnç</li>
<li>UV dayanımı</li>
<li>Dış ortam koşullarına uygunluk</li>
</ul>
<p><strong>Dezavantajları:</strong></p>
<ul>
<li>İşleme maliyeti daha yüksektir</li>
<li>PVC ve TPE'ye göre daha pahalıdır</li>
</ul>
<p><strong>Kullanım Alanları:</strong> Otomotiv, dış cephe sistemleri, endüstriyel makinalar, ağır hizmet fitilleri.</p>

<h3>EPDM (Etilen Propilen Dien Monomer)</h3>
<p>EPDM sentetik kauçuk esaslı bir malzemedir ve özellikle dış ortam uygulamalarında en başarılı çözümlerden biridir. UV ışınlarına, ozona, yağmura ve sıcaklık değişimlerine karşı gösterdiği direnç sayesinde uzun yıllar performansını koruyabilir.</p>
<p><strong>Avantajları:</strong></p>
<ul>
<li>Mükemmel UV dayanımı</li>
<li>Ozon direnci</li>
<li>Su ve nem dayanımı</li>
<li>Çok uzun kullanım ömrü</li>
<li>Dış ortam uygulamaları için ideal</li>
</ul>
<p><strong>Dezavantajları:</strong></p>
<ul>
<li>Termoplastik malzemeler gibi tekrar işlenemez</li>
<li>Üretim maliyeti daha yüksektir</li>
</ul>
<p><strong>Kullanım Alanları:</strong> Cephe sistemleri, alüminyum doğrama, otomotiv, inşaat sektörü, endüstriyel sızdırmazlık sistemleri.</p>

<h3>Karşılaştırmalı Değerlendirme</h3>
<ul>
<li><strong>Maliyet:</strong> PVC en ekonomik, TPV/EPDM daha yüksek maliyetli</li>
<li><strong>Esneklik:</strong> TPE, TPV ve EPDM PVC'ye göre çok üstün</li>
<li><strong>UV Dayanımı:</strong> TPV ve EPDM en yüksek, PVC en düşük</li>
<li><strong>Kimyasal Dayanım:</strong> TPV ve EPDM en yüksek</li>
<li><strong>Geri Dönüştürülebilirlik:</strong> Termoplastikler (PVC, TPE, TPV) yüksek; EPDM düşük</li>
<li><strong>Dış Ortam Performansı:</strong> TPV ve EPDM en iyi performansı verir</li>
</ul>

<h3>Sonuç</h3>
<p>Teknik fitil ve ekstrüzyon profillerinde "en iyi malzeme" diye tek bir seçenek yoktur. Doğru malzeme; ürünün kullanım alanına, çalışma koşullarına, çevresel etkilere ve performans beklentilerine göre belirlenmelidir.</p>
<p>Ekonomik ve genel amaçlı uygulamalarda PVC öne çıkarken, daha yüksek elastikiyet gereken projelerde TPE tercih edilir. Ağır çalışma koşulları ve yüksek sıcaklık dayanımı gereken uygulamalarda TPV güçlü bir alternatif sunarken, dış ortam dayanımı ve uzun ömür açısından EPDM en başarılı seçeneklerden biridir.</p>

<h3>CNR SEAL Uzman Görüşü</h3>
<p>Malzeme seçimi, teknik fitil ve ekstrüzyon profillerinde ürün performansını doğrudan etkileyen en kritik kararlardan biridir. Ancak doğru sonuç yalnızca hammadde seçimiyle değil; profil tasarımı, üretim yöntemi, ölçü toleransları ve kullanım koşullarının birlikte değerlendirilmesiyle elde edilir.</p>
<p>CNR SEAL olarak her projeyi uygulama şartlarına göre analiz ediyor, doğru malzemeyi doğru üretim teknolojisiyle buluşturarak uzun ömürlü ve güvenilir çözümler geliştiriyoruz.</p>
`.trim(),
    contentEn: `
<p>In technical seals and extrusion profiles, raw material selection is one of the most decisive factors on product performance. Two products with the same cross-section can behave completely differently — in durability, flexibility, temperature resistance and service life — depending on the material.</p>
<p>Material choice must be assessed against the environment, mechanical loads, temperature, UV exposure and chemical contact — not price alone.</p>
<p>This article compares the four materials most widely used in technical seals and extrusion profiles.</p>

<h3>PVC (Polyvinyl Chloride)</h3>
<p>PVC is one of the most common materials in technical extrusion — easy to process, economical, and available in a wide hardness range.</p>
<p><strong>Advantages:</strong> economical cost, easy processing, wide hardness range, rich color options, good surface finish.</p>
<p><strong>Disadvantages:</strong> can stiffen at very low temperatures; performance degrades under long, heavy UV exposure; may lose elasticity in continuous dynamic movement.</p>
<p><strong>Typical uses:</strong> lightbox seals, signage systems, furniture profiles, decorative plastic profiles, general-purpose extrusion profiles.</p>

<h3>TPE (Thermoplastic Elastomer)</h3>
<p>TPE combines the advantages of plastics and rubber — soft, flexible, and recyclable — which makes it a strong choice for many technical applications.</p>
<p><strong>Advantages:</strong> high elasticity, easy to shape, recyclable, softer than PVC, good sealing performance.</p>
<p><strong>Disadvantages:</strong> higher cost than PVC; not always as temperature-resistant as EPDM.</p>
<p><strong>Typical uses:</strong> automotive seals, white goods profiles, technical gaskets, industrial door systems.</p>

<h3>TPV (Thermoplastic Vulcanizate)</h3>
<p>TPV combines the durability of vulcanized rubber with the processability of thermoplastics — excellent for demanding conditions and high temperatures.</p>
<p><strong>Advantages:</strong> high temperature resistance, long life, chemical resistance, UV resistance, outdoor suitability.</p>
<p><strong>Disadvantages:</strong> higher processing cost; more expensive than PVC and TPE.</p>
<p><strong>Typical uses:</strong> automotive, façade systems, industrial machinery, heavy-duty seals.</p>

<h3>EPDM (Ethylene Propylene Diene Monomer)</h3>
<p>EPDM is a synthetic rubber and one of the most successful choices for outdoor applications — resistant to UV, ozone, rain and temperature swings for many years.</p>
<p><strong>Advantages:</strong> excellent UV resistance, ozone resistance, water/moisture resistance, very long service life, ideal outdoors.</p>
<p><strong>Disadvantages:</strong> cannot be reprocessed like thermoplastics; higher production cost.</p>
<p><strong>Typical uses:</strong> façade systems, aluminum joinery, automotive, construction, industrial sealing systems.</p>

<h3>At a Glance</h3>
<ul>
<li><strong>Cost:</strong> PVC most economical; TPV/EPDM higher</li>
<li><strong>Flexibility:</strong> TPE, TPV, EPDM clearly ahead of PVC</li>
<li><strong>UV resistance:</strong> TPV and EPDM highest; PVC weakest</li>
<li><strong>Chemical resistance:</strong> TPV and EPDM highest</li>
<li><strong>Recyclability:</strong> Thermoplastics (PVC, TPE, TPV) high; EPDM low</li>
<li><strong>Outdoor performance:</strong> TPV and EPDM best</li>
</ul>

<h3>Conclusion</h3>
<p>There is no single "best material" in technical seals and extrusion profiles. The right material depends on use case, operating conditions, environment and performance expectations.</p>
<p>PVC leads for economical and general-purpose applications, TPE where more elasticity is required, TPV for demanding conditions and high temperatures, and EPDM for outdoor durability and very long life.</p>

<h3>CNR SEAL Expert View</h3>
<p>Material selection is one of the most critical decisions affecting product performance. The right result comes not only from raw material choice but from evaluating profile design, production method, dimensional tolerances and operating conditions together.</p>
<p>At CNR SEAL we analyse each project against its application conditions and combine the right material with the right production technology to deliver long-lasting, reliable solutions.</p>
`.trim(),
  },
  {
    slug: "plastik-ekstruzyonda-hammadde-secimi",
    category: "malzeme-rehberleri",
    sortOrder: 20,
    readingTime: 8,
    titleTr: "Plastik Ekstrüzyonda Hammadde Seçimi",
    titleEn: "Raw Material Selection in Plastic Extrusion",
    excerptTr:
      "Plastik ekstrüzyon üretiminde doğru hammadde seçimi neden önemlidir? PVC, TPE, TPV ve diğer teknik hammaddelerin seçim kriterleri, performans üzerindeki etkileri ve dikkat edilmesi gereken teknik detayları bu rehberde inceleyin.",
    excerptEn:
      "Why does raw material selection matter in plastic extrusion? A practical guide to selection criteria for PVC, TPE, TPV and other technical materials, and the technical details you should watch for.",
    contentTr: `
<p>Plastik ekstrüzyon üretiminde kaliteli bir ürün elde etmenin ilk adımı doğru hammadde seçimidir. Aynı kalıp, aynı üretim hattı ve aynı üretim koşulları kullanılsa bile tercih edilen hammadde; ürünün mekanik dayanımını, esnekliğini, ölçü kararlılığını ve kullanım ömrünü doğrudan etkiler.</p>
<p>Bu nedenle başarılı bir ekstrüzyon profili yalnızca doğru kalıpla değil, uygulama şartlarına en uygun malzemenin seçilmesiyle ortaya çıkar. Hammadde seçimi yapılırken yalnızca maliyet değil; ürünün çalışacağı ortam, maruz kalacağı mekanik yükler, sıcaklık değişimleri, kimyasal etkiler ve kullanım amacı birlikte değerlendirilmelidir.</p>

<h3>Hammadde Seçimi Neden Bu Kadar Önemlidir?</h3>
<p>Bir teknik profilin başarısını belirleyen en önemli unsurların başında doğru malzeme gelir. Yanlış seçilen hammadde;</p>
<ul>
<li>Ürünün kısa sürede sertleşmesine</li>
<li>Çatlamasına</li>
<li>Ölçü değişikliklerine</li>
<li>Sızdırmazlık performansının düşmesine</li>
<li>Renk solmasına</li>
<li>Üretim maliyetlerinin artmasına</li>
</ul>
<p>neden olabilir. Doğru malzeme ise ürünün kullanım ömrünü uzatır, bakım maliyetlerini azaltır ve üretim süreçlerinde güvenilir performans sağlar.</p>

<h3>Hammadde Seçimini Etkileyen Temel Faktörler</h3>
<p>Her uygulamanın çalışma koşulları farklıdır. Bu nedenle hammadde seçimi yapılırken aşağıdaki kriterler birlikte değerlendirilmelidir.</p>

<h3>Kullanım Ortamı</h3>
<p>Ürün iç mekânda mı yoksa dış ortam koşullarına mı maruz kalacak? Sürekli güneş ışığı alacak mı? Yağmur, nem veya deniz suyu ile temas edecek mi? Örneğin dış ortam uygulamalarında UV dayanımı yüksek malzemeler tercih edilmelidir.</p>

<h3>Sıcaklık Aralığı</h3>
<p>Her malzemenin çalışma sıcaklığı farklıdır. Yüksek sıcaklık altında çalışan bir profilde uygun olmayan malzeme kullanılması deformasyona neden olabilir. Aynı şekilde düşük sıcaklıklarda bazı malzemeler sertleşebilir veya elastikiyetini kaybedebilir.</p>

<h3>Mekanik Hareket</h3>
<p>Profil sürekli açılıp kapanıyor mu, hareketli sistemlerde mi çalışıyor, baskıya mı maruz kalıyor? Sürekli hareket eden sistemlerde yüksek elastikiyet sağlayan malzemeler tercih edilmelidir.</p>

<h3>Kimyasal Dayanım</h3>
<p>Bazı endüstriyel uygulamalarda ürün yağ, temizlik kimyasalları, asit veya alkali maddelerle temas edebilir. Bu durumda kimyasal dayanımı yüksek hammaddeler tercih edilmelidir.</p>

<h3>UV ve Dış Ortam Dayanımı</h3>
<p>Dış ortam uygulamalarında güneş ışınları, ozon ve hava koşulları ürün performansını doğrudan etkiler. UV katkılı veya yüksek hava şartı dayanımına sahip malzemeler uzun ömürlü kullanım sağlar.</p>

<h3>Doğru Sertlik (Shore) Seçimi</h3>
<p>Hammadde kadar önemli bir diğer konu ise sertlik değeridir. Aynı malzeme farklı Shore değerlerinde üretilebilir. Yanlış sertlik seçimi; montaj zorluğuna, yetersiz sızdırmazlığa, gereğinden fazla deformasyona ve kullanım ömrünün kısalmasına neden olabilir. Bu nedenle sertlik değeri ürün tasarımıyla birlikte değerlendirilmelidir.</p>

<h3>Maliyet Tek Başına Doğru Kriter Değildir</h3>
<p>Birçok projede ilk değerlendirme maliyet üzerinden yapılmaktadır. Ancak en düşük maliyetli hammadde her zaman en ekonomik çözüm değildir. Yanlış malzeme seçimi; daha fazla bakım, daha kısa kullanım ömrü, üretim kayıpları, müşteri şikayetleri ve garanti maliyetleri gibi çok daha büyük giderlere neden olabilir. Uzun vadede doğru malzeme seçimi toplam sahip olma maliyetini önemli ölçüde düşürür.</p>

<h3>Hammadde ve Kalıp Birlikte Değerlendirilmelidir</h3>
<p>Ekstrüzyon profil üretiminde yalnızca malzemeyi değiştirmek her zaman doğru sonuç vermez. Çünkü kalıp tasarımı, et kalınlığı, soğutma sistemi, üretim hızı ve çekme ayarları gibi üretim parametreleri de ürün performansını doğrudan etkiler. Başarılı sonuç, tüm üretim sürecinin birlikte değerlendirilmesiyle elde edilir.</p>

<h3>Uygulamaya Göre Doğru Hammadde Örnekleri</h3>
<ul>
<li><strong>Lightbox sistemleri:</strong> yüksek UV dayanımı, esnek yapı, renk kararlılığı</li>
<li><strong>Otomatik kepenk sistemleri:</strong> aşınma direnci, sürekli hareket dayanımı, düşük deformasyon</li>
<li><strong>Şişme bot fitilleri:</strong> deniz suyuna dayanım, UV direnci, yapıştırma uyumu, esnek yapı</li>
<li><strong>Yangın kapısı profilleri:</strong> yüksek sıcaklık performansı, ilgili standartlara uygun malzeme, uzun süreli mekanik dayanım</li>
</ul>

<h3>Sık Yapılan Hatalar</h3>
<ul>
<li>Sadece fiyat odaklı hammadde seçmek</li>
<li>Uygulama şartlarını dikkate almamak</li>
<li>Kalıp tasarımı ile malzemeyi birlikte değerlendirmemek</li>
<li>Aynı hammaddenin her uygulamada aynı sonucu vereceğini düşünmek</li>
<li>Teknik danışmanlık almadan üretime başlamak</li>
</ul>
<p>Bu hatalar hem maliyetleri artırır hem de ürün performansını olumsuz etkiler.</p>

<h3>Sonuç</h3>
<p>Plastik ekstrüzyon üretiminde kaliteli ve uzun ömürlü bir ürün elde etmenin temel şartı doğru hammadde seçimidir. Ancak doğru seçim yalnızca malzeme türüne karar vermek değildir. Kullanım alanı, çevresel koşullar, mekanik yükler, profil tasarımı ve üretim parametreleri birlikte değerlendirilerek en uygun çözüm belirlenmelidir. Başarılı ekstrüzyon projeleri; doğru hammadde, doğru kalıp ve doğru üretim teknolojisinin bir araya gelmesiyle ortaya çıkar.</p>

<h3>CNR SEAL Uzman Görüşü</h3>
<p>Her ekstrüzyon profili farklı çalışma koşullarına sahiptir. Bu nedenle tek tip malzeme yaklaşımı yerine, projenin ihtiyaçlarını teknik açıdan analiz ederek en uygun hammaddeyi belirlemek uzun vadeli performans açısından büyük önem taşır.</p>
<p>CNR SEAL olarak standart ürünlerin yanı sıra, teknik çizim veya numuneye göre geliştirilen özel projelerde de doğru hammadde seçimi, profil tasarımı ve üretim koordinasyonunu birlikte değerlendiriyor; uygulamaya en uygun teknik çözümleri geliştiriyoruz.</p>
`.trim(),
    contentEn: `
<p>The first step to producing a quality item by plastic extrusion is choosing the right raw material. Even with the same mold, line and process, the chosen material directly shapes mechanical strength, flexibility, dimensional stability and service life.</p>
<p>A successful profile is the result of both the right mold and the material best suited to the application. Selection must consider environment, mechanical loads, temperature swings, chemical exposure and end use — not price alone.</p>

<h3>Why Material Selection Matters</h3>
<p>The wrong material can cause premature stiffening, cracking, dimensional drift, sealing loss, color fade and rising production cost. The right material extends service life, lowers maintenance and delivers reliable performance.</p>

<h3>Key Selection Factors</h3>
<p>Every application has different operating conditions. The following criteria should be evaluated together.</p>

<h3>Use Environment</h3>
<p>Indoor or outdoor? Constant sun exposure? Contact with rain, moisture or seawater? For outdoor applications, materials with high UV resistance should be preferred.</p>

<h3>Temperature Range</h3>
<p>Each material has a defined working range. Wrong choices in high-temperature settings cause deformation; some materials stiffen or lose elasticity at low temperatures.</p>

<h3>Mechanical Movement</h3>
<p>Is the profile continuously flexed, part of a moving system, or under compression? Sustained-movement systems demand highly elastic materials.</p>

<h3>Chemical Resistance</h3>
<p>Some industrial applications contact oil, cleaning agents, acids or alkalis — materials with strong chemical resistance should be chosen.</p>

<h3>UV and Weather Resistance</h3>
<p>Outdoors, sunlight, ozone and weather directly shape performance. UV-stabilised or weather-resistant materials deliver long life.</p>

<h3>Correct Hardness (Shore)</h3>
<p>Hardness is as important as the base material. The same polymer can be produced at different Shore values. The wrong hardness causes assembly difficulty, insufficient sealing, excess deformation, and shorter life. Shore should be selected together with the product design.</p>

<h3>Cost Alone Is Not the Right Criterion</h3>
<p>The lowest-cost material is not always the most economical. Wrong choices lead to more maintenance, shorter life, production loss, customer complaints and warranty cost. Over time, the right material significantly reduces total cost of ownership.</p>

<h3>Evaluate Material and Mold Together</h3>
<p>Changing only the material in an extrusion project does not always yield the right result. Mold design, wall thickness, cooling, line speed and draw settings also shape performance. Success comes from evaluating the entire process together.</p>

<h3>Material by Application (Examples)</h3>
<ul>
<li><strong>Lightbox systems:</strong> high UV resistance, flexibility, color stability</li>
<li><strong>Automatic shutter systems:</strong> wear resistance, tolerance for continuous movement, low deformation</li>
<li><strong>Inflatable boat seals:</strong> seawater resistance, UV resistance, adhesive compatibility, flexibility</li>
<li><strong>Fire door profiles:</strong> high-temperature performance, standards-compliant material, sustained mechanical durability</li>
</ul>

<h3>Common Mistakes</h3>
<ul>
<li>Selecting only on price</li>
<li>Ignoring the application conditions</li>
<li>Not evaluating mold and material together</li>
<li>Assuming a material behaves identically across every application</li>
<li>Starting production without technical consultation</li>
</ul>

<h3>Conclusion</h3>
<p>Quality and longevity in extrusion begin with the right raw material. The right choice is not just picking a polymer — it requires evaluating environment, mechanical loads, profile design and production parameters together. The best results come from combining the right material, the right mold and the right production technology.</p>

<h3>CNR SEAL Expert View</h3>
<p>Every extrusion profile has different operating conditions. Rather than a one-material approach, analysing the project's needs technically and choosing the right material is critical for long-term performance.</p>
<p>Alongside standard products, on custom projects developed from drawings or samples we evaluate material selection, profile design and production coordination together — and develop the most suitable technical solution for the application.</p>
`.trim(),
  },

  // ============================================================
  // UYGULAMA REHBERLERİ
  // ============================================================
  {
    slug: "lightbox-fitili-secim-rehberi",
    category: "uygulama-rehberleri",
    sortOrder: 30,
    readingTime: 6,
    titleTr: "Lightbox Fitili Seçim Rehberi: Uzun Ömürlü Kullanım İçin Teknik Rehber",
    titleEn: "Lightbox Seal Selection Guide: A Technical Guide for Long-Lasting Use",
    excerptTr:
      "Lightbox fitili seçerken nelere dikkat edilmelidir? Kumaş germe sistemleri için doğru fitil seçimi, malzeme özellikleri, ölçü toleransları ve uzun ömürlü kullanım hakkında kapsamlı teknik rehber.",
    excerptEn:
      "What to consider when choosing a lightbox seal — the right seal for fabric-tensioning systems, material properties, dimensional tolerances and long-term use.",
    contentTr: `
<p>Günümüzde ışıklı reklam panoları, tekstil germe sistemleri ve LED aydınlatmalı kutu harf uygulamalarında kullanılan Lightbox sistemleri, estetik görünümünün yanı sıra uzun ömürlü ve sorunsuz çalışmasıyla da öne çıkmaktadır. Bu sistemlerin en önemli bileşenlerinden biri ise çoğu zaman fark edilmeyen ancak performansı doğrudan etkileyen Lightbox fitilidir.</p>
<p>Doğru seçilmeyen bir fitil kumaşın zamanla gevşemesine, köşelerde açılmalara, montaj zorluklarına, görsel deformasyonlara ve sık bakım ihtiyacına neden olabilir. Bu nedenle doğru fitil seçimi, yalnızca montaj kolaylığı değil, sistemin uzun yıllar sorunsuz çalışması açısından da büyük önem taşır.</p>

<h3>Lightbox Fitili Nedir?</h3>
<p>Lightbox fitili; silikon kenarlı tekstil baskının (SEG - Silicone Edge Graphics) alüminyum profile sabitlenmesini sağlayan teknik ekstrüzyon profilidir. Temel görevi kumaşı profile güvenli şekilde tutmak, homojen gerginlik oluşturmak, montajı kolaylaştırmak ve baskının düzgün görünmesini sağlamaktır.</p>

<h3>Malzeme Seçimi</h3>
<p>Malzeme seçimi fitilin performansını doğrudan etkiler. Doğru malzeme yeterli esnekliğe sahip olmalı, defalarca sökülüp takılabilmeli, kırılmamalı, sertleşmemeli ve baskıyı deforme etmemelidir. Özellikle yoğun kullanılan reklam sistemlerinde elastikiyetini uzun süre koruyabilen teknik hammaddeler tercih edilmelidir.</p>

<h3>Ölçü Toleransı Neden Önemlidir?</h3>
<p>Lightbox fitilleri milimetrik ölçülerle çalışan sistemlerdir. Fitilin ölçüsündeki çok küçük sapmalar bile kumaşın gevşemesine, profile tam oturmamasına, montaj sırasında zorlanmaya ve baskının dalgalı görünmesine neden olabilir. Bu nedenle üretimde ölçü toleranslarının kontrol altında tutulması büyük önem taşır.</p>

<h3>Sertlik (Shore) Değeri</h3>
<p>Fitilin sertliği de performansı belirleyen önemli kriterlerden biridir. Çok sert fitiller montajı zorlaştırabilir ve kumaşa zarar verebilir. Çok yumuşak fitiller ise zamanla gevşeyebilir ve baskının profile tutunmasını zorlaştırabilir. Bu nedenle kullanım alanına uygun sertlik değeri belirlenmelidir.</p>

<h3>UV Dayanımı</h3>
<p>Outdoor uygulamalarda güneş ışınları fitilin ömrünü doğrudan etkiler. Yetersiz UV dayanımı bulunan ürünlerde renk değişimi, sertleşme, çatlama ve elastikiyet kaybı görülebilir. Dış mekân uygulamalarında UV dayanımı yüksek hammaddeler tercih edilmesi uzun ömürlü kullanım sağlar.</p>

<h3>Renk Seçimi</h3>
<p>Lightbox fitilleri genellikle beyaz, siyah, gri ve şeffaf renklerde üretilmektedir. Renk seçimi yalnızca estetik değil, uygulamanın görünürlüğü açısından da önemlidir. Özellikle aydınlatmalı sistemlerde doğru renk seçimi ışık dağılımını ve görsel bütünlüğü olumlu etkileyebilir.</p>

<h3>Montaj Kolaylığı</h3>
<p>İyi tasarlanmış bir fitil kumaşın kolay takılmasını, gerektiğinde sökülmesini ve tekrar kullanılabilmesini sağlamalıdır. Bu özellik hem montaj süresini azaltır hem de servis maliyetlerini düşürür.</p>

<h3>Sık Yapılan Hatalar</h3>
<ul>
<li>Sadece fiyat odaklı ürün seçmek</li>
<li>Ölçü toleranslarını dikkate almamak</li>
<li>Uygun olmayan sertlikte fitil kullanmak</li>
<li>UV dayanımını göz ardı etmek</li>
<li>Profil ile uyumlu olmayan fitil tercih etmek</li>
</ul>
<p>Bu hatalar ürün performansını olumsuz etkileyebilir ve bakım maliyetlerini artırabilir.</p>

<h3>Doğru Lightbox Fitili Nasıl Seçilir?</h3>
<p>Seçim yapılırken aşağıdaki kriterler birlikte değerlendirilmelidir: kullanılan alüminyum profil sistemi, kumaş kalınlığı, iç veya dış mekân uygulaması, UV dayanımı ihtiyacı, sertlik değeri, ölçü toleransları, montaj sıklığı ve uzun dönem performans beklentisi. Her proje farklı olduğu için tek tip çözüm yerine uygulamaya uygun profil tercih edilmelidir.</p>

<h3>Sonuç</h3>
<p>Lightbox sistemlerinde kaliteli baskı kadar doğru fitil seçimi de büyük önem taşır. Doğru malzeme, uygun sertlik, hassas ölçü toleransı ve profil uyumu sayesinde sistemler uzun yıllar ilk günkü performansını koruyabilir. Bu nedenle fitil seçimi yalnızca ürün tercihi değil, aynı zamanda sistem performansını doğrudan etkileyen teknik bir karardır.</p>

<h3>CNR SEAL Uzman Görüşü</h3>
<p>Her Lightbox sistemi aynı ölçü ve profile sahip değildir. Bu nedenle doğru fitil seçimi yalnızca katalog ölçülerine göre değil, kullanılacak profil sistemi, kumaş tipi ve uygulama şartları birlikte değerlendirilerek yapılmalıdır.</p>
<p>CNR SEAL olarak standart Lightbox fitillerinin yanı sıra, farklı profil sistemlerine uygun özel kesit çözümleri de geliştiriyor; yüksek ölçü hassasiyeti ve kalite odaklı üretim anlayışımızla reklam ve görsel iletişim sektörüne güvenilir teknik çözümler sunuyoruz.</p>
`.trim(),
    contentEn: `
<p>Lightbox systems used in illuminated signage, fabric-tensioning frames and LED lightbox letters stand out both for their aesthetics and for their long, trouble-free service. One of the most important components — often overlooked but directly affecting performance — is the lightbox seal.</p>
<p>The wrong seal causes fabric to slacken, corners to open, difficult installation, visual deformation and frequent maintenance. Choosing the right seal is not just about installation ease but about many years of reliable operation.</p>

<h3>What Is a Lightbox Seal?</h3>
<p>The lightbox seal is a technical extrusion profile that secures silicone-edged textile prints (SEG) into an aluminum frame. Its role is to hold the fabric safely, create uniform tension, ease installation and keep the print looking flat.</p>

<h3>Material Selection</h3>
<p>Material choice directly shapes performance. It must offer enough flex, tolerate repeated install/remove cycles, not crack or stiffen and not deform the print. For high-use installations, technical materials that keep their elasticity over time should be preferred.</p>

<h3>Why Dimensional Tolerance Matters</h3>
<p>Lightbox seals work at millimeter scale. Small dimensional deviations cause fabric to slacken, poor seating in the profile, harder installation and wavy prints. Keeping tolerances under control in production is critical.</p>

<h3>Hardness (Shore)</h3>
<p>Too-hard seals complicate installation and can damage fabric; too-soft seals slacken over time and struggle to hold the print. Choose Shore based on the actual application.</p>

<h3>UV Resistance</h3>
<p>Outdoors, sunlight directly drives seal life. Poor UV resistance leads to color shift, stiffening, cracking and loss of elasticity. Outdoor installations demand UV-resistant materials.</p>

<h3>Color Options</h3>
<p>Common colors are white, black, gray and translucent. Color is not only aesthetic — in illuminated systems it affects light spread and visual consistency.</p>

<h3>Installation Ease</h3>
<p>A well-designed seal enables easy fabric install, removal and reuse. This reduces install time and service cost.</p>

<h3>Common Mistakes</h3>
<ul>
<li>Choosing only on price</li>
<li>Ignoring dimensional tolerances</li>
<li>Using seals of the wrong hardness</li>
<li>Overlooking UV resistance</li>
<li>Picking seals incompatible with the profile</li>
</ul>

<h3>How to Choose the Right Lightbox Seal</h3>
<p>Evaluate together: the aluminum profile system, fabric thickness, indoor/outdoor use, UV requirement, hardness, dimensional tolerance, install frequency and long-term performance expectations. Every project is different — pick the profile that fits the application, not a one-size-fits-all product.</p>

<h3>Conclusion</h3>
<p>In lightbox systems, the right seal is as important as the print quality. Correct material, hardness, tolerance and profile fit keep the system performing like day one for years — the seal choice is a technical decision, not just a product preference.</p>

<h3>CNR SEAL Expert View</h3>
<p>No two lightbox systems have the same dimensions and profile. The right choice comes from evaluating the profile system, fabric type and application conditions together — not just catalog dimensions.</p>
<p>Beyond standard lightbox seals, we develop custom cross-sections for different profile systems and — with our high dimensional precision and quality-focused approach — deliver reliable technical solutions for advertising and visual communication.</p>
`.trim(),
  },
  {
    slug: "sisme-bot-fitillerinde-yapistirma-yontemleri",
    category: "uygulama-rehberleri",
    sortOrder: 40,
    readingTime: 6,
    titleTr: "Şişme Bot Fitillerinde Yapıştırma Yöntemleri ve Doğru Malzeme Seçimi",
    titleEn: "Bonding Methods and Correct Material Selection for Inflatable Boat Seals",
    excerptTr:
      "Şişme bot fitillerinde kullanılan yapıştırma yöntemleri nelerdir? PVC ve Hypalon botlarda doğru yapıştırıcı seçimi, yüzey hazırlığı ve uygulama teknikleri hakkında kapsamlı rehber.",
    excerptEn:
      "Which bonding methods work for inflatable boat seals? A comprehensive guide to adhesive selection, surface prep and application technique for PVC and Hypalon boats.",
    contentTr: `
<p>Şişme botlarda kullanılan fitiller yalnızca estetik amaçlı değildir. Gövde birleşimlerinin korunması, darbelere karşı dayanımın artırılması ve uzun ömürlü kullanım açısından önemli bir görev üstlenir. Ancak en kaliteli fitil bile doğru uygulanmadığında zamanla ayrılabilir, kenarlardan açılabilir veya suya ve güneş ışınlarına karşı dayanımını kaybedebilir.</p>
<p>Başarılı bir uygulama yalnızca doğru yapıştırıcı seçimine değil; bot kumaşı, fitil malzemesi, yüzey hazırlığı ve uygulama yönteminin birlikte değerlendirilmesine bağlıdır.</p>

<h3>Şişme Bot Fitili Nedir?</h3>
<p>Şişme bot fitilleri; bot gövdesinin birleşim bölgelerini korumak, sürtünmeye karşı dayanım sağlamak ve estetik görünüm kazandırmak amacıyla kullanılan teknik ekstrüzyon profilleridir. Kullanım alanına göre farklı kesitlerde ve farklı hammaddelerle üretilebilir. Kaliteli bir fitil darbelere karşı dayanıklı olmalı, esnekliğini uzun süre korumalı, deniz suyu ve UV ışınlarından etkilenmemeli ve yapıştırıldığı yüzeyle uyumlu çalışmalıdır.</p>

<h3>Yapıştırma Sistemlerinde En Önemli Kriter: Malzeme Uyumu</h3>
<p>Yapıştırma işleminin başarısını belirleyen ilk unsur, bot kumaşı ile fitilin aynı teknik özelliklere uygun olmasıdır. Örneğin PVC esaslı bir botta kullanılan fitilin ve yapıştırıcının da PVC sistemine uygun olması gerekir. Farklı malzeme gruplarının birlikte kullanılması, yapışma mukavemetini olumsuz etkileyebilir.</p>

<h3>Yüzey Hazırlığı Neden Önemlidir?</h3>
<p>Yapıştırma öncesinde yüzey hazırlığı en az yapıştırıcı kadar önemlidir. Yüzeyde bulunan toz, yağ, silikon kalıntıları, nem ve eski yapıştırıcı kalıntıları yapışma performansını önemli ölçüde azaltabilir. Temiz, kuru ve uygulamaya uygun şekilde hazırlanmış yüzeyler çok daha güçlü ve uzun ömürlü sonuçlar verir.</p>

<h3>Doğru Yapıştırıcı Seçimi</h3>
<p>Şişme bot sektöründe kullanılan yapıştırıcılar uygulama alanına göre farklılık gösterebilir. Yapıştırıcı seçilirken bot kumaşının yapısı, fitilin hammaddesi, kullanım ortamı, esneklik ihtiyacı, deniz suyu dayanımı ve UV dayanımı birlikte değerlendirilmelidir. Doğru yapıştırıcı seçimi kadar üreticinin önerdiği uygulama talimatlarına uyulması da büyük önem taşır.</p>

<h3>Uygulama Sırasında Dikkat Edilmesi Gerekenler</h3>
<ul>
<li>Yüzey tamamen temizlenmelidir</li>
<li>Uygulama ortamı uygun sıcaklıkta olmalıdır</li>
<li>Yapıştırıcı eşit kalınlıkta uygulanmalıdır</li>
<li>Kuruma sürelerine uyulmalıdır</li>
<li>Fitil doğru konumlandırılmalıdır</li>
<li>Uygulama sonrası yeterli baskı uygulanmalıdır</li>
</ul>

<h3>Deniz Suyu ve UV Dayanımı</h3>
<p>Şişme botlar sürekli olarak güneş ışınlarına, tuzlu suya, nemli ortama ve sıcaklık değişimlerine maruz kalmaktadır. Bu nedenle hem fitilin hem de kullanılan yapıştırma sisteminin dış ortam koşullarına uygun olması gerekir. Uygun olmayan malzemeler zamanla sertleşebilir, renk değiştirebilir veya yüzeyden ayrılabilir.</p>

<h3>En Sık Karşılaşılan Problemler</h3>
<ul>
<li>Kenarlardan açılma</li>
<li>Yapışmanın zamanla zayıflaması</li>
<li>UV nedeniyle sertleşme</li>
<li>Deniz suyuna bağlı deformasyon</li>
<li>Fitilin gövdeden ayrılması</li>
<li>Uygulama sırasında hizalama hataları</li>
</ul>
<p>Bu problemlerin büyük bölümü doğru malzeme seçimi ve uygun uygulama yöntemiyle önlenebilir.</p>

<h3>Doğru Fitil Seçimi Yapıştırma Performansını Etkiler</h3>
<p>Birçok kullanıcı yapışma problemlerinin yalnızca yapıştırıcıdan kaynaklandığını düşünmektedir. Oysa fitilin kesit tasarımı, esnekliği, sertlik değeri, hammaddesi ve üretim kalitesi de yapıştırma performansını doğrudan etkileyen unsurlardır. Bu nedenle ürün ve uygulama birlikte değerlendirilmelidir.</p>

<h3>Sonuç</h3>
<p>Şişme bot fitillerinde uzun ömürlü ve güvenilir bir uygulama elde etmek için yalnızca kaliteli bir yapıştırıcı kullanmak yeterli değildir. Bot kumaşı, fitil malzemesi, yüzey hazırlığı, uygulama yöntemi ve çevresel koşullar birlikte değerlendirilerek doğru sistem oluşturulmalıdır. Başarılı sonuç; doğru ürünlerin doğru uygulama yöntemiyle buluşturulmasıyla elde edilir.</p>

<h3>CNR SEAL Uzman Görüşü</h3>
<p>Şişme bot uygulamalarında her proje farklı teknik gerekliliklere sahiptir. Kullanılan kumaş türü, çalışma koşulları ve uygulama yöntemi doğru değerlendirilmeden yapılacak ürün seçimi uzun vadede performans sorunlarına yol açabilir.</p>
<p>CNR SEAL olarak PVC esaslı şişme bot fitilleri başta olmak üzere farklı uygulamalara uygun teknik ekstrüzyon profilleri geliştiriyor; doğru malzeme seçimi ve üretim yaklaşımıyla uzun ömürlü, güvenilir ve uygulamaya uygun çözümler sunuyoruz.</p>
`.trim(),
    contentEn: `
<p>Seals on inflatable boats are more than decorative. They protect hull seams, add impact resistance and extend service life. But even the highest-quality seal can lift, open at the edges, or lose its resistance to seawater and UV if it is not applied correctly.</p>
<p>A successful bond depends not only on adhesive selection, but on evaluating the boat fabric, seal material, surface prep and application method together.</p>

<h3>What Is an Inflatable Boat Seal?</h3>
<p>These are technical extrusion profiles used to protect hull seams, add abrasion resistance and improve the look. They come in different cross-sections and materials depending on the application. A quality seal is impact-resistant, keeps its elasticity, resists seawater and UV, and is compatible with the bonded surface.</p>

<h3>The Most Important Bonding Criterion: Material Compatibility</h3>
<p>Success starts with the boat fabric and seal sharing compatible technical properties. On a PVC boat, both seal and adhesive must be PVC-compatible. Mixing incompatible material groups weakens bond strength.</p>

<h3>Why Surface Prep Matters</h3>
<p>Prep is at least as important as the adhesive itself. Dust, oil, silicone residue, moisture or old adhesive on the surface will drop bond performance significantly. Clean, dry, correctly prepared surfaces give far stronger, longer-lasting results.</p>

<h3>Choosing the Right Adhesive</h3>
<p>Adhesives vary by application. When choosing one, evaluate the fabric structure, seal material, environment, flexibility requirement, seawater resistance and UV resistance together. Following the manufacturer's application instructions is as important as picking the right adhesive.</p>

<h3>During Application</h3>
<ul>
<li>Fully clean the surface</li>
<li>Work in a suitable ambient temperature</li>
<li>Apply the adhesive in an even film</li>
<li>Respect cure times</li>
<li>Position the seal precisely</li>
<li>Apply adequate pressure after bonding</li>
</ul>

<h3>Seawater and UV Resistance</h3>
<p>Inflatables live under sun, salt water, humidity and temperature swings. Both the seal and the bonding system must handle outdoor conditions. Unsuitable materials stiffen, discolor or separate over time.</p>

<h3>Most Common Problems</h3>
<ul>
<li>Edge lifting</li>
<li>Weakening bond over time</li>
<li>UV stiffening</li>
<li>Seawater-driven deformation</li>
<li>Seal separation from the hull</li>
<li>Alignment errors during application</li>
</ul>
<p>Most of these are preventable with the right material and application method.</p>

<h3>The Right Seal Choice Affects Bonding Too</h3>
<p>Many users blame the adhesive alone for bond failures. In reality, the seal's cross-section, elasticity, hardness, material and production quality also directly affect bond performance. Product and application must be evaluated together.</p>

<h3>Conclusion</h3>
<p>Long-lasting bonding on inflatable boat seals is not just about a quality adhesive. Fabric, seal material, surface prep, application method and environment must be evaluated as a system. Good results come from the right products applied with the right technique.</p>

<h3>CNR SEAL Expert View</h3>
<p>Every inflatable boat project has different technical requirements. Choosing a product without properly evaluating fabric type, operating conditions and application method leads to performance issues over time.</p>
<p>At CNR SEAL we develop technical extrusion profiles for a range of applications — with PVC-based inflatable boat seals in the lead — and, through correct material selection and a strong production approach, deliver long-lasting, reliable, application-fit solutions.</p>
`.trim(),
  },
  {
    slug: "otomatik-kepenk-fitili-secerken-dikkat-edilecekler",
    category: "uygulama-rehberleri",
    sortOrder: 50,
    readingTime: 6,
    titleTr: "Otomatik Kepenk Fitili Seçerken Dikkat Edilmesi Gerekenler",
    titleEn: "What to Consider When Choosing an Automatic Shutter Seal",
    excerptTr:
      "Otomatik kepenk fitili seçerken nelere dikkat edilmelidir? PVC, TPE ve diğer teknik fitil seçenekleri, ölçü toleransları, dayanıklılık ve uzun ömürlü kullanım hakkında kapsamlı rehber.",
    excerptEn:
      "What to consider when choosing a shutter seal — PVC, TPE and other technical options, dimensional tolerances, durability and long-term use.",
    contentTr: `
<p>Otomatik kepenk sistemleri; mağazalar, fabrikalar, depolar, garajlar ve endüstriyel tesislerde güvenlik, yalıtım ve kullanım kolaylığı sağlayan önemli yapı elemanlarıdır. Bu sistemlerin uzun ömürlü ve sorunsuz çalışabilmesi yalnızca motor, ray veya kepenk profillerine bağlı değildir. Kullanılan kepenk fitilleri de sistem performansını doğrudan etkileyen önemli bileşenler arasında yer alır.</p>
<p>Doğru seçilmeyen bir fitil gereksiz ses oluşmasına, sürtünmenin artmasına, ray sisteminde aşınmaya, su ve toz girişine ve erken deformasyona neden olabilir. Bu nedenle kepenk fitili seçimi yalnızca ölçüye göre değil; kullanım koşullarına ve sistem özelliklerine göre yapılmalıdır.</p>

<h3>Kepenk Fitilinin Görevi Nedir?</h3>
<ul>
<li>Ray içerisinde sürtünmeyi azaltır</li>
<li>Hareket sırasında oluşan sesi minimum seviyeye indirir</li>
<li>Toz ve su girişini azaltmaya yardımcı olur</li>
<li>Kepenk profilini darbelere karşı korur</li>
<li>Sistemin daha sessiz ve dengeli çalışmasını destekler</li>
</ul>
<p>Doğru tasarlanmış bir fitil hem kullanıcı konforunu artırır hem de kepenk sisteminin servis ömrünü uzatır.</p>

<h3>Doğru Malzeme Seçimi</h3>
<p>Kepenk fitilinin performansını belirleyen en önemli unsurlardan biri kullanılan hammaddedir. Malzeme seçimi yapılırken iç veya dış ortam kullanımı, günlük açma-kapama sayısı, UV ışınlarına maruz kalma, yağmur ve nem, sıcaklık değişimleri gibi faktörler dikkate alınmalıdır. Uygulama şartlarına uygun malzeme seçimi, fitilin uzun yıllar elastikiyetini korumasını sağlar.</p>

<h3>Ölçü Toleransları Neden Önemlidir?</h3>
<p>Kepenk sistemlerinde fitilin ray içerisine tam uyum sağlaması gerekir. Yetersiz ölçü hassasiyeti fitilin raydan çıkmasına, gereğinden fazla sürtünmeye, gürültülü çalışmaya ve hızlı aşınmaya neden olabilir. Bu nedenle üretimde ölçü toleranslarının kontrol altında tutulması büyük önem taşır.</p>

<h3>Sertlik Değeri (Shore)</h3>
<p>Fitilin sertliği kullanım performansını doğrudan etkiler. Çok sert fitiller hareket direncini artırabilir ve sürtünmeyi yükseltebilir. Çok yumuşak fitiller ise zamanla ezilebilir ve ray içerisinde deformasyona uğrayabilir. Bu nedenle uygulamaya uygun sertlik değerinin belirlenmesi gerekir.</p>

<h3>UV ve Dış Ortam Dayanımı</h3>
<p>Dış ortamda kullanılan otomatik kepenk sistemleri güneş ışınlarına, yağmura, toza ve nem değişimlerine sürekli maruz kalır. Yüksek UV dayanımına sahip hammaddeler kullanılması, fitilin uzun süre formunu ve elastikiyetini korumasına yardımcı olur.</p>

<h3>Sürtünme ve Sessiz Çalışma</h3>
<p>Kaliteli bir kepenk fitili yalnızca koruma sağlamaz. Aynı zamanda sessiz çalışma, düşük sürtünme ve dengeli hareket özellikleriyle motor ve mekanik sistem üzerindeki yükün azalmasına katkı sağlar. Bu durum hem enerji verimliliğini hem de sistem ömrünü olumlu yönde etkiler.</p>

<h3>Sık Yapılan Hatalar</h3>
<ul>
<li>Yalnızca fiyat odaklı seçim yapmak</li>
<li>Ölçü uyumluluğunu kontrol etmemek</li>
<li>Dış ortam uygulamalarında UV dayanımını dikkate almamak</li>
<li>Sisteme uygun olmayan sertlikte fitil kullanmak</li>
<li>Kalitesiz hammaddeden üretilmiş ürünleri tercih etmek</li>
</ul>

<h3>Kepenk Fitili Seçerken Kontrol Edilmesi Gerekenler</h3>
<p>Doğru seçim için: kullanılan kepenk profil sistemi, ray ölçüleri, günlük kullanım yoğunluğu, iç veya dış ortam uygulaması, UV dayanımı, sertlik değeri, ölçü toleransları, kullanılan hammadde ve uzun dönem bakım maliyetleri birlikte değerlendirilmelidir.</p>

<h3>Sonuç</h3>
<p>Otomatik kepenk fitilleri küçük bir parça gibi görünse de sistemin güvenli, sessiz ve uzun ömürlü çalışmasında önemli rol oynar. Doğru malzeme, uygun sertlik, hassas ölçü toleransları ve kaliteli üretim sayesinde bakım maliyetleri azalırken sistem performansı önemli ölçüde artar. Fitil seçimi yalnızca ürün tercihi değil; kepenk sisteminin uzun vadeli performansına yapılan teknik bir yatırımdır.</p>

<h3>CNR SEAL Uzman Görüşü</h3>
<p>Her otomatik kepenk sistemi farklı profil ölçülerine ve çalışma koşullarına sahiptir. Bu nedenle doğru fitil seçimi yalnızca kesit ölçülerine göre değil; sistemin kullanım yoğunluğu, çevresel koşullar ve mekanik gereksinimleri birlikte değerlendirilerek yapılmalıdır.</p>
<p>CNR SEAL olarak otomatik kepenk sistemleri için standart ve özel kesit teknik fitiller geliştiriyor; doğru hammadde seçimi, hassas üretim ve uygulamaya uygun çözümlerle uzun ömürlü ve güvenilir performans sunuyoruz.</p>
`.trim(),
    contentEn: `
<p>Automatic shutter systems provide security, insulation and ease of use in stores, factories, warehouses, garages and industrial facilities. Long, trouble-free service isn't just about the motor, tracks or slats — the shutter seals are a component that directly affects overall performance.</p>
<p>The wrong seal causes excess noise, higher friction, wear in the track, water and dust ingress, and premature deformation. Choose the seal based on operating conditions and system characteristics — not dimensions alone.</p>

<h3>What the Shutter Seal Does</h3>
<ul>
<li>Reduces friction inside the track</li>
<li>Minimises motion noise</li>
<li>Helps limit dust and water ingress</li>
<li>Protects the shutter profile against impact</li>
<li>Supports quieter, more balanced operation</li>
</ul>
<p>A well-designed seal improves user comfort and extends the shutter's service life.</p>

<h3>Material Selection</h3>
<p>The raw material is one of the most decisive factors on seal performance. Indoor or outdoor use, daily open/close cycles, UV exposure, rain and moisture, temperature swings — all should be considered. Application-fit material keeps the seal elastic for many years.</p>

<h3>Why Dimensional Tolerances Matter</h3>
<p>The seal must fit precisely into the track. Insufficient precision leads to the seal coming out of the track, excess friction, noisy operation and fast wear. Keeping tolerances under control in production is critical.</p>

<h3>Hardness (Shore)</h3>
<p>Too-hard seals raise resistance and friction. Too-soft seals crush over time and deform in the track. Match Shore to the application.</p>

<h3>UV and Weather Resistance</h3>
<p>Outdoor systems are exposed to sun, rain, dust and moisture. High UV resistance helps the seal keep shape and elasticity for years.</p>

<h3>Friction and Quiet Operation</h3>
<p>A quality seal doesn't only protect — it delivers quiet operation, low friction and balanced movement, reducing the load on the motor and mechanics. This improves both energy efficiency and system life.</p>

<h3>Common Mistakes</h3>
<ul>
<li>Choosing only on price</li>
<li>Not checking dimensional compatibility</li>
<li>Ignoring UV resistance outdoors</li>
<li>Using the wrong hardness for the system</li>
<li>Selecting products made from low-quality raw materials</li>
</ul>

<h3>What to Check When Choosing</h3>
<p>Evaluate together: shutter profile system, track dimensions, daily usage intensity, indoor/outdoor use, UV resistance, hardness, dimensional tolerances, raw material and long-term maintenance cost.</p>

<h3>Conclusion</h3>
<p>Shutter seals may look like a small part, but they play a big role in safe, quiet, long-lasting operation. The right material, hardness, tolerance and production quality reduce maintenance and significantly improve performance. The seal is a technical investment in the shutter's long-term performance, not just a product choice.</p>

<h3>CNR SEAL Expert View</h3>
<p>Every automatic shutter system has different profile dimensions and operating conditions. Choose the right seal by evaluating usage intensity, environment and mechanical requirements together — not just cross-sections.</p>
<p>At CNR SEAL we develop both standard and custom-cross-section technical seals for shutter systems — and, through correct material selection, precise production and application-fit solutions, deliver long-lasting, reliable performance.</p>
`.trim(),
  },

  // ============================================================
  // ÜRETİM TEKNOLOJİLERİ
  // ============================================================
  {
    slug: "kalip-tasariminin-urun-performansina-etkisi",
    category: "uretim-teknolojileri",
    sortOrder: 60,
    readingTime: 7,
    titleTr: "Kalıp Tasarımının Ürün Performansına Etkisi",
    titleEn: "How Mold Design Affects Product Performance",
    excerptTr:
      "Ekstrüzyon profil üretiminde kalıp tasarımının ürün performansına etkisini keşfedin. Doğru kalıp tasarımı, ölçü hassasiyeti, üretim kalitesi ve uzun ömürlü ürünler için neden kritik öneme sahiptir?",
    excerptEn:
      "Why mold design is critical in extrusion — its role in dimensional precision, production quality and long-lasting products.",
    contentTr: `
<p>Teknik fitil ve ekstrüzyon profili üretiminde kaliteli bir ürün elde etmek yalnızca doğru hammadde kullanımıyla mümkün değildir. Ürünün performansını belirleyen en önemli unsurlardan biri de kalıp tasarımıdır.</p>
<p>Kalıp; eriyik haldeki hammaddenin istenilen kesit formunu almasını sağlayan üretim ekipmanıdır. Ürünün geometrisi, ölçü hassasiyeti, yüzey kalitesi ve mekanik performansı büyük ölçüde kalıbın tasarımına bağlıdır. Doğru tasarlanmış bir kalıp, üretim sürecini kolaylaştırırken ürünün kalite standartlarını da sürdürülebilir hale getirir.</p>

<h3>Kalıp Tasarımı Neden Bu Kadar Önemlidir?</h3>
<p>Bir ekstrüzyon profilinin üretim süreci kalıpta başlar. Kalıp tasarımında yapılan küçük bir hata bile ölçü sapmalarına, profil deformasyonuna, yüzey bozukluklarına, dengesiz et kalınlıklarına, üretim hızının düşmesine ve hammadde israfına neden olabilir.</p>

<h3>Profil Geometrisi</h3>
<p>Her profil farklı bir kullanım amacı için tasarlanır. Kalıp tasarımı hazırlanırken profilin kesit yapısı, et kalınlığı, esneklik ihtiyacı, montaj şekli ve çalışma koşulları birlikte değerlendirilmelidir. Doğru geometri, ürünün hem üretimini kolaylaştırır hem de kullanım performansını artırır.</p>

<h3>Malzeme Akışının Dengelenmesi</h3>
<p>Ekstrüzyon üretiminde eriyik hammadde kalıp içerisinde belirli kanallar boyunca ilerler. Bu akışın dengeli olmaması ölçü değişimlerine, eğrilik oluşmasına, dalgalı yüzeylere ve profilin formunu kaybetmesine neden olabilir.</p>

<h3>Ölçü Toleransları</h3>
<p>Ekstrüzyon profillerinde milimetrik ölçüler kritik öneme sahiptir. Kalıbın doğru tasarlanmaması profilin raya oturmamasına, sızdırmazlığın azalmasına, montaj problemlerine ve kullanım performansının düşmesine sebep olabilir. Doğru kalıp tasarımı sayesinde üretim boyunca ölçü toleransları korunabilir.</p>

<h3>Et Kalınlığının Önemi</h3>
<p>Bir profilin her noktasındaki et kalınlığı aynı performansı göstermeyebilir. Gereğinden ince bölgeler kopmalara, esneme kayıplarına ve dayanım problemlerine neden olabilir. Gereğinden kalın bölgeler ise fazla hammadde tüketimine, soğuma problemlerine ve üretim hızının düşmesine yol açabilir. Başarılı kalıp tasarımı, et kalınlığını kullanım amacına göre dengeler.</p>

<h3>Kalıp Tasarımı ve Hammadde Birlikte Değerlendirilmelidir</h3>
<p>Aynı kalıp farklı hammaddelerde farklı sonuçlar verebilir. PVC, TPE, TPV veya diğer teknik hammaddelerin akış özellikleri, büzülme oranları, esneklikleri ve işlenme sıcaklıkları birbirinden farklıdır. Bu nedenle kalıp tasarımı hazırlanırken kullanılacak hammadde mutlaka dikkate alınmalıdır.</p>

<h3>Doğru Kalıp Üretim Verimliliğini Artırır</h3>
<p>İyi tasarlanmış bir kalıp yalnızca kaliteli ürün üretmez. Aynı zamanda üretim hızını artırır, fire oranını düşürür, hammadde tüketimini optimize eder, ölçü kararlılığı sağlar ve kalite kontrol süreçlerini kolaylaştırır. Bu da üretim maliyetlerinin düşmesine katkı sağlar.</p>

<h3>Özel Profil Geliştirmede Kalıp Tasarımının Rolü</h3>
<p>Standart ürünlerin dışında geliştirilen özel profillerde kalıp tasarımı çok daha büyük önem taşır. Yeni bir ürün geliştirilirken kullanım amacı, montaj şekli, mekanik yükler, çalışma ortamı ve kullanıcı beklentileri birlikte değerlendirilerek profil tasarlanmalıdır.</p>

<h3>Sık Yapılan Hatalar</h3>
<ul>
<li>Ürünün çalışma koşullarını analiz etmeden tasarıma başlamak</li>
<li>Hammadde özelliklerini dikkate almamak</li>
<li>Gereksiz karmaşık profil tasarımları oluşturmak</li>
<li>Üretim kolaylığını göz ardı etmek</li>
<li>Ölçü toleranslarını yeterince değerlendirmemek</li>
</ul>

<h3>Sonuç</h3>
<p>Ekstrüzyon profil üretiminde kaliteli ürün yalnızca doğru hammaddeyle değil, doğru kalıp tasarımıyla mümkün olur. Kalıp; ürünün ölçü hassasiyetini, montaj kolaylığını, dayanıklılığını ve uzun ömürlü performansını doğrudan etkileyen temel unsurlardan biridir.</p>

<h3>CNR SEAL Uzman Görüşü</h3>
<p>Her teknik profil farklı bir uygulama için geliştirilir. Bu nedenle kalıp tasarımına yalnızca üretim gözüyle değil, ürünün çalışma koşulları ve kullanım amacı doğrultusunda yaklaşmak gerekir.</p>
<p>CNR SEAL olarak teknik çizim veya numuneye göre geliştirilen projelerde; ürünün kullanım alanını analiz ediyor, uygun profil geometrisini belirliyor ve üretim sürecine en uygun kalıp tasarımının oluşturulmasına katkı sağlıyoruz. Amacımız yalnızca istenilen kesiti üretmek değil, uzun yıllar güvenle kullanılabilecek teknik çözümler geliştirmektir.</p>
`.trim(),
    contentEn: `
<p>In technical seals and extrusion profiles, quality doesn't come from raw material alone. One of the most important drivers of product performance is mold design.</p>
<p>The mold is the equipment that shapes molten material into the desired cross-section. Geometry, dimensional precision, surface quality and mechanical performance all depend heavily on the mold. A well-designed mold makes the process easier and keeps quality standards sustainable.</p>

<h3>Why Mold Design Matters</h3>
<p>The production of an extrusion profile begins with the mold. Even small design errors cause dimensional drift, deformation, surface defects, uneven wall thickness, lower line speed and raw material waste.</p>

<h3>Profile Geometry</h3>
<p>Every profile is designed for a specific use. During mold design, evaluate cross-section, wall thickness, flexibility needs, installation method and operating conditions together. Right geometry both eases production and improves in-service performance.</p>

<h3>Balancing Material Flow</h3>
<p>Molten material moves through defined channels inside the mold. Unbalanced flow causes dimensional changes, bowing, wavy surfaces and loss of form.</p>

<h3>Dimensional Tolerances</h3>
<p>Millimeter accuracy matters in extrusion profiles. A poorly designed mold leads to profiles that don't seat in the track, reduced sealing, assembly problems and lower in-service performance. Good mold design keeps tolerances stable across the whole run.</p>

<h3>Wall Thickness</h3>
<p>Not every point of a profile performs the same. Areas that are too thin cause tears, loss of springback and durability issues. Areas that are too thick cause excess raw material use, cooling problems and slower production. Good mold design balances wall thickness to the intended use.</p>

<h3>Mold and Raw Material — Evaluated Together</h3>
<p>The same mold behaves differently with different materials. PVC, TPE, TPV and other technical materials have different flow, shrinkage, elasticity and processing temperatures. The chosen material must be part of the mold design.</p>

<h3>The Right Mold Boosts Production Efficiency</h3>
<p>A good mold doesn't only produce good parts. It raises line speed, reduces scrap, optimises material use, stabilises dimensions and simplifies QC — lowering unit cost.</p>

<h3>Mold Design in Custom Profiles</h3>
<p>On custom (non-catalog) profiles, mold design matters even more. When developing a new product, consider intended use, installation, mechanical loads, environment and user expectations together during design.</p>

<h3>Common Mistakes</h3>
<ul>
<li>Starting the design without analysing operating conditions</li>
<li>Ignoring raw material properties</li>
<li>Creating unnecessarily complex geometries</li>
<li>Overlooking production ease</li>
<li>Not sufficiently evaluating tolerances</li>
</ul>

<h3>Conclusion</h3>
<p>Quality in extrusion is only possible with both the right material and the right mold. The mold directly shapes dimensional precision, ease of assembly, durability and long-term performance.</p>

<h3>CNR SEAL Expert View</h3>
<p>Every technical profile is developed for a different application. Mold design must consider not just production, but the product's operating conditions and intended use.</p>
<p>On custom projects developed from a technical drawing or sample, we analyse the application, determine the right profile geometry, and contribute to the creation of a mold design best matched to the production process. Our aim is not only to produce the requested cross-section, but to deliver technical solutions that can be trusted for many years.</p>
`.trim(),
  },

  // ============================================================
  // SATIN ALMA REHBERLERİ
  // ============================================================
  {
    slug: "teknik-fitil-satin-alirken-10-soru",
    category: "satin-alma-rehberleri",
    sortOrder: 70,
    readingTime: 7,
    titleTr: "Teknik Fitil Satın Alırken Sorulması Gereken 10 Soru",
    titleEn: "10 Questions to Ask Before Buying Technical Seals",
    excerptTr:
      "Teknik fitil satın almadan önce hangi sorular sorulmalıdır? Malzeme seçimi, ölçü toleransları, üretim kalitesi ve teknik destek hakkında bilinmesi gereken 10 önemli kriter.",
    excerptEn:
      "The 10 questions to ask before buying technical seals — covering material selection, tolerances, production quality and technical support.",
    contentTr: `
<p>Teknik fitiller, birçok üretim sisteminde küçük bir parça gibi görünse de ürün performansı üzerinde büyük etkiye sahiptir. Yanlış seçilen bir fitil; montaj problemlerine, sızdırmazlık kayıplarına, üretim duruşlarına ve gereksiz maliyetlere neden olabilir.</p>
<p>Bu nedenle satın alma sürecinde yalnızca fiyat karşılaştırması yapmak yerine, ürünün teknik yeterliliğini ve tedarikçinin sağlayacağı desteği de değerlendirmek gerekir. Aşağıdaki sorular, doğru ürünü ve doğru iş ortağını seçmenize yardımcı olacaktır.</p>

<h3>1. Kullanılacak Hammadde Uygulamama Uygun mu?</h3>
<p>Her teknik fitil aynı hammaddeden üretilmez. PVC, TPE, TPV ve EPDM gibi farklı malzemeler farklı çalışma koşulları için geliştirilmiştir. İlk sorulması gereken soru: "Bu ürün benim uygulamam için neden uygun?" Doğru tedarikçi bu soruya teknik gerekçeleriyle cevap verebilmelidir.</p>

<h3>2. Ürün Teknik Çizime veya Numuneye Uygun Üretilebiliyor mu?</h3>
<p>Her üretim hattı standart ürünlerle çalışmayabilir. Bazı uygulamalarda teknik çizime göre, numuneye göre veya özel ölçülerde üretim gerekebilir. Tedarikçinin bu konuda çözüm sunabilmesi önemli bir avantajdır.</p>

<h3>3. Ölçü Toleransları Nasıl Kontrol Ediliyor?</h3>
<p>Birkaç ondalık milimetrelik ölçü farkı bile ürün performansını etkileyebilir. "Üretimde ölçü hassasiyeti nasıl sağlanıyor?" Tutarlı üretim yapan firmalar, kalite kontrol süreçleriyle bu konuda güven verir.</p>

<h3>4. Kullanılan Hammadde Kalitesi Sürekli Aynı mı?</h3>
<p>İlk sipariş ile sonraki siparişlerin aynı performansı göstermesi büyük önem taşır. "Her üretimde aynı kalite standardını nasıl koruyorsunuz?" Süreklilik, teknik ürünlerde en önemli kriterlerden biridir.</p>

<h3>5. Özel Profil veya Yeni Ürün Geliştirme Desteği Sunuyor musunuz?</h3>
<p>İhtiyaçlar zaman içinde değişebilir. Standart ürünlerin yeterli olmadığı durumlarda tedarikçinin profil geliştirme, kalıp tasarımı ve numune üretimi gibi süreçlerde destek sağlayabilmesi uzun vadede önemli avantaj sağlar.</p>

<h3>6. Üretim ve Teslimat Süreçlerini Nasıl Yönetiyorsunuz?</h3>
<p>Ürün kalitesi kadar teslimat planlaması da önemlidir. Geciken teslimatlar üretim duruşlarına, iş programlarının aksamasına ve ek maliyetlere neden olabilir. Teslimat planlaması ve üretim organizasyonu hakkında bilgi almak faydalıdır.</p>

<h3>7. Teknik Destek Sağlıyor musunuz?</h3>
<p>Bazen sorun ürünün kendisinde değil, uygulama şeklinde olabilir. Yalnızca ürün satan değil, teknik değerlendirme yapabilen firmalar uzun vadede daha fazla değer sağlar.</p>

<h3>8. Referans Verilebilir Uygulamalarınız Var mı?</h3>
<p>Daha önce benzer sektörlerde çalışılmış olması önemli bir güven göstergesidir. Referanslar tecrübeyi, üretim kabiliyetini ve sektör bilgisini gösterir.</p>

<h3>9. Sadece Ürün mü Sunuyorsunuz, Yoksa Çözüm de Üretiyor musunuz?</h3>
<p>Her teknik problem yeni bir ürün gerektirmez. Bazen doğru hammadde seçimi, bazen profil geometrisinin değiştirilmesi, bazen de farklı bir üretim yaklaşımı daha doğru sonuç verebilir. Teknik değerlendirme yapabilen firmalar, yalnızca ürün sağlayan firmalara göre daha fazla katma değer sunar.</p>

<h3>10. Uzun Vadeli Bir İş Birliği Kurabilir miyiz?</h3>
<p>Satın alma süreci yalnızca bugünkü siparişten ibaret değildir. Güvenilir bir tedarikçi ihtiyaç duyduğunuzda ulaşılabilir olmalı, süreç boyunca destek vermeli, yeni projelerde çözüm geliştirebilmeli ve üretim sürekliliğinizi desteklemelidir.</p>

<h3>Teknik Ürün Satın Alırken Fiyat Tek Kriter Olmamalıdır</h3>
<p>Elbette maliyet her satın alma sürecinin önemli bir parçasıdır. Ancak teknik ürünlerde en düşük fiyat her zaman en doğru tercih olmayabilir. Yanlış ürün seçimi üretim kaybına, bakım maliyetlerine, tekrar siparişlere ve müşteri memnuniyetsizliğine neden olabilir. Bu nedenle toplam sahip olma maliyeti her zaman ürün fiyatıyla birlikte değerlendirilmelidir.</p>

<h3>Sonuç</h3>
<p>Teknik fitil satın almak yalnızca bir ürün seçmek değildir. Doğru malzemenin, doğru ölçü toleranslarının ve doğru üretim yaklaşımının bir araya gelmesi; ürün performansını ve üretim verimliliğini doğrudan etkiler. Doğru soruları sormak, yalnızca daha kaliteli bir ürün satın almanızı değil, aynı zamanda uzun vadede güvenilir bir iş ortağıyla çalışmanızı da sağlar.</p>

<h3>CNR SEAL Uzman Görüşü</h3>
<p>Bizce teknik ürünlerde en doğru satın alma kararı, yalnızca fiyat karşılaştırması yapılarak verilmez. Öncelikle uygulamanın ihtiyacı doğru analiz edilmeli; kullanılacak malzeme, profil tasarımı, üretim yöntemi ve teslimat planı birlikte değerlendirilmelidir.</p>
<p>CNR SEAL olarak amacımız yalnızca teknik fitil üretmek değildir. Müşterilerimizin üretim süreçlerini doğru analiz ederek, ihtiyaçlarına en uygun teknik çözümleri geliştirmek ve uzun vadeli, güvene dayalı iş birlikleri kurmaktır.</p>
`.trim(),
    contentEn: `
<p>Technical seals may look like a small part in many production systems, but they have a large impact on product performance. The wrong seal causes installation issues, sealing loss, production downtime and unnecessary cost.</p>
<p>Rather than just comparing price, evaluate the product's technical fit and the supplier's ability to support you. The questions below help you choose the right product — and the right partner.</p>

<h3>1. Is This Material the Right Fit for My Application?</h3>
<p>Not every technical seal uses the same raw material. PVC, TPE, TPV, EPDM are developed for different conditions. Ask: "Why is this the right product for my application?" A good supplier answers with technical reasoning.</p>

<h3>2. Can It Be Produced to a Drawing or Sample?</h3>
<p>Not every line runs only standard products. Some applications need production from a drawing, a sample, or in custom dimensions. A supplier that can support this is a real advantage.</p>

<h3>3. How Are Dimensional Tolerances Controlled?</h3>
<p>Fractions of a millimeter can shift performance. "How do you ensure dimensional accuracy in production?" Consistent suppliers back this with QC processes.</p>

<h3>4. Is Raw Material Quality Consistent Order-to-Order?</h3>
<p>Repeat orders must perform like the first. "How do you keep the same standard each production?" Consistency is one of the most important criteria in technical products.</p>

<h3>5. Do You Support Custom Profiles or New Product Development?</h3>
<p>Needs change over time. When standard products aren't enough, a supplier that supports profile development, mold design and sample production adds real long-term value.</p>

<h3>6. How Do You Manage Production and Delivery?</h3>
<p>Timely delivery is as important as product quality. Late shipments cause downtime, schedule slips and added cost. It's worth asking about production planning and shipment organisation.</p>

<h3>7. Do You Provide Technical Support?</h3>
<p>Sometimes the issue isn't the product but the application. Suppliers that can perform a technical assessment deliver more value than those that only sell products.</p>

<h3>8. Can You Share Reference Applications?</h3>
<p>Past work in similar sectors builds confidence. References demonstrate experience, capability and industry knowledge.</p>

<h3>9. Do You Sell Products Only, or Produce Solutions?</h3>
<p>Not every technical problem needs a new product. Sometimes the right material choice, sometimes a change of geometry, sometimes a different production approach is the better answer. Firms capable of technical assessment add more value than product-only suppliers.</p>

<h3>10. Can We Build a Long-Term Partnership?</h3>
<p>Purchasing is not just about today's order. A trusted supplier is reachable when needed, supports you throughout, develops solutions on new projects and helps sustain your production continuity.</p>

<h3>Price Alone Is Not the Only Criterion</h3>
<p>Cost matters — but the lowest price is not always the right choice in technical products. Wrong choices lead to production loss, maintenance, repeat orders and unhappy customers. Always evaluate total cost of ownership together with unit price.</p>

<h3>Conclusion</h3>
<p>Buying technical seals is not just selecting a product. The right material, tolerances and production approach together drive product performance and production efficiency. Asking the right questions helps you buy a better product — and work with a reliable partner in the long run.</p>

<h3>CNR SEAL Expert View</h3>
<p>The best purchasing decision on technical products is never made only through price comparison. First, the application's needs must be analysed correctly; material, profile design, production method and delivery plan should be evaluated together.</p>
<p>At CNR SEAL our aim is not simply to produce technical seals. It is to analyse our customers' production processes, develop the most suitable technical solutions and build long-term, trust-based partnerships.</p>
`.trim(),
  },
  {
    slug: "dogru-tedarikci-nasil-secilir",
    category: "satin-alma-rehberleri",
    sortOrder: 80,
    readingTime: 6,
    titleTr: "Doğru Tedarikçi Nasıl Seçilir? Güvenilir İş Ortağı İçin 8 Kriter",
    titleEn: "How to Choose the Right Supplier: 8 Criteria for a Reliable Partner",
    excerptTr:
      "Teknik fitil ve ekstrüzyon profilleri için doğru tedarikçi nasıl seçilir? Üretim kapasitesi, teknik destek, kalite, teslimat ve sürdürülebilir iş birliği kriterlerini bu rehberde keşfedin.",
    excerptEn:
      "Choosing the right supplier for technical seals and extrusion profiles — production capacity, technical support, quality, delivery and sustainable partnership criteria.",
    contentTr: `
<p>Teknik fitil ve ekstrüzyon profilleri birçok üretim sürecinde küçük bir parça gibi görünse de, üretim hattının kesintisiz çalışmasında önemli bir rol oynar. Kaliteli bir ürün kadar, o ürünü sağlayan firmanın çalışma anlayışı da uzun vadeli başarı için belirleyicidir.</p>
<p>Çünkü doğru tedarikçi yalnızca sipariş teslim eden firma değil; ihtiyaç duyduğunuzda çözüm üreten, üretim sürecinizi anlayan ve işinizi sahiplenen güvenilir bir iş ortağıdır.</p>

<h3>1. Sadece Ürün Değil, Teknik Bilgi de Sunabiliyor mu?</h3>
<p>Teknik ürünlerde her proje farklı gereksinimlere sahiptir. İyi bir tedarikçi; ürünü tanır, uygulamayı anlamaya çalışır, doğru soruları sorar ve gerekirse farklı çözüm önerileri sunar. Teknik bilgi paylaşabilen firmalar, yalnızca ürün satan firmalara göre çok daha fazla katma değer sağlar.</p>

<h3>2. İhtiyacınızı Dinliyor mu, Yoksa Hazır Ürün mü Öneriyor?</h3>
<p>Her teknik problemin çözümü katalogdaki standart bir ürün olmayabilir. Güvenilir bir iş ortağı, önce ihtiyacınızı anlamaya çalışır; ardından uygulamanıza uygun çözümü önerir. Bu yaklaşım hem doğru ürün seçimini kolaylaştırır hem de gereksiz maliyetlerin önüne geçer.</p>

<h3>3. Özel Üretim ve Proje Geliştirme Kabiliyeti Var mı?</h3>
<p>Üretim süreçleri zaman içinde değişebilir. Standart ürünlerin yeterli olmadığı durumlarda teknik çizime göre üretim, numuneye göre profil geliştirme, kalıp tasarımı ve fason üretim gibi hizmetleri sunabilen firmalar uzun vadede daha güçlü çözüm ortağı olur.</p>

<h3>4. Teslimat Süreçlerini Planlı Yönetiyor mu?</h3>
<p>Kaliteli ürün kadar doğru zamanda teslimat da önemlidir. Üretim hattının durması çoğu zaman ürün maliyetinden çok daha büyük kayıplara neden olabilir. Bu nedenle tedarikçinin üretim planlaması, stok yönetimi ve sevkiyat organizasyonu konularındaki yaklaşımı değerlendirilmelidir.</p>

<h3>5. Kalite Sürekliliği Sağlayabiliyor mu?</h3>
<p>İlk siparişin kaliteli olması tek başına yeterli değildir. Asıl önemli olan aynı ölçü hassasiyeti, aynı hammadde kalitesi ve aynı üretim standardının her siparişte korunabilmesidir. Süreklilik, güvenilir üretimin en önemli göstergelerinden biridir.</p>

<h3>6. Sorun Yaşandığında Ulaşılabilir mi?</h3>
<p>Her üretim sürecinde beklenmedik durumlar yaşanabilir. Önemli olan hatasız olmak değil; sorun oluştuğunda hızlı iletişim kurabilmek ve çözüm üretebilmektir. Ulaşılabilir ve sorumluluk alan firmalar, uzun vadeli iş birliklerinde her zaman avantaj sağlar.</p>

<h3>7. Fiyat Odaklı mı, Çözüm Odaklı mı Çalışıyor?</h3>
<p>En düşük fiyat her zaman en düşük maliyet anlamına gelmez. Yanlış ürün seçimi üretim kayıplarına, fazladan işçiliğe, servis maliyetlerine ve tekrar siparişlere neden olabilir. Doğru tedarikçi yalnızca fiyat teklif etmez; toplam maliyeti düşürecek çözümler geliştirmeye çalışır.</p>

<h3>8. Uzun Vadeli İş Birliğine Bakışı Nasıl?</h3>
<p>Gerçek iş ortaklığı, ilk siparişle başlamaz ve son siparişle bitmez. İyi bir tedarikçi yeni projelerde destek olur, süreçleri birlikte geliştirir, ihtiyaçları önceden öngörmeye çalışır ve güvene dayalı uzun vadeli ilişkiler kurmayı hedefler. Bu yaklaşım hem üretim süreçlerini güçlendirir hem de işletmelere sürdürülebilir bir çalışma modeli sunar.</p>

<h3>Doğru Tedarikçi Seçimi Neden Rekabet Avantajı Sağlar?</h3>
<p>Güvenilir bir iş ortağıyla çalışmak yalnızca ürün temin etmek anlamına gelmez. Aynı zamanda daha az üretim kaybı, daha hızlı çözüm süreçleri, daha istikrarlı kalite, daha planlı üretim, daha düşük toplam maliyet ve daha yüksek müşteri memnuniyeti gibi önemli avantajlar sağlar. İyi bir tedarikçi, işletmenizin verimliliğine doğrudan katkıda bulunur.</p>

<h3>Sonuç</h3>
<p>Teknik fitil ve ekstrüzyon profilleri gibi üretim süreçlerini doğrudan etkileyen ürünlerde doğru tedarikçi seçimi, yalnızca satın alma kararından ibaret değildir. Teknik bilgi, kalite sürekliliği, üretim planlaması, iletişim ve çözüm odaklı yaklaşım birlikte değerlendirildiğinde, işletmeler uzun vadede daha güvenli ve verimli bir çalışma modeli oluşturabilir. Doğru iş ortağı; yalnızca bugün ihtiyaç duyduğunuz ürünü değil, yarın karşılaşabileceğiniz sorunlara da birlikte çözüm üretebilen firmadır.</p>
`.trim(),
    contentEn: `
<p>Technical seals and extrusion profiles may look like small parts in many production processes, but they play a key role in keeping the line running. The supplier's working approach is as important to long-term success as the product itself.</p>
<p>The right supplier is more than a firm that delivers orders — it is a reliable partner that generates solutions when needed, understands your production, and takes ownership of your work.</p>

<h3>1. Do They Offer Technical Knowledge, Not Just Products?</h3>
<p>Every technical project has different requirements. A good supplier knows the product, tries to understand the application, asks the right questions and, when needed, proposes alternative solutions. Firms that share technical knowledge add far more value than product-only vendors.</p>

<h3>2. Do They Listen to Your Need — or Just Push a Standard Product?</h3>
<p>Not every technical problem has a solution in the catalog. A reliable partner listens first, then proposes what fits your application — making it easier to choose the right product and preventing unnecessary cost.</p>

<h3>3. Do They Have Custom Production / Project Development Capability?</h3>
<p>Needs change over time. When standard products fall short, firms that can produce from a drawing, develop profiles from samples, design molds and run contract production make stronger long-term partners.</p>

<h3>4. Do They Manage Delivery With Planning?</h3>
<p>On-time delivery is as important as product quality. Line stoppage often costs far more than the product itself. Evaluate the supplier's approach to production planning, stock and shipment.</p>

<h3>5. Can They Sustain Quality?</h3>
<p>A high-quality first order is not enough on its own. What matters is holding the same dimensional precision, raw material quality and production standard on every order. Consistency is one of the strongest signs of reliable manufacturing.</p>

<h3>6. Are They Reachable When Something Goes Wrong?</h3>
<p>Unexpected issues happen in every production process. What matters is not being flawless, but being able to communicate quickly and produce solutions. Reachable firms that take responsibility are always an advantage in long-term partnerships.</p>

<h3>7. Are They Price-Driven or Solution-Driven?</h3>
<p>The lowest price is not always the lowest total cost. Wrong choices lead to production loss, extra labor, service cost and repeat orders. A good supplier doesn't just quote — it develops solutions that lower total cost.</p>

<h3>8. How Do They View Long-Term Partnership?</h3>
<p>A real partnership doesn't start with the first order or end with the last. A good supplier supports new projects, develops processes together, anticipates needs and aims to build trust-based long-term relationships. This strengthens production and gives businesses a sustainable model.</p>

<h3>Why Choosing the Right Supplier Is a Competitive Advantage</h3>
<p>Working with a reliable partner is more than obtaining a product. It also delivers less production loss, faster solutions, more stable quality, more planned production, lower total cost and higher customer satisfaction — a direct contribution to your operational efficiency.</p>

<h3>Conclusion</h3>
<p>For products that directly affect production — like technical seals and extrusion profiles — selecting the right supplier is more than a purchasing decision. When technical knowledge, sustained quality, production planning, communication and solution focus are evaluated together, businesses can build a safer and more efficient long-term working model. The right partner is the one that can help solve not only today's need, but also tomorrow's problem — together.</p>
`.trim(),
  },
];

(async () => {
  const db = getDb();
  const now = new Date();
  let inserted = 0;
  let updated = 0;
  for (const p of posts) {
    // Space out publish dates so newest sortOrder shows on top per category
    const publishedAt = new Date(now.getTime() - (posts.indexOf(p) * 24 * 60 * 60 * 1000));
    const values = {
      slug: p.slug,
      category: p.category,
      titleTr: p.titleTr,
      titleEn: p.titleEn,
      excerptTr: p.excerptTr,
      excerptEn: p.excerptEn,
      contentTr: p.contentTr,
      contentEn: p.contentEn,
      author: "CNR Seal",
      readingTime: p.readingTime,
      publishedAt,
      sortOrder: p.sortOrder,
      updatedAt: now,
    };

    const existing = await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, p.slug)).limit(1);
    if (existing.length > 0) {
      await db.update(blogPosts).set(values).where(eq(blogPosts.id, existing[0].id));
      updated++;
      console.log(`  UPD  ${p.slug}`);
    } else {
      await db.insert(blogPosts).values(values);
      inserted++;
      console.log(`  NEW  ${p.slug}`);
    }
  }
  console.log(`\ndone. inserted=${inserted}, updated=${updated}`);
})();
