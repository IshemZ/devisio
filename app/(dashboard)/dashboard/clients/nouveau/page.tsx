import { Metadata } from "next";
import { ClientForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Nouveau client - Solkant",
  description: "Ajouter un nouveau client",
};

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Nouveau client</h1>
        <p className="mt-2 text-muted-foreground">
          Créez une fiche client pour faciliter la génération de devis.
        </p>
      </div>

      <ClientForm />
    </div>
  );
}
