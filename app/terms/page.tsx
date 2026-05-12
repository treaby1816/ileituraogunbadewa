import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Ilé Ìtura Ògúnbádéwà",
  description: "Read the official terms and conditions, booking policies, and house rules for guests staying at Ilé Ìtura Ògúnbádéwà.",
};

export default function TermsPage() {
  return (
    <main className="pt-32 pb-24 px-4 md:px-8 bg-linear-to-b from-forest-black to-forest-dark min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">Legal Information</span>
          <h1 className="font-playfair text-4xl md:text-5xl text-cream mt-3 mb-6">Terms & Conditions</h1>
          <div className="w-16 h-[1px] bg-gold-primary mx-auto" />
          <p className="text-cream-muted mt-6 text-sm">Last Updated: May 2026</p>
        </div>

        <div className="space-y-10 text-cream-muted text-[15px] leading-relaxed font-light">
          <section className="bg-white/5 border border-gold-primary/10 rounded-2xl p-8 hover:border-gold-primary/30 transition-colors">
            <h2 className="font-playfair text-2xl text-gold-primary mb-4">1. General Overview</h2>
            <p>
              By accessing, browsing, or making a reservation at Ilé Ìtura Ògúnbádéwà, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. These policies are designed to ensure a safe, comfortable, and luxurious experience for all our guests.
            </p>
          </section>

          <section className="bg-white/5 border border-gold-primary/10 rounded-2xl p-8 hover:border-gold-primary/30 transition-colors">
            <h2 className="font-playfair text-2xl text-gold-primary mb-4">2. Reservations & Payment</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>A reservation is only considered confirmed once a deposit or full payment has been successfully received.</li>
              <li>We accept payments via Cash, Bank Transfer, and POS. We do not accept foreign currencies.</li>
              <li>Guests must present a valid, up-to-date identification (NIN, International Passport, National ID) upon check-in.</li>
              <li>The minimum age requirement to book and stay alone is 18 years.</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-gold-primary/10 rounded-2xl p-8 hover:border-gold-primary/30 transition-colors">
            <h2 className="font-playfair text-2xl text-gold-primary mb-4">3. Check-In & Check-Out Policies</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Check-in Time:</strong> 2:00 PM</li>
              <li><strong>Check-out Time:</strong> 12:00 Noon</li>
              <li>Early check-ins are subject strictly to room availability.</li>
              <li>Late check-outs up to 1 hour beyond 12:00 Noon may be granted upon management discretion. Any extension beyond this may incur additional charges.</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-gold-primary/10 rounded-2xl p-8 hover:border-gold-primary/30 transition-colors">
            <h2 className="font-playfair text-2xl text-gold-primary mb-4">4. Cancellation & Refund Policy</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Guests must provide at least <strong>3 days notice</strong> prior to their scheduled arrival date to cancel or modify a reservation.</li>
              <li>Same-day cancellations or no-shows for confirmed bookings will result in no refund. Such cases are strictly handled by hotel management.</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-gold-primary/10 rounded-2xl p-8 hover:border-gold-primary/30 transition-colors">
            <h2 className="font-playfair text-2xl text-gold-primary mb-4">5. House Rules & Conduct</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Quiet Hours:</strong> We enforce quiet hours starting at 9:00 PM to ensure all guests can rest peacefully.</li>
              <li><strong>Prohibited Items:</strong> Sharp objects, hard drugs, and pets are strictly prohibited anywhere on the property.</li>
              <li><strong>Cooking:</strong> Cooking inside the rooms is not permitted. Our 24-hour kitchen is available to serve all your culinary needs.</li>
              <li><strong>Visitors:</strong> Visitors are welcome but must register at the front desk and receive permission from the resident guest before proceeding to the rooms.</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-gold-primary/10 rounded-2xl p-8 hover:border-gold-primary/30 transition-colors">
            <h2 className="font-playfair text-2xl text-gold-primary mb-4">6. Event Hall Hire Policy</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Event hall bookings must be made at least 1 week in advance.</li>
              <li>All events must conclude by 8:00 PM to ensure the peace and comfort of hotel residents.</li>
              <li>Clients may bring their own caterers, decorators, and DJs/live bands.</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-gold-primary/10 rounded-2xl p-8 hover:border-gold-primary/30 transition-colors">
            <h2 className="font-playfair text-2xl text-gold-primary mb-4">7. Liability & Property Damage</h2>
            <p>
              Guests will be held financially responsible for any loss or damage to hotel property (including furniture, electronics, and fixtures) caused by themselves or their visitors. Ilé Ìtura Ògúnbádéwà assumes no liability for personal items lost or left behind, though all found items are kept securely at the front desk.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
