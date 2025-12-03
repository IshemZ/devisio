"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Button,
  Input,
  Textarea,
  FormField,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { createClient, updateClient } from "@/app/actions/clients";
import type { CreateClientInput } from "@/lib/validations";
import type { Client } from "@prisma/client";

interface ClientFormProps {
  client?: Client;
  mode?: "create" | "edit";
}

export default function ClientForm({
  client,
  mode = "create",
}: ClientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = mode === "edit";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data: CreateClientInput = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      address: (formData.get("address") as string) || null,
      notes: (formData.get("notes") as string) || null,
    };

    try {
      const result =
        isEdit && client
          ? await updateClient(client.id, data)
          : await createClient(data);

      if (result.error) {
        toast.error(result.error);
        if (result.fieldErrors) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(result.fieldErrors).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              fieldErrors[key] = value[0];
            }
          });
          setErrors(fieldErrors);
        }
      } else {
        toast.success(
          isEdit ? "Client modifié avec succès" : "Client créé avec succès"
        );
        router.push("/dashboard/clients");
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEdit ? "Modifier le client" : "Nouveau client"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? "Modifiez les informations du client"
            : "Remplissez les informations du nouveau client"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prénom et Nom */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Prénom"
              id="firstName"
              required
              error={errors.firstName}
            >
              <Input
                id="firstName"
                name="firstName"
                defaultValue={client?.firstName}
                required
                aria-invalid={!!errors.firstName}
                aria-describedby={
                  errors.firstName ? "firstName-error" : undefined
                }
              />
            </FormField>

            <FormField
              label="Nom"
              id="lastName"
              required
              error={errors.lastName}
            >
              <Input
                id="lastName"
                name="lastName"
                defaultValue={client?.lastName}
                required
                aria-invalid={!!errors.lastName}
                aria-describedby={
                  errors.lastName ? "lastName-error" : undefined
                }
              />
            </FormField>
          </div>

          {/* Email et Téléphone */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Email"
              id="email"
              error={errors.email}
              hint="Format : exemple@email.com"
            >
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={client?.email || ""}
                placeholder="exemple@email.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : "email-hint"}
              />
            </FormField>

            <FormField
              label="Téléphone"
              id="phone"
              error={errors.phone}
              hint="Format français : 06 12 34 56 78"
            >
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={client?.phone || ""}
                placeholder="06 12 34 56 78"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
              />
            </FormField>
          </div>

          {/* Adresse */}
          <FormField label="Adresse" id="address" error={errors.address}>
            <Input
              id="address"
              name="address"
              defaultValue={client?.address || ""}
              placeholder="123 Rue Exemple, 75001 Paris"
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? "address-error" : undefined}
            />
          </FormField>

          {/* Notes */}
          <FormField
            label="Notes"
            id="notes"
            error={errors.notes}
            hint="Informations supplémentaires sur le client"
          >
            <Textarea
              id="notes"
              name="notes"
              defaultValue={client?.notes || ""}
              placeholder="Notes, préférences, historique..."
              rows={4}
              aria-invalid={!!errors.notes}
              aria-describedby={errors.notes ? "notes-error" : "notes-hint"}
            />
          </FormField>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/clients")}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? "Modification..."
                  : "Création..."
                : isEdit
                ? "Modifier"
                : "Créer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
