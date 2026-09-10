import { LegalPage, LegalSection } from "@/components/storefront/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="September 10, 2026">
      <p>
        OtherSide respects your privacy and is committed to protecting the
        personal information you provide when using our website.
      </p>
      <p>
        OtherSide is an Egyptian fashion brand operated by its founders,
        Bidu, Eshta, and Amr. This Privacy Policy explains what information
        we collect, why we collect it, how we use it, and the choices
        available to you.
      </p>

      <LegalSection heading="1. Information We Collect">
        <p>
          When you use the OtherSide website, place an order, create an
          account, join our newsletter, contact us, or otherwise interact
          with us, we may collect information such as your name, mobile
          number, email address, shipping address, governorate, city or
          area, building and apartment details, order details, selected
          products, colors and sizes, purchase history, delivery notes,
          account information, wishlist information, and customer-support
          communications.
        </p>
        <p>
          We may also automatically collect technical information such as
          your IP address, browser type, device type, operating system,
          pages visited, referral source, session information, and website
          usage data.
        </p>
      </LegalSection>

      <LegalSection heading="2. How We Use Your Information">
        <p>
          We may use your information to process and fulfill orders,
          arrange delivery, contact you regarding an order, provide
          customer support, manage returns or cancellations, maintain
          customer accounts, manage inventory, prevent fraud or abuse,
          improve our website, analyze store performance, send marketing
          communications where permitted, and comply with legal
          obligations.
        </p>
        <p>
          We only use personal information where there is an appropriate
          business or legal reason for doing so.
        </p>
      </LegalSection>

      <LegalSection heading="3. Orders and Delivery">
        <p>
          For orders delivered within Egypt, we may share the information
          necessary to complete delivery with our courier or logistics
          provider.
        </p>
        <p>
          This may include your name, phone number, delivery address, order
          value, Cash on Delivery amount, and other information reasonably
          required to deliver your order.
        </p>
        <p>
          Courier companies are not permitted to use information we provide
          for unrelated purposes.
        </p>
      </LegalSection>

      <LegalSection heading="4. Payments">
        <p>OtherSide may initially offer Cash on Delivery.</p>
        <p>
          If electronic payments are introduced in the future, payments may
          be processed by an authorized third-party payment provider or
          bank.
        </p>
        <p>
          OtherSide should not directly store full payment-card numbers,
          CVV codes, or other sensitive card credentials on its own
          servers.
        </p>
        <p>
          The payment provider&apos;s own privacy policy and terms may
          apply to payment processing.
        </p>
      </LegalSection>

      <LegalSection heading="5. Service Providers">
        <p>
          We may use trusted third-party providers for services such as
          website hosting, databases, cloud storage, analytics, email,
          customer communication, security, delivery, and payment
          processing.
        </p>
        <p>
          We only provide these providers with information reasonably
          necessary to perform their services.
        </p>
      </LegalSection>

      <LegalSection heading="6. Cookies and Analytics">
        <p>
          Our website may use cookies or similar technologies to maintain
          sessions, remember cart contents and preferences, analyze
          traffic, improve performance, and understand how customers use
          the website.
        </p>
        <p>
          Where required, customers may be provided with options to accept
          or manage non-essential cookies.
        </p>
      </LegalSection>

      <LegalSection heading="7. Marketing">
        <p>
          If you subscribe to OtherSide marketing communications, we may
          send information about new drops, collections, promotions,
          restocks, and brand updates.
        </p>
        <p>
          You may unsubscribe from marketing communications at any time
          using the unsubscribe option provided or by contacting us.
        </p>
        <p>
          Transactional communications relating to an existing order may
          still be sent even if you unsubscribe from marketing.
        </p>
      </LegalSection>

      <LegalSection heading="8. Data Security">
        <p>
          We take reasonable technical and organizational measures to
          protect personal information against unauthorized access, loss,
          alteration, disclosure, or misuse.
        </p>
        <p>
          However, no website, server, or internet transmission can be
          guaranteed to be completely secure.
        </p>
      </LegalSection>

      <LegalSection heading="9. Data Retention">
        <p>
          We retain customer and order information only for as long as
          reasonably necessary to operate the business, provide customer
          service, comply with accounting and legal requirements, resolve
          disputes, and protect legitimate business interests.
        </p>
      </LegalSection>

      <LegalSection heading="10. Your Information and Rights">
        <p>
          Depending on applicable law, you may have rights regarding your
          personal information, including requesting access to information
          we hold about you, requesting corrections, objecting to certain
          uses, requesting deletion where legally permitted, or withdrawing
          marketing consent.
        </p>
        <p>
          Some information may need to be retained where required by law
          or where necessary for legitimate business records.
        </p>
        <p>To make a privacy request, contact:</p>
        <p>
          Email: otherside.store.eg@gmail.com
          <br />
          WhatsApp/Phone: +20 155 900 2289
        </p>
      </LegalSection>

      <LegalSection heading="11. International Technology Providers">
        <p>
          Some hosting, analytics, database, cloud, or infrastructure
          providers used by OtherSide may process information outside
          Egypt.
        </p>
        <p>
          Where this occurs, we will take reasonable measures to use
          reputable providers and protect customer information in
          accordance with applicable requirements.
        </p>
      </LegalSection>

      <LegalSection heading="12. Children's Privacy">
        <p>
          The OtherSide website is not intended to knowingly collect
          personal information from children without appropriate
          authorization where required by law.
        </p>
      </LegalSection>

      <LegalSection heading="13. Changes to This Policy">
        <p>
          We may update this Privacy Policy as our services, technologies,
          or legal requirements change.
        </p>
        <p>
          The current version and its effective date will be displayed on
          this page.
        </p>
      </LegalSection>

      <LegalSection heading="14. Contact">
        <p>For privacy questions, contact:</p>
        <p>
          OtherSide
          <br />
          Egypt
          <br />
          Email: otherside.store.eg@gmail.com
          <br />
          Phone/WhatsApp: +20 155 900 2289
        </p>
      </LegalSection>
    </LegalPage>
  );
}
