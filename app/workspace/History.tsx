import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { WorkspaceContext } from "./context";
import Image from "next/image";

export default function History() {
  const {
    setEditing,
    inProgressImage,
    setInProgressImage,
    drafts,
    draftMutate,
    tattoos,
    tattooMutate,
  } = useContext(WorkspaceContext);

  const [active, setActive] = useState("draft");
  const showItems = active === "draft" ? drafts : tattoos;
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
                  console.log({ type: active, id: target.id });

                  setEditing({ type: active, id: target.id });
                }
              }
            }}
          >
            {ele.status === "SUCCESS" && (
              <figure className="w-full aspect-square">
                <Image src={ele.imageUrl!} alt="draft" fill></Image>
              </figure>
            )}
            {ele.status === "SUBMITTED" && (
              <div className="flex flex-col h-36 p-1 justify-around items-center">
                <span className="loading loading-dots loading-lg"></span>
                {"SUBMITTED"}
              </div>
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
