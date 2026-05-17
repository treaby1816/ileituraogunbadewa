import { Button } from "@/components/ui/Button";

export function LocationMap() {
  return (
    <section className="py-24 px-4 md:px-8 bg-forest-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold-primary uppercase">Find Us</span>
          <h2 className="font-playfair text-4xl md:text-5xl text-cream mt-3">Our Location</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Map */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-gold-primary/15 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <iframe
              title="Ilé Ìtura Ògúnbádéwà Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.2!2d3.5!3d6.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSaheed%20Anibaba%20St%2C%20Ikorodu%2C%20Lagos!5e0!3m2!1sen!2sng!4v1715470000000"
              width="100%"
              height="380"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Contact info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="p-7 rounded-2xl border border-gold-primary/15 bg-linear-to-br from-forest/60 to-forest-dark hover:-translate-y-1 hover:border-gold-primary/30 hover:shadow-[0_16px_40px_rgba(201,168,76,0.1)] transition-all duration-300">
              <h3 className="font-playfair text-xl text-cream mb-6">Contact & Directions</h3>
              <div className="space-y-5 text-[14px]">
                <div className="flex gap-4">
                  <span className="text-gold-primary text-xl mt-0.5">📍</span>
                  <div>
                    <p className="font-cinzel text-[10px] font-bold tracking-[0.12em] text-gold-primary uppercase mb-1">Address</p>
                    <p className="text-cream-muted leading-relaxed">
                      Saheed Anibaba Street,<br />
                      Off Obafemi Awolowo Way<br />
                      (Near Grammar School / Baba Ijebu),<br />
                      Ikorodu, Lagos State, Nigeria
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-gold-primary text-xl">📞</span>
                  <div>
                    <p className="font-cinzel text-[10px] font-bold tracking-[0.12em] text-gold-primary uppercase mb-1">Phone</p>
                    <a href="tel:08129041015" className="block text-cream-muted hover:text-gold-primary transition-colors">08129041015</a>
                    <a href="tel:08060721283" className="block text-cream-muted hover:text-gold-primary transition-colors">08060721283</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-xl">💬</span>
                  <div>
                    <p className="font-cinzel text-[10px] font-bold tracking-[0.12em] text-gold-primary uppercase mb-1">WhatsApp</p>
                    <a href="https://wa.me/2348129041015" target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-300 transition-colors">
                      +234 812 904 1015
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button href="https://www.google.com/maps/dir/?api=1&destination=Saheed+Anibaba+Street+Ikorodu+Lagos" variant="primary" size="sm" target="_blank" rel="noreferrer" className="flex-1 justify-center">
                  Get Directions
                </Button>
                <Button href="tel:08129041015" variant="ghost" size="sm" className="flex-1 justify-center">
                  Call Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
