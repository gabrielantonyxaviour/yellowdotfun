import { CreateTokenForm } from "@/components/create/create-token-form";

export default function CreateTokenPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-black yellow-text mb-8">
        Create Your Memecoin
      </h1>

      <div className="max-w-3xl mx-auto">
        <CreateTokenForm />
      </div>
    </main>
  );
}
