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

interface FiltresBijouProps {
  handleFiltersChange: (filters: BijouFilters) => void;
  urlParamsArray: {
    category: string[];
    fleur: string[];
    matiere: string[];
    size: string[];
    price: number[];
  };
}

const FiltresBijouxWrapper = ({
  handleFiltersChange,
  urlParamsArray,
}: FiltresBijouProps) => {
  const { register, handleSubmit, setValue, control, watch, getValues } =
    useForm<any>({
      defaultValues: {
        category: [{ _id: "1234-5678", title: "Categorie", checked: true }],
        matiere: [{ _id: "1234-5678", title: "Matière", checked: true }],
        fleur: [{ _id: "1234-5678", title: "Fleur", checked: true }],
        size: [
          { _id: "S", title: "Small", checked: true },
          { _id: "M", title: "Medium", checked: true },
          { _id: "L", title: "Large", checked: true },
        ],
        price: [0, 100],
      },
    });

  useEffect(() => {
    async function fetchBijouxMatieres() {
      const data = await getBijouxMatieres();
      setValue(
        "matiere",
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
        "fleur",
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
        "category",
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
    const currentCategory = getValues("category");
    const currentMatiere = getValues("matiere");
    const currentFleur = getValues("fleur");
    const currentSize = getValues("size");

    if (urlParamsArray.category.length > 0) {
      setValue(
        "category",
        currentCategory.map((category: any) => ({
          ...category,
          checked: urlParamsArray.category.includes(category._id),
        }))
      );
    }

    if (urlParamsArray.matiere.length > 0) {
      setValue(
        "matiere",
        currentMatiere.map((matiere: any) => ({
          ...matiere,
          checked: urlParamsArray.matiere.includes(matiere._id),
        }))
      );
    }

    if (urlParamsArray.fleur.length > 0) {
      setValue(
        "fleur",
        currentFleur.map((fleur: any) => ({
          ...fleur,
          checked: urlParamsArray.fleur.includes(fleur._id),
        }))
      );
    }

    if (urlParamsArray.size.length > 0) {
      setValue(
        "size",
        currentSize.map((size: any) => ({
          ...size,
          checked: urlParamsArray.size.includes(size._id),
        }))
      );
    }

    if (urlParamsArray.price) {
      setValue("price", urlParamsArray.price);
    }
  }, [urlParamsArray, getValues, setValue]);

  const onSubmit: SubmitHandler<any> = (data) => {
    const newFilters: BijouFilters = {
      category: getValues("category")
        .filter((category: any) => category.checked)
        .map((category: any) => category._id),
      matiere: getValues("matiere")
        .filter((matiere: any) => matiere.checked)
        .map((matiere: any) => matiere._id),
      fleur: getValues("fleur")
        .filter((fleur: any) => fleur.checked)
        .map((fleur: any) => fleur._id),
      size: getValues("size")
        .filter((size: any) => size.checked)
        .map((size: any) => size._id),
      price: getValues("price"),
    };
    handleFiltersChange(newFilters);
  };

  const { fields: fieldSize } = useFieldArray({ name: "size", control });
  const { fields: fieldCategory } = useFieldArray({
    name: "category",
    control,
  });
  const { fields: fieldMatiere } = useFieldArray({
    name: "matiere",
    control,
  });
  const { fields: fieldFleur } = useFieldArray({
    name: "fleur",
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
      setValue(`category.${index}.checked`, bool, { shouldDirty: true });
    });
    fieldMatiere.forEach((_, index) => {
      setValue(`matiere.${index}.checked`, bool, { shouldDirty: true });
    });
    fieldFleur.forEach((_, index) => {
      setValue(`fleur.${index}.checked`, bool, { shouldDirty: true });
    });
    fieldSize.forEach((_, index) => {
      setValue(`size.${index}.checked`, bool, { shouldDirty: true });
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
            <Label className="py-4 italic">Categories :</Label>
            <div className="flex flex-wrap m-4">
              {fieldCategory.map((category: any, i) => (
                <div
                  key={category._id} // Ensure unique key
                  className="flex items-center gap-2 justify-center p-1"
                >
                  <CheckboxFilters
                    id={category._id}
                    checked={watchedFields.category?.[i]?.checked ?? false}
                    {...register(`category.${i}._id`)}
                    onCheckedChange={(checked: boolean) => {
                      setValue(`category.${i}.checked`, checked, {
                        shouldDirty: true,
                      });
                    }}
                  >
                    {category.title}
                  </CheckboxFilters>
                </div>
              ))}
            </div>

            <Label className="py-4 italic">Matière :</Label>
            <div className="flex flex-wrap m-4">
              {fieldMatiere.map((matiere: any, i) => (
                <div
                  key={matiere._id} // Ensure unique key
                  className="flex items-center gap-2 justify-center p-1"
                >
                  <CheckboxFilters
                    id={matiere._id}
                    checked={watchedFields.matiere?.[i]?.checked ?? false}
                    {...register(`matiere.${i}._id`)}
                    onCheckedChange={(checked: boolean) => {
                      setValue(`matiere.${i}.checked`, checked, {
                        shouldDirty: true,
                      });
                    }}
                  >
                    {matiere.title}
                  </CheckboxFilters>
                </div>
              ))}
            </div>

            <Label className="py-4 italic">Fleur :</Label>
            <div className="flex flex-wrap m-4">
              {fieldFleur.map((fleur: any, i) => (
                <div
                  key={fleur._id} // Ensure unique key
                  className="flex items-center gap-2 justify-center p-1"
                >
                  <CheckboxFilters
                    id={fleur._id}
                    checked={watchedFields.fleur?.[i]?.checked ?? false}
                    {...register(`fleur.${i}._id`)}
                    onCheckedChange={(checked: boolean) => {
                      setValue(`fleur.${i}.checked`, checked, {
                        shouldDirty: true,
                      });
                    }}
                  >
                    {fleur.title}
                  </CheckboxFilters>
                </div>
              ))}
            </div>

            <Label className="py-4 italic">Tailles :</Label>
            <div className="flex flex-wrap m-4">
              {fieldSize.map((size: any, i) => (
                <div
                  key={size._id} // Ensure unique key
                  className="flex items-center gap-2 justify-center p-1"
                >
                  <CheckboxFilters
                    id={size._id}
                    checked={watchedFields.size?.[i]?.checked ?? false}
                    {...register(`size.${i}._id`)}
                    onCheckedChange={(checked: boolean) => {
                      setValue(`size.${i}.checked`, checked, {
                        shouldDirty: true,
                      });
                    }}
                  >
                    {size.title}
                  </CheckboxFilters>
                </div>
              ))}
            </div>
            <Label className="py-4 italic">Prix :</Label>
            <div className="rounded-none border-none h-10 w-full flex justify-center items-center">
              <p className="text-base px-2">{watch("price")[0]}</p>
              <Slider
                min={0}
                max={100}
                step={1}
                defaultValue={[getValues("price")[0], getValues("price")[1]]}
                onValueChange={handleSliderChange}
              />
              <p className="text-base px-2">{watch("price")[1]}</p>
            </div>
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
