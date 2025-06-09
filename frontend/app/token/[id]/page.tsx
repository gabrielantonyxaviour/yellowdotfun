import { TokenDetail } from "@/components/token-detail/token-detail";

export default function TokenPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <TokenDetail tokenId={params.id} />
    </main>
  );
}
