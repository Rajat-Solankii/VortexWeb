export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-white/60 text-lg">Last Updated: May 2026</p>
        </header>

        <section className="space-y-8 text-white/80 leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Vortex (the "Site"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">2. Use License</h2>
            <p>
              The Site provides a platform for indexing and linking to content hosted by third parties. You understand that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>The Site does not host any content on its own servers.</li>
              <li>Links to third-party content are provided for informational and convenience purposes only.</li>
              <li>We do not guarantee the availability, quality, or legality of content hosted on third-party sites.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">3. Disclaimer</h2>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <p className="uppercase text-xs font-bold tracking-widest text-white/40 mb-3">Important Notice</p>
              <p className="italic">
                The materials on the Site are provided on an 'as is' basis. Vortex makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">4. Limitations of Liability</h2>
            <p>
              In no event shall Vortex or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Site, even if Vortex or a Vortex authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">5. Governing Law</h2>
            <p>
              Any claim relating to the Site shall be governed by the laws of the jurisdiction in which the site operator resides without regard to its conflict of law provisions.
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-white/10">
            <p className="text-sm text-white/40">
              For any questions regarding these terms, please contact us at <span className="text-blue-400">watchvortexofficial@gmail.com</span>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
