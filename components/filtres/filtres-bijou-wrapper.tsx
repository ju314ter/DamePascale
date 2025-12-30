"use client";

import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Slider } from "../ui/slider";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  SubmitHandler,
  useForm,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { CheckboxFilters } from "../ui/checkbox";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import {
  BijouFilters,
  getBijouxCategories,
  getBijouxFleurs,
  getBijouxMatieres,
} from "@/sanity/lib/bijoux/calls";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface FiltresBijouProps {
  handleFiltersChange: (filters: BijouFilters) => void;
  urlParamsArray: {
    categories: string[];
    fleurs: string[];
    matieres: string[];
    price: [number, number];
  };
}

interface FormData {
  categories: { _id: string; title: string; checked: boolean }[];
  matieres: { _id: string; title: string; checked: boolean }[];
  fleurs: { _id: string; title: string; checked: boolean }[];
  price: [number, number];
}

const FiltresBijouxWrapper = ({
  handleFiltersChange,
  urlParamsArray,
}: FiltresBijouProps) => {
  const { register, handleSubmit, setValue, control, watch, getValues } =
    useForm<FormData>({
      defaultValues: {
        categories: [{ _id: "1234-5678", title: "Categorie", checked: true }],
        matieres: [{ _id: "1234-5678", title: "Matière", checked: true }],
        fleurs: [{ _id: "1234-5678", title: "Fleur", checked: true }],
        price: [0, 100],
      },
    });

  useEffect(() => {
    async function fetchBijouxMatieres() {
      const data = await getBijouxMatieres();
      setValue(
        "matieres",
        data.map((matiere) => ({
          ...matiere,
          checked: true,
        }))
      );
    }
    fetchBijouxMatieres();

    async function fetchBijouxFleurs() {
      const data = await getBijouxFleurs();
      setValue(
        "fleurs",
        data.map((fleur) => ({
          ...fleur,
          checked: true,
        }))
      );
    }
    fetchBijouxFleurs();

    async function fetchBijouxCategories() {
      const data = await getBijouxCategories();
      setValue(
        "categories",
        data.map((category) => ({
          ...category,
          checked: true,
        }))
      );
    }
    fetchBijouxCategories();
  }, [setValue]);

  // Check and uncheck filtres according to URLparams
  useEffect(() => {
    const currentCategory = getValues("categories");
    const currentMatiere = getValues("matieres");
    const currentFleur = getValues("fleurs");

    if (urlParamsArray.categories && urlParamsArray.categories.length > 0) {
      setValue(
        "categories",
        currentCategory.map((category: any) => ({
          ...category,
          checked: urlParamsArray.categories.includes(category._id),
        }))
      );
    }

    if (urlParamsArray.matieres && urlParamsArray.matieres.length > 0) {
      setValue(
        "matieres",
        currentMatiere.map((matiere: any) => ({
          ...matiere,
          checked: urlParamsArray.matieres.includes(matiere._id),
        }))
      );
    }

    if (urlParamsArray.fleurs && urlParamsArray.fleurs.length > 0) {
      setValue(
        "fleurs",
        currentFleur.map((fleur: any) => ({
          ...fleur,
          checked: urlParamsArray.fleurs.includes(fleur._id),
        }))
      );
    }

    if (urlParamsArray.price) {
      setValue("price", urlParamsArray.price);
    }
  }, [urlParamsArray, getValues, setValue]);

  const onSubmit: SubmitHandler<any> = (data) => {
    const newFilters: BijouFilters = {
      categories: getValues("categories")
        .filter((category: any) => category.checked)
        .map((category: any) => category._id),
      matieres: getValues("matieres")
        .filter((matiere: any) => matiere.checked)
        .map((matiere: any) => matiere._id),
      fleurs: getValues("fleurs")
        .filter((fleur: any) => fleur.checked)
        .map((fleur: any) => fleur._id),
      price: getValues("price"),
    };
    handleFiltersChange(newFilters);
  };

  const { fields: fieldCategory } = useFieldArray({
    name: "categories",
    control,
  });
  const { fields: fieldMatiere } = useFieldArray({
    name: "matieres",
    control,
  });
  const { fields: fieldFleur } = useFieldArray({
    name: "fleurs",
    control,
  });

  const watchedFields = useWatch({ control });

  function handleSliderChange(value: number[]): void {
    if (value.length === 2) {
      const [min, max] = value;
      setValue("price", [min, max]);
    }
  }

  function handleSelectAll(bool: boolean): void {
    fieldCategory.forEach((_, index) => {
      setValue(`categories.${index}.checked`, bool, { shouldDirty: true });
    });
    fieldMatiere.forEach((_, index) => {
      setValue(`matieres.${index}.checked`, bool, { shouldDirty: true });
    });
    fieldFleur.forEach((_, index) => {
      setValue(`fleurs.${index}.checked`, bool, { shouldDirty: true });
    });
  }

  return (
    <Sheet key={"left"}>
      <SheetTrigger className="relative flex justify-center items-center h-[50px] w-[40%]">
        <div
          className={cn(
            "text-xl font-bold border border-transparent hover:bg-secondary hover:border-primary hover:text-primary w-[100%]",
            buttonVariants({ variant: "cta" })
          )}
        >
          Filtres
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">Filtres</SheetTitle>
          <SheetDescription>
            Faites votre sélection parmis nos univers colorés et populaires.
          </SheetDescription>
          <div className="flex justify-center items-center w-full gap-2">
            <Button variant={"action"} onClick={() => handleSelectAll(true)}>
              Tous
            </Button>
            <Button variant={"action"} onClick={() => handleSelectAll(false)}>
              Aucun
            </Button>
          </div>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <Label className="py-4 italic">Categories :</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap">
                    {fieldCategory.map((category: any, i) => (
                      <div
                        key={category._id} // Ensure unique key
                        className="flex items-center gap-2 justify-center p-1"
                      >
                        <CheckboxFilters
                          id={category._id}
                          checked={
                            watchedFields.categories?.[i]?.checked ?? false
                          }
                          {...register(`categories.${i}._id`)}
                          onCheckedChange={(checked: boolean) => {
                            setValue(`categories.${i}.checked`, checked, {
                              shouldDirty: true,
                            });
                          }}
                        >
                          {category.title}
                        </CheckboxFilters>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <Label className="py-4 italic">Matière :</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap">
                    {fieldMatiere.map((matiere: any, i) => (
                      <div
                        key={matiere._id} // Ensure unique key
                        className="flex items-center gap-2 justify-center p-1"
                      >
                        <CheckboxFilters
                          id={matiere._id}
                          checked={
                            watchedFields.matieres?.[i]?.checked ?? false
                          }
                          {...register(`matieres.${i}._id`)}
                          onCheckedChange={(checked: boolean) => {
                            setValue(`matieres.${i}.checked`, checked, {
                              shouldDirty: true,
                            });
                          }}
                        >
                          {matiere.title}
                        </CheckboxFilters>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <Label className="py-4 italic">Fleur :</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap">
                    {fieldFleur.map((fleur: any, i) => (
                      <div
                        key={fleur._id} // Ensure unique key
                        className="flex items-center gap-2 justify-center p-1"
                      >
                        <CheckboxFilters
                          id={fleur._id}
                          checked={watchedFields.fleurs?.[i]?.checked ?? false}
                          {...register(`fleurs.${i}._id`)}
                          onCheckedChange={(checked: boolean) => {
                            setValue(`fleurs.${i}.checked`, checked, {
                              shouldDirty: true,
                            });
                          }}
                        >
                          {fleur.title}
                        </CheckboxFilters>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  <Label className="py-4 italic">Prix :</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="rounded-none border-none h-10 w-full flex justify-center items-center">
                    <p className="text-base px-2">{watch("price")[0]}</p>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      defaultValue={[
                        getValues("price")[0],
                        getValues("price")[1],
                      ]}
                      onValueChange={handleSliderChange}
                    />
                    <p className="text-base px-2">{watch("price")[1]}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <SheetFooter>
            <SheetClose
              asChild
              className="flex justify-center items-center w-full"
            >
              <Button type="submit" variant={"cta"}>
                Appliquer
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default FiltresBijouxWrapper;
