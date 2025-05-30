import { AppHeader } from "./app-header";
import { Footer } from "./footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      {children}
      {JSON.parse(process.env.NEXT_PUBLIC_IS_BROWSER || "false") && <Footer />}
    </div>
  );
}
