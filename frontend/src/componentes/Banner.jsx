/* ── Promotional Banner Component ── */
const Banner = () => (
  <section className="bg-primary text-on-primary px-margin-mobile md:px-margin-desktop py-xl border-y border-on-primary">
    <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-md text-center md:text-left">
      <div className="flex flex-col gap-xs">
        <h2 className="font-headline-lg text-headline-lg font-bold tracking-tighter uppercase">Professional Grade Audio</h2>
        <p className="font-body-lg text-body-lg text-inverse-primary">Complimentary express shipping on all orders over $500.</p>
      </div>
      <button className="btn-secondary px-8 py-4 font-label-md text-label-md uppercase tracking-widest border-2 border-on-primary hover:bg-surface-variant transition-colors">
        Shop Collection
      </button>
    </div>
  </section>
);

export default Banner;
