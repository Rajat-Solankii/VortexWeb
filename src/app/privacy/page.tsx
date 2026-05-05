export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-white/60 text-lg">Effective Date: May 2026</p>
        </header>

        <section className="space-y-8 text-white/80 leading-relaxed">
          <p>
            At Vortex, we prioritize your privacy. This policy outlines how we handle information and data when you use our platform.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">1. Information Collection</h2>
            <p>
              We do not require user registration or personal identification to access our main services. However, we may collect non-identifiable technical information, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>Browser type and version.</li>
              <li>Operating system.</li>
              <li>Referring website.</li>
              <li>Generic geographic location (Country level).</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">2. Cookies and Third-Party Services</h2>
            <p>
              We use cookies to improve your experience and analyze our traffic. We also integrate third-party services that may collect data:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-white font-medium mb-2">Google AdSense</h3>
                <p className="text-sm text-white/60">
                  Google uses cookies to serve ads based on a user's prior visits to our website or other websites. You may opt out of personalized advertising by visiting Google's Ad Settings.
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-white font-medium mb-2">Vercel Analytics</h3>
                <p className="text-sm text-white/60">
                  We use Vercel Analytics to understand how visitors interact with our site. This data is anonymized and used for performance optimization.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">3. External Links</h2>
            <p>
              Our Site contains links to external websites. We are not responsible for the privacy practices or the content of such websites. We encourage you to read the privacy policies of any site you visit via a link from Vortex.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">4. Children's Privacy</h2>
            <p>
              Vortex does not knowingly collect any personal identifiable information from children under the age of 13. If a parent or guardian believes that the Site has such information in its database, please contact us immediately.
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-white/10">
            <p className="text-sm text-white/40">
              If you have any questions about this Privacy Policy, please contact us at <span className="text-blue-400">watchvortexofficial@gmail.com</span>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
