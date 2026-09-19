"use client";

import { useEffect, useRef, useState } from "react";
import { CustomSelect } from "@/components/CustomSelect";

export type ProductFormValues = {
  name: string;
  shortDescription: string;
  fullDescription: string;
  /** The normal price. Shown crossed out while a sale price is set. */
  regularPrice: number;
  /** What customers pay during a sale; null means no sale. */
  salePrice: number | null;
  categoryName: string;
  gender: "WOMEN" | "MEN" | "UNISEX";
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  material: string;
  fit: string;
  care: string;
  featured: boolean;
  isNewDrop: boolean;
  trending: boolean;
};

const EMPTY_VALUES: ProductFormValues = {
  name: "",
  shortDescription: "",
  fullDescription: "",
  regularPrice: 0,
  salePrice: null,
  categoryName: "",
  gender: "UNISEX",
  status: "DRAFT",
  material: "",
  fit: "",
  care: "",
  featured: false,
  isNewDrop: false,
  trending: false,
};

const inputClass =
  "w-full rounded border border-soft-black/15 bg-white px-3 py-2 text-sm text-soft-black focus:border-electric-violet focus:outline-none";
const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-soft-black/50";

export function ProductForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: Partial<ProductFormValues>;
  submitLabel: string;
}) {
  const values = { ...EMPTY_VALUES, ...defaultValues };
  const [regular, setRegular] = useState(String(values.regularPrice || ""));
  const [sale, setSale] = useState(
    values.salePrice === null ? "" : String(values.salePrice),
  );
  const saleRef = useRef<HTMLInputElement>(null);

  const regularNum = Number(regular);
  const saleNum = Number(sale);
  const hasSale = sale.trim() !== "";
  const saleInvalid =
    hasSale &&
    (!Number.isFinite(saleNum) ||
      saleNum <= 0 ||
      (Number.isFinite(regularNum) && saleNum >= regularNum));
  const percentOff =
    hasSale && !saleInvalid && regularNum > 0
      ? Math.round(((regularNum - saleNum) / regularNum) * 100)
      : null;

  // Stops the form from submitting with a "sale" that isn't really cheaper.
  useEffect(() => {
    saleRef.current?.setCustomValidity(
      saleInvalid ? "The sale price must be lower than the regular price." : "",
    );
  }, [saleInvalid]);

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-6">
      <div>
        <label htmlFor="name" className={labelClass}>
          Product Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={values.name}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="shortDescription" className={labelClass}>
          Short Description
        </label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          required
          rows={2}
          defaultValue={values.shortDescription}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="fullDescription" className={labelClass}>
          Full Description
        </label>
        <textarea
          id="fullDescription"
          name="fullDescription"
          required
          rows={5}
          defaultValue={values.fullDescription}
          className={inputClass}
        />
      </div>

      <div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="regularPrice" className={labelClass}>
              Regular Price (EGP)
            </label>
            <input
              id="regularPrice"
              name="regularPrice"
              type="number"
              min={0}
              step="0.01"
              required
              value={regular}
              onChange={(e) => setRegular(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="salePrice" className={labelClass}>
              Sale Price (EGP, optional)
            </label>
            <input
              ref={saleRef}
              id="salePrice"
              name="salePrice"
              type="number"
              min={0}
              step="0.01"
              value={sale}
              onChange={(e) => setSale(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <p
          className={`mt-2 text-xs ${
            saleInvalid ? "text-magenta" : "text-soft-black/45"
          }`}
        >
          {saleInvalid
            ? "The sale price must be lower than the regular price."
            : percentOff !== null
              ? `On sale: customers will pay EGP ${saleNum.toLocaleString("en-US")} and see EGP ${regularNum.toLocaleString("en-US")} crossed out with “SAVE ${percentOff}%”.`
              : "Customers pay the Regular Price. To run a sale, type a lower Sale Price; clear it to end the sale."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className={labelClass}>
            Category (optional)
          </label>
          <input
            id="category"
            name="category"
            placeholder="e.g. Hoodies"
            defaultValue={values.categoryName}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="gender" className={labelClass}>
            Gender
          </label>
          <CustomSelect
            id="gender"
            name="gender"
            defaultValue={values.gender}
            theme="light"
            options={[
              { value: "UNISEX", label: "Unisex" },
              { value: "WOMEN", label: "Women" },
              { value: "MEN", label: "Men" },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="material" className={labelClass}>
            Material
          </label>
          <input
            id="material"
            name="material"
            defaultValue={values.material}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="fit" className={labelClass}>
            Fit
          </label>
          <input
            id="fit"
            name="fit"
            defaultValue={values.fit}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="care" className={labelClass}>
            Care
          </label>
          <input
            id="care"
            name="care"
            defaultValue={values.care}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className={labelClass}>
          Status
        </label>
        <CustomSelect
          id="status"
          name="status"
          defaultValue={values.status}
          theme="light"
          className="max-w-40"
          options={[
            { value: "DRAFT", label: "Draft" },
            { value: "ACTIVE", label: "Active" },
            { value: "ARCHIVED", label: "Archived" },
          ]}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-soft-black/70">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={values.featured}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-soft-black/70">
          <input
            type="checkbox"
            name="isNewDrop"
            defaultChecked={values.isNewDrop}
          />
          New Drop
        </label>
        <label className="flex items-center gap-2 text-sm text-soft-black/70">
          <input
            type="checkbox"
            name="trending"
            defaultChecked={values.trending}
          />
          Trending
        </label>
      </div>

      <button
        type="submit"
        className="w-fit bg-soft-black px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-warm-white transition-opacity hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}
