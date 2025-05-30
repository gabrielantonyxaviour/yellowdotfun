import { AppHeader } from "@/components/layout/app-header"
import { CreateTokenForm } from "@/components/create/create-token-form"
import { Footer } from "@/components/layout/footer"
import { WalletProvider } from "@/contexts/wallet-context"

export default function CreateTokenPage() {
  return (
    <WalletProvider>
      <div className="min-h-screen">
        <AppHeader />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-black yellow-text mb-8">Create Your Memecoin</h1>

          <div className="max-w-3xl mx-auto">
            <CreateTokenForm />
          </div>
        </main>
        <Footer />
      </div>
    </WalletProvider>
  )
}
