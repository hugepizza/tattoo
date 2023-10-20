import { useContext } from "react";
import toast from "react-hot-toast";
import { Draft } from "../api/draft/route";
import { WorkspaceContext } from "./context";


export default function History({ drafts }: { drafts: Draft[] }) {
  const { setEditing } = useContext(WorkspaceContext);
  return (
    <div className="flex flex-col w-1/2 h-full bg-slate-100 border-l-[1px] border-solid">
      <div className="tabs w-full">
        <a className="tab tab-lg tab-bordered grow tab-active">Draft</a>
        <a className="tab tab-lg tab-bordered grow">Tattoo</a>
      </div>
      <div className="flex w-full flex-grow flex-col h-full p-1 overflow-y-auto">
        {drafts?.map((ele) => (
          <div
            key={ele.id}
            className="card card-compact w-full bg-base-100 shadow-md rounded-md mb-1"
            onClick={() => {
              if (ele.status != "SUCCESS" || !ele.imageUrl) {
                toast.error("choose a done draft");
                return;
              }
              setEditing(ele);
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
