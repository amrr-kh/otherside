import { getLocale } from "next-intl/server";
import { LegalPage, LegalSection } from "@/components/storefront/LegalPage";

const EMAIL = "otherside.store.eg@gmail.com";
const PHONE = "+20 155 900 2289";

const EN_INTRO = [
  "These Terms and Conditions govern your use of the OtherSide website and purchases made through it.",
  "By accessing our website or placing an order, you agree to these Terms.",
];

const EN_SECTIONS = [
  {
    heading: "1. About OtherSide",
    paragraphs: [
      "OtherSide is a premium unisex fashion brand operating in Egypt.",
      "Our website allows customers to browse products, select available variants, place orders, and arrange delivery.",
    ],
  },
  {
    heading: "2. Products",
    paragraphs: [
      "We make reasonable efforts to display product photographs, colors, sizes, descriptions, materials, availability, and pricing accurately.",
      "However, colors may appear slightly different depending on lighting, photography, and the customer's screen or device.",
      "Measurements may also have reasonable production tolerances.",
    ],
  },
  {
    heading: "3. Prices",
    paragraphs: [
      "Unless otherwise stated, customer-facing prices are displayed in Egyptian Pounds (EGP).",
      "Prices may change without prior notice.",
      "The price applicable to an order is normally the price displayed when the customer completes checkout, subject to correction of obvious technical or pricing errors.",
    ],
  },
  {
    heading: "4. Product Availability",
    paragraphs: [
      "Products and variants are subject to availability.",
      "Adding an item to a cart does not necessarily reserve inventory.",
      "We reserve the right to cancel or modify an order if a product becomes unavailable, inventory information was incorrect, or another legitimate fulfillment issue prevents completion.",
      "Where applicable, we will contact the customer.",
    ],
  },
  {
    heading: "5. Orders",
    paragraphs: [
      "After placing an order, customers may receive an order number or confirmation.",
      "Receiving an automated confirmation does not necessarily mean that an order has been finally accepted.",
      "OtherSide may contact the customer to verify their phone number, address, order details, or availability before dispatch.",
      "We reserve the right to decline orders that appear fraudulent, abusive, incomplete, duplicated, or otherwise unreasonable.",
    ],
  },
  {
    heading: "6. Cash on Delivery",
    paragraphs: [
      "Where Cash on Delivery is available, payment is due according to the delivery arrangement shown at checkout.",
      "Customers should provide accurate contact and delivery information and should be reasonably available to receive their shipment.",
      "Repeated unjustified refusal of confirmed Cash on Delivery orders may result in restrictions on future COD orders where legally permitted.",
    ],
  },
  {
    heading: "7. Shipping",
    paragraphs: [
      "OtherSide currently focuses on delivery within Egypt.",
      "Shipping charges and estimated delivery times may vary according to governorate, location, order value, product availability, courier conditions, and other relevant factors.",
      "Delivery estimates are estimates rather than guarantees unless expressly stated otherwise.",
      "OtherSide is not responsible for delays caused by events reasonably outside our control, but we will make reasonable efforts to assist customers with delivery issues.",
    ],
  },
  {
    heading: "8. Addresses",
    paragraphs: [
      "Customers are responsible for providing accurate delivery information.",
      "OtherSide is not responsible for delays or failed deliveries caused by materially incorrect or incomplete information supplied by the customer.",
      "Additional delivery charges resulting from an incorrect address may be charged where appropriate and legally permitted.",
    ],
  },
  {
    heading: "9. Returns and Exchanges",
    paragraphs: [
      "Returns and exchanges are subject to our published Returns & Exchanges Policy and applicable Egyptian consumer-protection requirements.",
      "Nothing in these Terms is intended to remove any mandatory consumer rights provided by applicable law.",
      "Products must normally satisfy the conditions stated in our Returns & Exchanges Policy before a return or exchange can be accepted.",
    ],
  },
  {
    heading: "10. Cancellations",
    paragraphs: [
      "If you want to cancel an order, contact us as soon as possible.",
      "An order that has already entered fulfillment or has been handed to a courier may be subject to different cancellation procedures.",
    ],
  },
  {
    heading: "11. Discount Codes",
    paragraphs: [
      "Discount codes may have specific expiry dates, minimum purchase requirements, eligible products, customer limitations, or other conditions.",
      "Unless specifically stated otherwise, discount codes cannot be combined.",
      "We may cancel or disable a discount that was created, distributed, or used because of an obvious technical error, abuse, or fraud.",
    ],
  },
  {
    heading: "12. Accounts",
    paragraphs: [
      "Customers are responsible for maintaining the confidentiality of their account credentials.",
      "You must not access another person's account or attempt to interfere with the security of the OtherSide website.",
    ],
  },
  {
    heading: "13. Acceptable Use",
    paragraphs: [
      "You may not misuse the website, attempt unauthorized access to systems or databases, introduce malicious software, scrape protected information, interfere with website functionality, exploit technical vulnerabilities, or use the website for fraudulent or unlawful activity.",
    ],
  },
  {
    heading: "14. Intellectual Property",
    paragraphs: [
      "The OtherSide name, O/S logo, artwork, graphics, photographs, designs, website elements, text, branding, campaign materials, and other original content are owned by or licensed to OtherSide unless otherwise indicated.",
      "They may not be reproduced, commercially exploited, distributed, or used to create confusingly similar branding without authorization.",
    ],
  },
  {
    heading: "15. Website Availability",
    paragraphs: [
      "We may update, modify, suspend, or maintain parts of the website when necessary.",
      "Although we aim to provide reliable service, continuous uninterrupted availability cannot be guaranteed.",
    ],
  },
  {
    heading: "16. Errors",
    paragraphs: [
      "We reserve the right to correct obvious typographical, technical, inventory, pricing, or product-information errors.",
      "If an error materially affects an existing order, we will make reasonable efforts to contact the customer.",
    ],
  },
  {
    heading: "17. Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by applicable law, OtherSide will not be responsible for indirect or consequential losses arising from circumstances outside our reasonable control.",
      "Nothing in these Terms excludes liability or customer rights that cannot lawfully be excluded.",
    ],
  },
  {
    heading: "18. Privacy",
    paragraphs: [
      "Use of personal information is governed by the OtherSide Privacy Policy.",
    ],
  },
  {
    heading: "19. Changes to These Terms",
    paragraphs: [
      "We may update these Terms when our website, business, policies, or legal requirements change.",
      "The latest version will be displayed on the website with its effective date.",
    ],
  },
  {
    heading: "20. Governing Law",
    paragraphs: [
      "These Terms are governed by the applicable laws of the Arab Republic of Egypt.",
      "Nothing in these Terms limits mandatory rights available to consumers under applicable Egyptian law.",
    ],
  },
  {
    heading: "21. Contact",
    paragraphs: [
      "For questions about orders or these Terms:",
      `OtherSide\nEgypt\nEmail: ${EMAIL}\nWhatsApp/Phone: ${PHONE}`,
    ],
  },
];

