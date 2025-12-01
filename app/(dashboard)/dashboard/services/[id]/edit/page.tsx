import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ServiceForm } from "@/components/forms";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Modifier service - Devisio",
  description: "Modifier les informations d'un service",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    notFound();
  }

  // Récupérer le service avec vérification du tenant
  const service = await prisma.service.findFirst({
    where: {
      id,
      businessId: session.user.businessId,
    },
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Modifier le service
        </h1>
        <p className="mt-2 text-muted-foreground">{service.name}</p>
      </div>

      <ServiceForm service={service} mode="edit" />
    </div>
  );
}
