"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  FormField,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { createService, updateService } from "@/app/actions/services";
import { serviceCategories, type CreateServiceInput } from "@/lib/validations";
import type { Service } from "@prisma/client";

interface ServiceFormProps {
  service?: Service;
  mode?: "create" | "edit";
}

export default function ServiceForm({
  service,
  mode = "create",
}: ServiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isActive, setIsActive] = useState(service?.isActive ?? true);

  const isEdit = mode === "edit";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    // Conversion des champs numériques
    const priceStr = formData.get("price") as string;
    const durationStr = formData.get("duration") as string;

    const data: CreateServiceInput = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      price: priceStr ? parseFloat(priceStr) : 0,
      duration: durationStr ? parseInt(durationStr, 10) : null,
      category: (formData.get("category") as string) || null,
      isActive,
    };

    try {
      const result =
        isEdit && service
          ? await updateService(service.id, data)
          : await createService(data);

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
          isEdit ? "Service modifié avec succès" : "Service créé avec succès"
        );
        router.push("/dashboard/services");
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
          {isEdit ? "Modifier le service" : "Nouveau service"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? "Modifiez les informations du service"
            : "Remplissez les informations du nouveau service"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom */}
          <FormField
            label="Nom du service"
            id="name"
            required
            error={errors.name}
          >
            <Input
              id="name"
              name="name"
              defaultValue={service?.name}
              placeholder="Soin visage complet"
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          </FormField>

          {/* Description */}
          <FormField
            label="Description"
            id="description"
            error={errors.description}
            hint="Décrivez le service en détail"
          >
            <Textarea
              id="description"
              name="description"
              defaultValue={service?.description || ""}
              placeholder="Description détaillée du service..."
              rows={3}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "description-error" : "description-hint"
              }
            />
          </FormField>

          {/* Prix et Durée */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Prix (€)"
              id="price"
              required
              error={errors.price}
              hint="Prix en euros"
            >
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                max="999999.99"
                defaultValue={service?.price.toString()}
                placeholder="50.00"
                required
                aria-invalid={!!errors.price}
                aria-describedby={errors.price ? "price-error" : "price-hint"}
              />
            </FormField>

            <FormField
              label="Durée (minutes)"
              id="duration"
              error={errors.duration}
              hint="Durée estimée du service"
            >
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                max="1440"
                defaultValue={service?.duration?.toString() || ""}
                placeholder="60"
                aria-invalid={!!errors.duration}
                aria-describedby={
                  errors.duration ? "duration-error" : "duration-hint"
                }
              />
            </FormField>
          </div>

          {/* Catégorie */}
          <FormField
            label="Catégorie"
            id="category"
            error={errors.category}
            hint="Choisissez une catégorie pour mieux organiser vos services"
          >
            <Select name="category" defaultValue={service?.category || ""}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {serviceCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Service actif */}
          <FormField
            label=""
            id="isActive"
            hint="Les services inactifs ne seront pas proposés aux clients"
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked === true)}
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Service actif
              </label>
            </div>
          </FormField>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/services")}
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