const AR_INTRO = [
  "تحكم هذه الشروط والأحكام استخدامك لموقع OtherSide والمشتريات التي تتم من خلاله.",
  "من خلال الدخول إلى موقعنا أو إتمام طلب، فإنك توافق على هذه الشروط.",
];

const AR_SECTIONS = [
  {
    heading: "١. عن OtherSide",
    paragraphs: [
      "OtherSide علامة أزياء فاخرة للجنسين تعمل في مصر.",
      "يتيح موقعنا للعملاء تصفح المنتجات، واختيار الخيارات المتاحة، وإتمام الطلبات، وترتيب التوصيل.",
    ],
  },
  {
    heading: "٢. المنتجات",
    paragraphs: [
      "نبذل جهودًا معقولة لعرض صور المنتجات، وألوانها، ومقاساتها، وأوصافها، وخاماتها، وتوفرها، وأسعارها بدقة.",
      "مع ذلك، قد تظهر الألوان بشكل مختلف قليلًا حسب الإضاءة والتصوير وشاشة أو جهاز العميل.",
      "قد تخضع المقاسات أيضًا لهوامش تصنيع معقولة.",
    ],
  },
  {
    heading: "٣. الأسعار",
    paragraphs: [
      "ما لم يُذكر خلاف ذلك، تُعرض الأسعار الموجهة للعملاء بالجنيه المصري (EGP).",
      "قد تتغير الأسعار دون إشعار مسبق.",
      "السعر المطبق على الطلب هو عادةً السعر المعروض عند إتمام العميل لعملية الشراء، مع مراعاة تصحيح أي أخطاء تقنية أو سعرية واضحة.",
    ],
  },
  {
    heading: "٤. توفر المنتجات",
    paragraphs: [
      "تخضع المنتجات وخياراتها للتوفر.",
      "إضافة منتج إلى السلة لا يعني بالضرورة حجز المخزون.",
      "نحتفظ بالحق في إلغاء أو تعديل الطلب في حال أصبح المنتج غير متوفر، أو كانت معلومات المخزون غير صحيحة، أو وجدت مشكلة أخرى مشروعة تمنع إتمام الطلب.",
      "سنتواصل مع العميل عند الحاجة.",
    ],
  },
  {
    heading: "٥. الطلبات",
    paragraphs: [
      "بعد إتمام الطلب، قد يستلم العميل رقم طلب أو تأكيدًا.",
      "استلام تأكيد آلي لا يعني بالضرورة أن الطلب قد تم قبوله نهائيًا.",
      "قد تتواصل OtherSide مع العميل للتحقق من رقم هاتفه أو عنوانه أو تفاصيل طلبه أو توفر المنتج قبل الشحن.",
      "نحتفظ بالحق في رفض الطلبات التي تبدو احتيالية أو مسيئة أو غير مكتملة أو مكررة أو غير معقولة بأي شكل آخر.",
    ],
  },
  {
    heading: "٦. الدفع عند الاستلام",
    paragraphs: [
      "حيثما تتوفر خدمة الدفع عند الاستلام، يكون الدفع مستحقًا وفقًا لترتيب التوصيل الموضح عند إتمام الطلب.",
      "يجب على العملاء تقديم معلومات تواصل وتوصيل دقيقة، وأن يكونوا متاحين بشكل معقول لاستلام شحنتهم.",
      "قد يؤدي الرفض المتكرر وغير المبرر لطلبات الدفع عند الاستلام المؤكدة إلى فرض قيود على طلبات الدفع عند الاستلام المستقبلية حيثما يسمح القانون بذلك.",
    ],
  },
  {
    heading: "٧. الشحن",
    paragraphs: [
      "تركز OtherSide حاليًا على التوصيل داخل مصر.",
      "قد تختلف رسوم الشحن والمدة المتوقعة للتوصيل حسب المحافظة، والموقع، وقيمة الطلب، وتوفر المنتج، وظروف الشحن، وعوامل أخرى ذات صلة.",
      "المدد الزمنية المذكورة للتوصيل هي تقديرات وليست ضمانات، ما لم يُذكر خلاف ذلك صراحة.",
      "لا تتحمل OtherSide المسؤولية عن التأخيرات الناتجة عن أحداث خارجة بشكل معقول عن سيطرتنا، لكننا سنبذل جهودًا معقولة لمساعدة العملاء في مشكلات التوصيل.",
    ],
  },
  {
    heading: "٨. العناوين",
    paragraphs: [
      "يتحمل العملاء مسؤولية تقديم معلومات توصيل دقيقة.",
      "لا تتحمل OtherSide المسؤولية عن التأخيرات أو فشل التوصيل الناتج عن معلومات غير صحيحة أو غير مكتملة بشكل جوهري مقدمة من العميل.",
      "قد يتم تحصيل رسوم توصيل إضافية ناتجة عن عنوان غير صحيح حيثما كان ذلك مناسبًا ومسموحًا به قانونيًا.",
    ],
  },
  {
    heading: "٩. الإرجاع والاستبدال",
    paragraphs: [
      "تخضع عمليات الإرجاع والاستبدال لسياسة الإرجاع والاستبدال المنشورة لدينا ومتطلبات حماية المستهلك المصرية المعمول بها.",
      "لا يُقصد بأي بند في هذه الشروط إلغاء أي حقوق إلزامية للمستهلك ينص عليها القانون المعمول به.",
      "يجب أن تستوفي المنتجات عادةً الشروط المذكورة في سياسة الإرجاع والاستبدال قبل قبول عملية الإرجاع أو الاستبدال.",
    ],
  },
  {
    heading: "١٠. الإلغاء",
    paragraphs: [
      "إذا رغبت في إلغاء طلبك، يرجى التواصل معنا في أقرب وقت ممكن.",
      "قد يخضع الطلب الذي دخل بالفعل مرحلة التجهيز أو تم تسليمه لشركة الشحن لإجراءات إلغاء مختلفة.",
    ],
  },
  {
    heading: "١١. أكواد الخصم",
    paragraphs: [
      "قد يكون لأكواد الخصم تواريخ انتهاء محددة، أو حد أدنى للشراء، أو منتجات مؤهلة، أو قيود على العملاء، أو شروط أخرى.",
      "ما لم يُذكر خلاف ذلك تحديدًا، لا يمكن الجمع بين أكواد الخصم.",
      "يجوز لنا إلغاء أو تعطيل أي خصم تم إنشاؤه أو توزيعه أو استخدامه نتيجة خطأ تقني واضح، أو إساءة استخدام، أو احتيال.",
    ],
  },
  {
    heading: "١٢. الحسابات",
    paragraphs: [
      "يتحمل العملاء مسؤولية الحفاظ على سرية بيانات حساباتهم.",
      "يُمنع الدخول إلى حساب شخص آخر أو محاولة التدخل في أمان موقع OtherSide.",
    ],
  },
  {
    heading: "١٣. الاستخدام المقبول",
    paragraphs: [
      "يُمنع إساءة استخدام الموقع، أو محاولة الوصول غير المصرح به إلى الأنظمة أو قواعد البيانات، أو إدخال برمجيات ضارة، أو استخلاص معلومات محمية، أو التدخل في وظائف الموقع، أو استغلال الثغرات التقنية، أو استخدام الموقع في أي نشاط احتيالي أو غير قانوني.",
    ],
  },
  {
    heading: "١٤. الملكية الفكرية",
    paragraphs: [
      "اسم OtherSide، وشعار O/S، والأعمال الفنية، والرسومات، والصور، والتصاميم، وعناصر الموقع، والنصوص، والهوية التجارية، والمواد الترويجية، وأي محتوى أصلي آخر، مملوكة لـ OtherSide أو مرخصة لها ما لم يُذكر خلاف ذلك.",
      "لا يجوز نسخها أو استغلالها تجاريًا أو توزيعها أو استخدامها لإنشاء هوية تجارية مشابهة بشكل مضلل دون تصريح.",
    ],
  },
  {
    heading: "١٥. توفر الموقع",
    paragraphs: [
      "يجوز لنا تحديث أو تعديل أو تعليق أو صيانة أجزاء من الموقع عند الحاجة.",
      "على الرغم من سعينا لتقديم خدمة موثوقة، لا يمكن ضمان التوفر المستمر دون انقطاع.",
    ],
  },
  {
    heading: "١٦. الأخطاء",
    paragraphs: [
      "نحتفظ بالحق في تصحيح أي أخطاء مطبعية أو تقنية أو متعلقة بالمخزون أو الأسعار أو معلومات المنتج تكون واضحة.",
      "إذا أثّر خطأ ما بشكل جوهري على طلب قائم، فسنبذل جهودًا معقولة للتواصل مع العميل.",
    ],
  },
  {
    heading: "١٧. حدود المسؤولية",
    paragraphs: [
      "إلى الحد الأقصى الذي يسمح به القانون المعمول به، لن تتحمل OtherSide المسؤولية عن الخسائر غير المباشرة أو التبعية الناتجة عن ظروف خارجة بشكل معقول عن سيطرتنا.",
      "لا يستثني أي بند في هذه الشروط أي مسؤولية أو حقوق للعميل لا يجوز استثناؤها قانونيًا.",
    ],
  },
  {
    heading: "١٨. الخصوصية",
    paragraphs: [
      "يخضع استخدام المعلومات الشخصية لسياسة الخصوصية الخاصة بـ OtherSide.",
    ],
  },
  {
    heading: "١٩. التغييرات على هذه الشروط",
    paragraphs: [
      "يجوز لنا تحديث هذه الشروط عند تغير موقعنا أو أعمالنا أو سياساتنا أو متطلباتنا القانونية.",
      "سيتم عرض النسخة الأحدث على الموقع مع تاريخ سريانها.",
    ],
  },
  {
    heading: "٢٠. القانون الحاكم",
    paragraphs: [
      "تخضع هذه الشروط للقوانين المعمول بها في جمهورية مصر العربية.",
      "لا يحد أي بند في هذه الشروط من الحقوق الإلزامية المتاحة للمستهلكين بموجب القانون المصري المعمول به.",
    ],
  },
  {
    heading: "٢١. التواصل",
    paragraphs: [
      "للاستفسارات حول الطلبات أو هذه الشروط:",
      `OtherSide\nمصر\nالبريد الإلكتروني: ${EMAIL}\nالهاتف/واتساب: ${PHONE}`,
    ],
  },
];

export default async function TermsPage() {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const intro = isAr ? AR_INTRO : EN_INTRO;
  const sections = isAr ? AR_SECTIONS : EN_SECTIONS;

  return (
    <LegalPage
      title={isAr ? "الشروط والأحكام" : "Terms & Conditions"}
      lastUpdated={isAr ? "10 سبتمبر 2026" : "September 10, 2026"}
      lastUpdatedLabel={isAr ? "آخر تحديث" : "Last Updated"}
      note={
        isAr
          ? "هذه ترجمة للتسهيل على القارئ؛ النسخة الإنجليزية من هذه الوثيقة هي المرجع القانوني المعتمد."
          : undefined
      }
    >
      {intro.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {sections.map((s) => (
        <LegalSection key={s.heading} heading={s.heading}>
          {s.paragraphs.map((p, j) => (
            <p key={j} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </LegalSection>
      ))}
    </LegalPage>
  );
}
