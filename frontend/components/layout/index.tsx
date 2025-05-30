import { AppHeader } from "./app-header";
import { Footer } from "./footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      {children}
      <Footer />
    </div>
  );
}
