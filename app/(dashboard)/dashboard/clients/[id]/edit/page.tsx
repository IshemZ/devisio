import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ClientForm from "../../_components/ClientForm";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Modifier client - Solkant",
  description: "Modifier les informations d'un client",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    notFound();
  }

  // Récupérer le client avec vérification du tenant
  const client = await prisma.client.findFirst({
    where: {
      id,
      businessId: session.user.businessId,
    },
  });

  if (!client) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Modifier le client
        </h1>
        <p className="mt-2 text-muted-foreground">
          {client.firstName} {client.lastName}
        </p>
      </div>

      <ClientForm client={client} mode="edit" />
    </div>
  );
}
