import { getLocale } from "next-intl/server";
import { LegalPage, LegalSection } from "@/components/storefront/LegalPage";

const EMAIL = "otherside.store.eg@gmail.com";
const PHONE = "+20 155 900 2289";

const EN_INTRO = [
  "OtherSide respects your privacy and is committed to protecting the personal information you provide when using our website.",
  "OtherSide is an Egyptian fashion brand operated by its founders, Bidu, Eshta, and Amr. This Privacy Policy explains what information we collect, why we collect it, how we use it, and the choices available to you.",
];

const EN_SECTIONS = [
  {
    heading: "1. Information We Collect",
    paragraphs: [
      "When you use the OtherSide website, place an order, create an account, join our newsletter, contact us, or otherwise interact with us, we may collect information such as your name, mobile number, email address, shipping address, governorate, city or area, building and apartment details, order details, selected products, colors and sizes, purchase history, delivery notes, account information, wishlist information, and customer-support communications.",
      "We may also automatically collect technical information such as your IP address, browser type, device type, operating system, pages visited, referral source, session information, and website usage data.",
    ],
  },
  {
    heading: "2. How We Use Your Information",
    paragraphs: [
      "We may use your information to process and fulfill orders, arrange delivery, contact you regarding an order, provide customer support, manage returns or cancellations, maintain customer accounts, manage inventory, prevent fraud or abuse, improve our website, analyze store performance, send marketing communications where permitted, and comply with legal obligations.",
      "We only use personal information where there is an appropriate business or legal reason for doing so.",
    ],
  },
  {
    heading: "3. Orders and Delivery",
    paragraphs: [
      "For orders delivered within Egypt, we may share the information necessary to complete delivery with our courier or logistics provider.",
      "This may include your name, phone number, delivery address, order value, Cash on Delivery amount, and other information reasonably required to deliver your order.",
      "Courier companies are not permitted to use information we provide for unrelated purposes.",
    ],
  },
  {
    heading: "4. Payments",
    paragraphs: [
      "OtherSide may initially offer Cash on Delivery.",
      "If electronic payments are introduced in the future, payments may be processed by an authorized third-party payment provider or bank.",
      "OtherSide should not directly store full payment-card numbers, CVV codes, or other sensitive card credentials on its own servers.",
      "The payment provider's own privacy policy and terms may apply to payment processing.",
    ],
  },
  {
    heading: "5. Service Providers",
    paragraphs: [
      "We may use trusted third-party providers for services such as website hosting, databases, cloud storage, analytics, email, customer communication, security, delivery, and payment processing.",
      "We only provide these providers with information reasonably necessary to perform their services.",
    ],
  },
  {
    heading: "6. Cookies and Analytics",
    paragraphs: [
      "Our website may use cookies or similar technologies to maintain sessions, remember cart contents and preferences, analyze traffic, improve performance, and understand how customers use the website.",
      "Where required, customers may be provided with options to accept or manage non-essential cookies.",
    ],
  },
  {
    heading: "7. Marketing",
    paragraphs: [
      "If you subscribe to OtherSide marketing communications, we may send information about new drops, collections, promotions, restocks, and brand updates.",
      "You may unsubscribe from marketing communications at any time using the unsubscribe option provided or by contacting us.",
      "Transactional communications relating to an existing order may still be sent even if you unsubscribe from marketing.",
    ],
  },
  {
    heading: "8. Data Security",
    paragraphs: [
      "We take reasonable technical and organizational measures to protect personal information against unauthorized access, loss, alteration, disclosure, or misuse.",
      "However, no website, server, or internet transmission can be guaranteed to be completely secure.",
    ],
  },
  {
    heading: "9. Data Retention",
    paragraphs: [
      "We retain customer and order information only for as long as reasonably necessary to operate the business, provide customer service, comply with accounting and legal requirements, resolve disputes, and protect legitimate business interests.",
    ],
  },
  {
    heading: "10. Your Information and Rights",
    paragraphs: [
      "Depending on applicable law, you may have rights regarding your personal information, including requesting access to information we hold about you, requesting corrections, objecting to certain uses, requesting deletion where legally permitted, or withdrawing marketing consent.",
      "Some information may need to be retained where required by law or where necessary for legitimate business records.",
      "To make a privacy request, contact:",
      `Email: ${EMAIL}`,
      `WhatsApp/Phone: ${PHONE}`,
    ],
  },
  {
    heading: "11. International Technology Providers",
    paragraphs: [
      "Some hosting, analytics, database, cloud, or infrastructure providers used by OtherSide may process information outside Egypt.",
      "Where this occurs, we will take reasonable measures to use reputable providers and protect customer information in accordance with applicable requirements.",
    ],
  },
  {
    heading: "12. Children's Privacy",
    paragraphs: [
      "The OtherSide website is not intended to knowingly collect personal information from children without appropriate authorization where required by law.",
    ],
  },
  {
    heading: "13. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy as our services, technologies, or legal requirements change.",
      "The current version and its effective date will be displayed on this page.",
    ],
  },
  {
    heading: "14. Contact",
    paragraphs: [
      "For privacy questions, contact:",
      `OtherSide\nEgypt\nEmail: ${EMAIL}\nPhone/WhatsApp: ${PHONE}`,
    ],
  },
];

