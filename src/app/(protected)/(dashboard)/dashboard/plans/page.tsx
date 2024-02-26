"use client";

import { ChangeEvent, useMemo, useState } from "react";
import UploadPlans from "@/components/upload-plans";

export default function Page() {
  return (
    <div className="w-full p-2 rounded-md min-h-full bg-background py-10">
      <header>
        <div className="flex justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Planes
          </h1>
          <UploadPlans />
        </div>
      </header>
      <section>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Your content */}
        </div>
      </section>
    </div>
  );
}
