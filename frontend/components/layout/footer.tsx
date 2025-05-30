import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              yellow.fun
            </h3>
            <p className="text-gray-300">
              The first memecoin trading platform powered by Yellow Protocol's
              state channels.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tokens"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Tokens
                </Link>
              </li>
              <li>
                <Link
                  href="/create"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Create Token
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://twitter.com/gabrielaxyeth"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Telegram
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Discord
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} yellow.fun. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