const AR_INTRO = [
  "تحترم OtherSide خصوصيتك وتلتزم بحماية المعلومات الشخصية التي تقدمها عند استخدام موقعنا الإلكتروني.",
  "OtherSide علامة أزياء مصرية يديرها مؤسسوها بيدو وإشطا وعمرو. توضح سياسة الخصوصية هذه المعلومات التي نجمعها، وأسباب جمعها، وكيفية استخدامها، والخيارات المتاحة لك.",
];

const AR_SECTIONS = [
  {
    heading: "١. المعلومات التي نجمعها",
    paragraphs: [
      "عند استخدامك لموقع OtherSide، أو إتمام طلب، أو إنشاء حساب، أو الاشتراك في نشرتنا البريدية، أو التواصل معنا، أو التفاعل معنا بأي شكل آخر، قد نجمع معلومات مثل اسمك، ورقم هاتفك المحمول، وبريدك الإلكتروني، وعنوان الشحن، والمحافظة، والمدينة أو المنطقة، وتفاصيل المبنى والشقة، وتفاصيل الطلب، والمنتجات المختارة، والألوان والمقاسات، وسجل المشتريات، وملاحظات التوصيل، ومعلومات الحساب، ومعلومات قائمة المفضلة، ومراسلات دعم العملاء.",
      "كما قد نجمع تلقائيًا معلومات تقنية مثل عنوان IP الخاص بك، ونوع المتصفح، ونوع الجهاز، ونظام التشغيل، والصفحات التي تمت زيارتها، ومصدر الإحالة، ومعلومات الجلسة، وبيانات استخدام الموقع.",
    ],
  },
  {
    heading: "٢. كيف نستخدم معلوماتك",
    paragraphs: [
      "قد نستخدم معلوماتك لمعالجة الطلبات وتنفيذها، وترتيب التوصيل، والتواصل معك بخصوص طلبك، وتقديم دعم العملاء، وإدارة عمليات الإرجاع أو الإلغاء، والحفاظ على حسابات العملاء، وإدارة المخزون، ومنع الاحتيال أو إساءة الاستخدام، وتحسين موقعنا، وتحليل أداء المتجر، وإرسال الاتصالات التسويقية حيثما كان ذلك مسموحًا، والامتثال للالتزامات القانونية.",
      "لا نستخدم المعلومات الشخصية إلا عندما يكون هناك سبب تجاري أو قانوني مناسب للقيام بذلك.",
    ],
  },
  {
    heading: "٣. الطلبات والتوصيل",
    paragraphs: [
      "بالنسبة للطلبات التي يتم توصيلها داخل مصر، قد نشارك المعلومات اللازمة لإتمام التوصيل مع شركة الشحن أو مزود الخدمات اللوجستية.",
      "قد يشمل ذلك اسمك، ورقم هاتفك، وعنوان التوصيل، وقيمة الطلب، ومبلغ الدفع عند الاستلام، ومعلومات أخرى مطلوبة بشكل معقول لتوصيل طلبك.",
      "لا يُسمح لشركات الشحن باستخدام المعلومات التي نقدمها لأغراض غير متعلقة بالتوصيل.",
    ],
  },
  {
    heading: "٤. المدفوعات",
    paragraphs: [
      "قد تقدم OtherSide في البداية خدمة الدفع عند الاستلام.",
      "في حال إتاحة وسائل الدفع الإلكتروني مستقبلًا، قد تتم معالجة المدفوعات من قبل مزود دفع أو بنك خارجي معتمد.",
      "لا تقوم OtherSide بتخزين أرقام بطاقات الدفع الكاملة أو رموز CVV أو أي بيانات حساسة أخرى للبطاقة على خوادمها الخاصة.",
      "قد تنطبق سياسة الخصوصية والشروط الخاصة بمزود الدفع على عملية معالجة الدفع.",
    ],
  },
  {
    heading: "٥. مزودو الخدمات",
    paragraphs: [
      "قد نستعين بمزودين خارجيين موثوقين لتقديم خدمات مثل استضافة الموقع، وقواعد البيانات، والتخزين السحابي، والتحليلات، والبريد الإلكتروني، والتواصل مع العملاء، والأمان، والتوصيل، ومعالجة المدفوعات.",
      "لا نقدم لهؤلاء المزودين سوى المعلومات اللازمة بشكل معقول لأداء خدماتهم.",
    ],
  },
  {
    heading: "٦. ملفات تعريف الارتباط والتحليلات",
    paragraphs: [
      "قد يستخدم موقعنا ملفات تعريف الارتباط (الكوكيز) أو تقنيات مشابهة للحفاظ على الجلسات، وتذكر محتويات السلة والتفضيلات، وتحليل الزيارات، وتحسين الأداء، وفهم كيفية استخدام العملاء للموقع.",
      "عند الحاجة، قد نوفر للعملاء خيارات لقبول أو إدارة ملفات تعريف الارتباط غير الأساسية.",
    ],
  },
  {
    heading: "٧. التسويق",
    paragraphs: [
      "إذا اشتركت في الاتصالات التسويقية الخاصة بـ OtherSide، فقد نرسل لك معلومات حول الإصدارات الجديدة، والمجموعات، والعروض، وإعادة التوفر، وتحديثات العلامة.",
      "يمكنك إلغاء الاشتراك في الاتصالات التسويقية في أي وقت باستخدام خيار إلغاء الاشتراك المتاح أو من خلال التواصل معنا.",
      "قد يستمر إرسال الاتصالات المتعلقة بالطلبات الحالية حتى في حال إلغاء اشتراكك في الرسائل التسويقية.",
    ],
  },
  {
    heading: "٨. أمان البيانات",
    paragraphs: [
      "نتخذ تدابير تقنية وتنظيمية معقولة لحماية المعلومات الشخصية من الوصول غير المصرح به، أو الفقدان، أو التعديل، أو الإفصاح، أو إساءة الاستخدام.",
      "مع ذلك، لا يمكن ضمان أن يكون أي موقع إلكتروني أو خادم أو نقل عبر الإنترنت آمنًا بشكل كامل.",
    ],
  },
  {
    heading: "٩. الاحتفاظ بالبيانات",
    paragraphs: [
      "نحتفظ بمعلومات العملاء والطلبات فقط للمدة اللازمة بشكل معقول لتشغيل العمل، وتقديم خدمة العملاء، والامتثال للمتطلبات المحاسبية والقانونية، وحل النزاعات، وحماية المصالح التجارية المشروعة.",
    ],
  },
  {
    heading: "١٠. معلوماتك وحقوقك",
    paragraphs: [
      "بناءً على القانون المعمول به، قد يكون لك حقوق تتعلق بمعلوماتك الشخصية، تشمل طلب الاطلاع على المعلومات التي نحتفظ بها عنك، وطلب تصحيحها، والاعتراض على بعض استخداماتها، وطلب حذفها حيثما يسمح القانون بذلك، أو سحب موافقتك على التسويق.",
      "قد يلزم الاحتفاظ ببعض المعلومات حيثما يتطلب القانون ذلك أو حيثما تكون ضرورية للسجلات التجارية المشروعة.",
      "لتقديم طلب متعلق بالخصوصية، يرجى التواصل عبر:",
      `البريد الإلكتروني: ${EMAIL}`,
      `واتساب/الهاتف: ${PHONE}`,
    ],
  },
  {
    heading: "١١. مزودو التقنية الدوليون",
    paragraphs: [
      "قد يقوم بعض مزودي الاستضافة، والتحليلات، وقواعد البيانات، والخدمات السحابية، والبنية التحتية الذين تستخدمهم OtherSide بمعالجة المعلومات خارج مصر.",
      "في حال حدوث ذلك، سنتخذ تدابير معقولة لاستخدام مزودين موثوقين وحماية معلومات العملاء وفقًا للمتطلبات المعمول بها.",
    ],
  },
  {
    heading: "١٢. خصوصية الأطفال",
    paragraphs: [
      "لا يهدف موقع OtherSide إلى جمع معلومات شخصية من الأطفال عن علم دون تصريح مناسب حيثما يتطلب القانون ذلك.",
    ],
  },
  {
    heading: "١٣. التغييرات على هذه السياسة",
    paragraphs: [
      "قد نقوم بتحديث سياسة الخصوصية هذه مع تغير خدماتنا أو تقنياتنا أو متطلباتنا القانونية.",
      "سيتم عرض النسخة الحالية وتاريخ سريانها على هذه الصفحة.",
    ],
  },
  {
    heading: "١٤. التواصل",
    paragraphs: [
      "للاستفسارات المتعلقة بالخصوصية، يرجى التواصل عبر:",
      `OtherSide\nمصر\nالبريد الإلكتروني: ${EMAIL}\nالهاتف/واتساب: ${PHONE}`,
    ],
  },
];

export default async function PrivacyPage() {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const intro = isAr ? AR_INTRO : EN_INTRO;
  const sections = isAr ? AR_SECTIONS : EN_SECTIONS;

  return (
    <LegalPage
      title={isAr ? "سياسة الخصوصية" : "Privacy Policy"}
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
