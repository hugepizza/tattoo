export default function page() {
  const plans = [
    {
      name: "FREE",
      price: 0,
      credits: 12,
      describe: "For new regisitered uses! Every one has free 12 credits",
    },
    {
      name: "BASIC",
      price: 7,
      credits: 70,
      describe:
        "Try it out! Integrate fast and explore features with 100 emails/day forever.",
    },
    {
      name: "PRO",
      price: 14,
      credits: 180,
      describe:
        "Try it out! Integrate fast and explore features with 100 emails/day forever.",
    },
  ];
  return (
    <div className="flex justify-center space-x-6 mt-6">
      {/* Free Plan */}
      {plans.map((ele) => (
        <div key={ele.name} className="card bordered w-1/5 py-6 px-4">
          <figure className="flex flex-col justify-center items-center h-1/2">
            <div className="card-title">{ele.name}</div>
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
                ? `${(ele.price / ele.credits).toFixed(2)}/1$`
                : "free trial"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
