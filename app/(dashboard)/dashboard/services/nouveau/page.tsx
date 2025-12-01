import { Metadata } from "next";
import { ServiceForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Nouveau service - Devisio",
  description: "Ajouter un nouveau service",
};

export default function NewServicePage() {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Nouveau service</h1>
        <p className="mt-2 text-muted-foreground">
          Créez un service pour l&apos;ajouter à vos devis.
        </p>
      </div>

      <ServiceForm />
    </div>
  );
}
