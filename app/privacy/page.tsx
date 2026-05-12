import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Ilé Ìtura Ògúnbádéwà",
  description: "Learn how Ilé Ìtura Ògúnbádéwà protects your personal data, privacy, and security during your stay with us.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="pt-32 pb-24 px-4 md:px-8 bg-linear-to-b from-forest-black to-forest-dark min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">Data Protection</span>
          <h1 className="font-playfair text-4xl md:text-5xl text-cream mt-3 mb-6">Privacy Policy</h1>
          <div className="w-16 h-[1px] bg-gold-primary mx-auto" />
          <p className="text-cream-muted mt-6 text-sm">Last Updated: May 2026</p>
        </div>

        <div className="space-y-10 text-cream-muted text-[15px] leading-relaxed font-light">
          <section className="bg-white/5 border border-gold-primary/10 rounded-2xl p-8 hover:border-gold-primary/30 transition-colors">
            <h2 className="font-playfair text-2xl text-gold-primary mb-4">1. Introduction</h2>
            <p>
              Welcome to Ilé Ìtura Ògúnbádéwà. We are committed to protecting the privacy and security of our guests and visitors. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our website, book a stay, or visit our premises in Ikorodu, Lagos State.
            </p>
          </section>

          <section className="bg-white/5 border border-gold-primary/10 rounded-2xl p-8 hover:border-gold-primary/30 transition-colors">
            <h2 className="font-playfair text-2xl text-gold-primary mb-4">2. Information We Collect</h2>
            <p className="mb-4">To provide you with exceptional hospitality, we may collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Identification:</strong> Name, valid ID documents (NIN, Passport, etc.), and contact information.</li>
              <li><strong>Contact Details:</strong> Phone numbers and email addresses used for booking and communication.</li>
              <li><strong>Financial Information:</strong> Payment records and transaction history (Note: We do not store full credit card details on our servers).</li>
              <li><strong>Security Data:</strong> CCTV footage captured while on the hotel premises for the safety of all guests.</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-gold-primary/10 rounded-2xl p-8 hover:border-gold-primary/30 transition-colors">
            <h2 className="font-playfair text-2xl text-gold-primary mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We strictly use your data for the following operational purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To process and confirm your room and event hall reservations.</li>
              <li>To provide customer support and respond to your inquiries via WhatsApp or phone.</li>
              <li>To ensure the safety and security of our guests, staff, and property via CCTV monitoring.</li>
              <li>To comply with legal and regulatory requirements in Nigeria.</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-gold-primary/10 rounded-2xl p-8 hover:border-gold-primary/30 transition-colors">
            <h2 className="font-playfair text-2xl text-gold-primary mb-4">4. Data Protection & Security</h2>
            <p>
              We implement robust physical, technical, and administrative security measures to protect your personal information against unauthorized access, disclosure, or misuse. Access to guest data is strictly limited to authorized administrative personnel. 
            </p>
          </section>

          <section className="bg-white/5 border border-gold-primary/10 rounded-2xl p-8 hover:border-gold-primary/30 transition-colors">
            <h2 className="font-playfair text-2xl text-gold-primary mb-4">5. Third-Party Disclosure</h2>
            <p>
              Ilé Ìtura Ògúnbádéwà does not sell, trade, or rent your personal identification information to others. We may only share necessary information with trusted third-party service providers (such as payment gateways) strictly for the purpose of facilitating your stay, or when required by law enforcement agencies.
            </p>
          </section>

          <section className="bg-white/5 border border-gold-primary/10 rounded-2xl p-8 hover:border-gold-primary/30 transition-colors">
            <h2 className="font-playfair text-2xl text-gold-primary mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how your data is handled, please contact our management team:
            </p>
            <div className="mt-4 p-4 bg-forest-black rounded-lg border border-gold-primary/20 inline-block">
              <p><strong>Phone:</strong> 08129041015, 08060721283</p>
              <p><strong>Address:</strong> Saheed Anibaba Street, Off Obafemi Awolowo Way, Ikorodu, Lagos</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
