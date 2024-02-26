import WeekleyCard from "@/components/weekley-cards";
import { getPlans } from "@/controllers/plans.controller";

export default async function Page() {
  const data = await getPlans();

  return (
    <div className="w-full p-2 py-10 rounded-md min-h-full bg-background">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <section>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="w-full">
            {data && data.length > 0 && <WeekleyCard data={data} />}
          </div>
        </div>
      </section>
    </div>
  );
}
