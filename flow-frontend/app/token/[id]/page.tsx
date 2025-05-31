import { AppHeader } from "@/components/layout/app-header";
import { TokenDetail } from "@/components/token-detail/token-detail";
import { Footer } from "@/components/layout/footer";

export default function TokenPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <TokenDetail tokenId={params.id} />
    </main>
  );
}
