import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Imagine } from "../api/imagine/route";
import { WorkspaceContext } from "./context";
import useSWR from "swr";

export default function History() {
  const {
    data: drafts,
    error: draftsError,
    isLoading: draftsLoading,
    mutate: draftMutate,
  } = useSWR(["/api/imagine/draft"], ([url]) =>
    fetch(url, { method: "GET" })
      .then((resp) => resp.json())
      .then((resp) => resp.data.imagine as Imagine[])
  );

  const {
    data: tattoos,
    error: tattoosError,
    isLoading: tattoosLoading,
    mutate: tattooMutate,
  } = useSWR(["/api/imagine/tattoo"], ([url]) =>
    fetch(url, { method: "GET" })
      .then((resp) => resp.json())
      .then((resp) => resp.data.imagine as Imagine[])
  );
  const { setEditing } = useContext(WorkspaceContext);
  const [active, setActive] = useState("draft");

  console.log("draft", active);
  console.log("drafts", drafts);
  console.log("tattoos", tattoos);
  const showItems = active === "draft" ? drafts : tattoos;
  console.log("showItems", showItems);

  return (
    <div className="flex flex-col w-1/2 h-full bg-slate-100 border-l-[1px] border-solid">
      <div className="tabs w-full">
        <a
          className={`tab tab-lg tab-bordered grow ${
            active === "draft" ? "tab-active" : ""
          }`}
          onClick={() => {
            setActive("draft");
          }}
        >
          Draft
        </a>
        <a
          className={`tab tab-lg tab-bordered grow ${
            active === "tattoo" ? "tab-active" : ""
          }`}
          onClick={() => {
            setActive("tattoo");
          }}
        >
          Tattoos
        </a>
      </div>
      <div className="flex w-full flex-grow flex-col h-full p-1 overflow-y-auto">
        {showItems?.map((ele) => (
          <div
            key={ele.id}
            className="card card-compact w-full bg-base-100 shadow-md rounded-md mb-1"
            onClick={() => {
              if (ele.status != "SUCCESS" || !ele.imageUrl) {
                toast.error("choose a done draft");
                return;
              }
              {
                const target = showItems?.find((ele2) => ele2.id === ele.id);
                if (target) {
                  setEditing({ type: active, id: target.id });
                }
              }
            }}
          >
            {ele.status === "SUCCESS" && (
              <figure className="w-full">
                <img src={ele.imageUrl!} alt="draft" />
              </figure>
            )}
            {ele.status === "IN_PROGRESS" && (
              <div className="flex flex-col h-36 p-1 justify-around items-center">
                <span className="loading loading-dots loading-lg"></span>
                {ele.progress}
              </div>
            )}
            <div className="card-body">
              <div className="card-actions justify-end">
                {new Date(ele.createdAt).toLocaleString("en-US")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
