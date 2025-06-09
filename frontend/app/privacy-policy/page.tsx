import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-black yellow-text mb-8">Privacy Policy</h1>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Last Updated: May 2025</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700">
              We collect information that you provide directly to us, including
              wallet addresses, transaction data, and any other information you
              choose to provide when using our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700">
              We use the information we collect to provide, maintain, and
              improve our services, to process transactions, to communicate with
              you, and to comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
            <p className="text-gray-700">
              We do not sell your personal information. We may share your
              information with service providers who assist in operating our
              platform, or when required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Blockchain Data</h2>
            <p className="text-gray-700">
              Please note that blockchain transactions are public and immutable.
              Any information you include in a blockchain transaction will be
              publicly visible and cannot be deleted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Security</h2>
            <p className="text-gray-700">
              We implement appropriate technical and organizational measures to
              protect your information. However, no method of transmission over
              the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p className="text-gray-700">
              Depending on your location, you may have certain rights regarding
              your personal information, including the right to access, correct,
              or delete your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700">
              We use cookies and similar tracking technologies to improve your
              experience on our platform. You can control cookie settings
              through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              8. Changes to This Policy
            </h2>
            <p className="text-gray-700">
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about this privacy policy, please
              contact us through our support channels.
            </p>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
