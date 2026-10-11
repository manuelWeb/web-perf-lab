"use client";

import { useRef } from "react";

type CatalogueIndicatorsDialogProps = {
  indicators: readonly {
    label: string;
    value: number | string;
  }[];
};

export function CatalogueIndicatorsDialog({
  indicators,
}: CatalogueIndicatorsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className="inline-flex h-11 w-fit items-center justify-center rounded-md border border-zinc-300 bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
        onClick={() => dialogRef.current?.showModal()}
        type="button"
      >
        View indicators
      </button>

      <dialog
        className="m-auto w-[min(92vw,44rem)] rounded-md border border-zinc-200 bg-white p-0 text-zinc-950 shadow-xl backdrop:bg-zinc-950/40"
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            dialogRef.current?.close();
          }
        }}
        ref={dialogRef}
      >
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
                Catalogue
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                Catalogue indicators
              </h2>
            </div>
            <form method="dialog">
              <button
                className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                type="submit"
              >
                Close
              </button>
            </form>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {indicators.map((indicator) => (
              <div
                className="rounded-md border border-zinc-200 bg-stone-50 p-4"
                key={indicator.label}
              >
                <p className="text-sm text-zinc-600">{indicator.label}</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-950">
                  {indicator.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
