import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { WorkspaceContext } from "./context";
import Image from "next/image";
import { Imagine } from "../types";

export default function History() {
  const {
    setDraftPage,
    setTattooPage,
    draftPage,
    tattooPage,
    inProgressImage,
    setInProgressImage,
    drafts,
    draftMutate,
    tattoos,
    tattooMutate,
  } = useContext(WorkspaceContext);

  const [active, setActive] = useState("draft");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    let inProgress = drafts?.find(
      (ele) => ele.status === "SUBMITTED" || ele.status === "IN_PROGRESS"
    );
    if (!inProgress) {
      inProgress = tattoos?.find(
        (ele) => ele.status === "SUBMITTED" || ele.status === "IN_PROGRESS"
      );
    }
    if (inProgress) {
      setInProgressImage(inProgress.proxyId);
    } else {
      setInProgressImage("");
    }
  }, [drafts, tattoos]); // 这里只依赖于 drafts 和 tattoos

  useEffect(() => {
    if (inProgressImage) {
      timerRef.current = setInterval(() => {
        fetch("/api/imagine/callback/" + inProgressImage, { method: "GET" })
          .then((resp) => resp.json())
          .then((resp) => {
            if (resp.done) {
              clearTimer();
            }
            if (resp.mutation) {
              resp.type === "draft" ? draftMutate() : tattooMutate();
            }
          });
      }, 3000);
    }
    return () => {
      clearTimer();
    };
  }, [inProgressImage]); // 这里只依赖于 inProgressImage

  return (
    <div className="flex flex-col w-1/2 h-full bg-white rounded-md shadow-lg m-2 border-l-[1px] border-solid">
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
      {active === "draft" ? (
        <ItemList items={drafts} page={draftPage} setPage={setDraftPage} />
      ) : (
        <ItemList items={tattoos} page={tattooPage} setPage={setTattooPage} />
      )}
    </div>
  );
}

function ItemList({
  items,
  page,
  setPage,
}: {
  items: Imagine[] | undefined;
  page: number;
  setPage: (page: number) => void;
}) {
  return (
    <div className="flex flex-col h-full w-full p-1 overflow-y-auto">
      <div className="flex-grow overflow-y-auto">
        {items?.map((ele) => (
          <ShowItem key={ele.id} showItem={ele} />
        ))}
      </div>
      <div className="join flex w-full justify-between items-center">
        <button
          className={`join-item btn grow ${page - 1 > 0 ? "" : "btn-disabled"}`}
          onClick={() => setPage(page - 1)}
        >
          «
        </button>
        <button className="join-item btn grow">Page {page}</button>
        <button
          className={`join-item btn grow ${
            items && items.length > 0 ? "" : "btn-disabled"
          }`}
          onClick={() => setPage(page + 1)}
        >
          »
        </button>
      </div>
    </div>
  );
}

function ShowItem({ showItem }: { showItem: Imagine }) {
  const { setEditing } = useContext(WorkspaceContext);
  return (
    <div
      key={showItem.id}
      className="card card-compact w-full bg-base-100 shadow-md rounded-md mb-1"
      onClick={() => {
        if (showItem.status != "SUCCESS") {
          toast.error("choose a done draft");
          return;
        } else {
          setEditing({ type: showItem.type, id: showItem.id });
        }
      }}
    >
      {showItem.status === "SUCCESS" && (
        <figure className="w-full aspect-square">
          <Image src={showItem.imageUrl!} alt="draft" fill></Image>
        </figure>
      )}
      {showItem.status === "SUBMITTED" && (
        <div className="flex flex-col h-36 p-1 justify-around items-center">
          <span className="loading loading-dots loading-lg"></span>
          {"SUBMITTED"}
        </div>
      )}
      {showItem.status === "IN_PROGRESS" && (
        <div className="flex flex-col h-36 p-1 justify-around items-center">
          <span className="loading loading-dots loading-lg"></span>
          {showItem.progress}
        </div>
      )}
      <div className="card-body">
        <div className="card-actions justify-end">
          {new Date(showItem.createdAt).toLocaleString("en-US")}
        </div>
      </div>
    </div>
  );
}
