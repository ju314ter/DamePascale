"use client";

import React, { useContext, useEffect } from "react";
import { Button } from "../ui/button";
import { buttonVariants } from "@/components/ui/button";
import {
  AmigurumiFilters,
  getAmigurumisCategories,
  getAmigurumisUnivers,
} from "@/sanity/lib/amigurumis/calls";
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

interface FiltresAmigurumiProps {
  handleFiltersChange: (filters: AmigurumiFilters) => void;
  urlParamsArray: {
    category: string[];
    univers: string[];
    size: string[];
    price: [number, number];
  };
}

interface FormData {
  category: { _id: string; title: string; checked: boolean }[];
  univers: { _id: string; title: string; checked: boolean }[];
  size: { _id: string; title: string; checked: boolean }[];
  price: [number, number];
}

const FiltresAmigurumiWrapper = ({
  handleFiltersChange,
  urlParamsArray,
}: FiltresAmigurumiProps) => {
  const { register, handleSubmit, setValue, control, watch, getValues } =
    useForm<FormData>({
      defaultValues: {
        category: [{ _id: "1234-5678", title: "Category", checked: true }],
        univers: [{ _id: "1234-5678", title: "Univers", checked: true }],
        size: [
          { _id: "S", title: "Small", checked: true },
          { _id: "M", title: "Medium", checked: true },
          { _id: "L", title: "Large", checked: true },
        ],
        price: [0, 100],
      },
    });

  useEffect(() => {
    async function fetchAmigurumisUnivers() {
      const data = await getAmigurumisUnivers();
      setValue(
        "univers",
        data.map((univers) => ({
          ...univers,
          checked: true,
        }))
      );
    }
    fetchAmigurumisUnivers();

    async function fetchAmigurumisCategories() {
      const data = await getAmigurumisCategories();
      setValue(
        "category",
        data.map((category) => ({
          ...category,
          checked: true,
        }))
      );
    }
    fetchAmigurumisCategories();
  }, [setValue]);

  // Check and uncheck filtres according to URLparams
  useEffect(() => {
    const currentCategory = getValues("category");
    const currentUnivers = getValues("univers");
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

    if (urlParamsArray.univers.length > 0) {
      setValue(
        "univers",
        currentUnivers.map((univers: any) => ({
          ...univers,
          checked: urlParamsArray.univers.includes(univers._id),
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
    const newFilters: AmigurumiFilters = {
      category: getValues("category")
        .filter((category: any) => category.checked)
        .map((category: any) => category._id),
      univers: getValues("univers")
        .filter((univers: any) => univers.checked)
        .map((univers: any) => univers._id),
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
  const { fields: fieldUnivers } = useFieldArray({
    name: "univers",
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
    fieldUnivers.forEach((_, index) => {
      setValue(`univers.${index}.checked`, bool, { shouldDirty: true });
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

            <Label className="py-4 italic">Univers :</Label>
            <div className="flex flex-wrap m-4">
              {fieldUnivers.map((univers: any, i) => (
                <div
                  key={univers._id} // Ensure unique key
                  className="flex items-center gap-2 justify-center p-1"
                >
                  <CheckboxFilters
                    id={univers._id}
                    checked={watchedFields.univers?.[i]?.checked ?? false}
                    {...register(`univers.${i}._id`)}
                    onCheckedChange={(checked: boolean) => {
                      setValue(`univers.${i}.checked`, checked, {
                        shouldDirty: true,
                      });
                    }}
                  >
                    {univers.title}
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
              <p className="px-2">{watch("price")[0]}</p>
              <Slider
                min={0}
                max={100}
                step={1}
                defaultValue={[getValues("price")[0], getValues("price")[1]]}
                onValueChange={handleSliderChange}
              />
              <p className="px-2">{watch("price")[1]}</p>
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

export default FiltresAmigurumiWrapper;
