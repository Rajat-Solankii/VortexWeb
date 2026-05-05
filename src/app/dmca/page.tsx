export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">DMCA Policy</h1>
          <p className="text-white/60 text-lg">Digital Millennium Copyright Act Notice</p>
        </header>

        <section className="space-y-6 text-white/80 leading-relaxed">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <p className="font-medium text-white mb-2">Notice to Copyright Holders</p>
            <p>
              Vortex (referred to as "the Site") respect the intellectual property of others. The Site does not host, store, or upload any video files, media, or copyrighted content on its servers. All content provided on the Site is aggregated from third-party sources and embedded using links.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">1. Content Policy</h2>
            <p>
              The Site acts as a search engine and aggregator for content that is already publicly available on the internet. We do not have control over the content hosted on third-party servers. If you believe your copyrighted work is being linked to from our site without authorization, you must contact the hosting provider directly to have the content removed from the source.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">2. Takedown Requests</h2>
            <p>
              If you are a copyright owner or an agent thereof and believe that any content linked on the Site infringes upon your copyrights, you may submit a notification pursuant to the Digital Millennium Copyright Act ("DMCA") by providing our Copyright Agent with the following information in writing:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed;</li>
              <li>Identification of the copyrighted work claimed to have been infringed;</li>
              <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit the service provider to locate the material (e.g., specific URLs);</li>
              <li>Information reasonably sufficient to permit the service provider to contact you, such as an address, telephone number, and, if available, an electronic mail address;</li>
              <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law;</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">3. Contact Information</h2>
            <p>
              Please send all DMCA notices to: <br />
              <span className="text-blue-400 font-medium">watchvortexofficial@gmail.com</span>
            </p>
            <p className="text-sm text-white/50 italic">
              Please allow 48-72 hours for a response. Note that emailing your complaint to other parties such as our Internet Service Provider will not expedite your request and may result in a delayed response due the complaint not properly being filed.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
