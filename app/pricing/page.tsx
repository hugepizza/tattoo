"use client";

import { Plan } from "@prisma/client";
import useSWR from "swr";

export default function Page() {
  const { data: plans, isLoading } = useSWR("/api/pricing", (url) =>
    fetch(url, { method: "GET" })
      .then((resp) => resp.json())
      .then((resp) => resp.data.plans as Plan[])
  );
  if (isLoading) return <></>;
  return (
    <div className="flex justify-center space-x-6 mt-6">
      {/* Free Plan */}
      {plans?.map((ele) => (
        <div key={ele.name} className="card bordered w-1/5 py-6 px-4">
          <figure className="flex flex-col justify-center items-center h-1/2">
            <div className="card-title">{ele.name}</div>
            <div className="mt-1 text-center">
              {ele.credits > 0 ? (
                <span className="font-medium">{`(${ele.credits} credits)`}</span>
              ) : (
                ""
              )}
            </div>
            <div className="mt-2 text-center">{ele.describe}</div>
          </figure>
          <div className="card-body">
            <h2 className="text-lg font-bold self-center">${ele.price}</h2>
            <button
              className={`btn  w-full ${
                ele.price === 0 ? "btn-disabled" : "btn-neutral"
              }`}
            >
              {ele.price === 0 ? "Start for free" : "Buy now"}
            </button>
            <p className="text-center text-slate-300">
              {ele.price != 0
                ? `${(ele.price / ele.credits).toFixed(2)}$/credit`
                : "free trial"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
