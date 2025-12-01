import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardNav from "@/components/DashboardNav";
import { SkipLink } from "@/components/SkipLink";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Skip link pour navigation clavier */}
      <SkipLink />

      {/* Header avec navigation - présent sur toutes les pages */}
      <header role="banner">
        <DashboardNav
          userName={session.user?.name}
          userEmail={session.user?.email}
        />
      </header>

      {/* Contenu principal avec ID pour skip link */}
      <main id="main-content" role="main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
