"use client";
import { useRouter } from "next/navigation";
import "./styles.css";
export default function Main() {
  const router = useRouter();
  return (
    <section className="text-gray-600 body-font">
      <div className="max-w-5xl pt-52 pb-24 mx-auto">
        <h1 className="text-80 text-center font-4 lh-6 ld-04 font-bold text-white mb-6">
          Use AI to quickly generate a tattoo design based on your idea
        </h1>
        <h2 className="text-2xl font-4 font-semibold lh-6 ld-04 pb-11 text-gray-700 text-center">
          ai-tattoo is a easy to use ai imagine generate for tattoo design
          <br />
          with Midjourney
        </h2>
        <div className="ml-6 text-center">
          <a
            className="inline-flex items-center py-3 font-semibold text-black transition duration-500 ease-in-out transform bg-transparent bg-white px-7 text-md md:mt-0 hover:text-black hover:bg-white focus:shadow-outline"
            href="/workspace"
          >
            <div className="flex text-lg">
              <span className="justify-center">Go To Workspace</span>
            </div>
          </a>
          <a
            className="inline-flex items-center py-3 font-semibold tracking-tighter text-white transition duration-500 ease-in-out transform bg-transparent ml-11 bg-gradient-to-r from-blue-500 to-blue-800 px-14 text-md md:mt-0 focus:shadow-outline"
            href="/pricing"
          >
            <div className="flex text-lg">
              <span
                className="justify-center"
                onClick={() => {
                  router.push("/pricing");
                }}
              >
                Purchase
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
