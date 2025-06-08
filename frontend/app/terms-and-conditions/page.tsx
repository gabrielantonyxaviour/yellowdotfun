import { AppHeader } from "@/components/layout/app-header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditionsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-black yellow-text mb-8">
        Terms and Conditions
      </h1>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Last Updated: May 2025</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing and using yellow.fun, you agree to be bound by these
              Terms and Conditions. If you do not agree to these terms, please
              do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Platform Description</h2>
            <p className="text-gray-700">
              yellow.fun is a memecoin trading platform powered by Yellow
              Protocol's state channels. We provide a platform for users to
              trade memecoins on various EVM chains.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              3. User Responsibilities
            </h2>
            <p className="text-gray-700">
              Users are responsible for maintaining the security of their
              accounts, understanding the risks associated with cryptocurrency
              trading, and complying with all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Trading Risks</h2>
            <p className="text-gray-700">
              Cryptocurrency trading involves significant risk. Users should
              only trade with funds they can afford to lose. We do not provide
              financial advice and make no guarantees regarding trading
              outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Platform Rules</h2>
            <p className="text-gray-700">
              Users must not engage in market manipulation, fraud, or any other
              activities that could harm the platform or other users. We reserve
              the right to suspend or terminate accounts that violate these
              rules.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              6. Intellectual Property
            </h2>
            <p className="text-gray-700">
              All content, features, and functionality of yellow.fun are owned
              by us and are protected by international copyright, trademark, and
              other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-700">
              We are not liable for any direct, indirect, incidental, special,
              or consequential damages resulting from your use of or inability
              to use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. Users will
              be notified of significant changes, and continued use of the
              platform constitutes acceptance of the modified terms.
            </p>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
