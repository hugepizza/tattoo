import { useContext, useState } from "react";
import "./styles.css";
import { WorkspaceContext } from "./page";
import { Button } from "../api/draft/action/route";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
const act = async (draftId: number, label: string, customId: string) => {
  const promise = fetch("/api/draft/action", {
    method: "POST",
    body: JSON.stringify({
      draftId,
      label,
      customId,
    }),
  });
  toast.promise(promise, {
    loading: "Prossing...",
    success: "Submitted!",
    error: "Something Got Wrong, Try It Later",
  });
};

export default function Desk() {
  const { editing } = useContext(WorkspaceContext);

  let buttons: Button[] = [];

  if (!editing) return <div className="w-full"></div>;
  if (editing.buttons != null && (editing.buttons as Button[])) {
    buttons = (editing.buttons as Button[]).filter(
      (ele) => ele.label.startsWith("U") || ele.label.startsWith("V")
    );
  }

  return (
    <div className="flex flex-col flex-grow w-full h-full bg-slate-50 items-center">
      <DraftEditor buttons={buttons} url={editing.imageUrl!} />
      <div className="w-1/2 py-2">
        <div className="badge badge-neutral mr-2">Traditional Tattoo</div>a
        Gakuen Anime Style of The night was cold, and he sat alone in the
        darkness, his lonely figure curled up on the corner ground, looking out
        at the empty window, the white curtains swaying in the wind, and the
        moonlight shining in.
      </div>
    </div>
  );
}

function ImageLayar({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-wrap mt-4 mx-12 w-2/3 aspect-square items-center"
      style={{
        backgroundImage: `url(${url})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {children}
    </div>
  );
}

function TattooEditor({
  actions,
  url,
}: {
  url: string;
  actions: {
    up: string;
    vari: string;
  }[];
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <ImageLayar url={url}>
      <div
        className="w-full h-full"
        onMouseEnter={() => {
          setHovered(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
        }}
      >
        {hovered ? (
          <div
            className="flex flex-col h-full w-full items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <button className={`btn w-full mb-2 rounded-none ${"glass"}  `}>
              free up
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </ImageLayar>
  );
}
function DraftEditor({ buttons, url }: { url: string; buttons: Button[] }) {
  // merge buttons
  let buttonGroups: Button[][] = [];
  buttons.forEach((ele) => {
    const index = parseInt(ele.label.replace("U", "").replace("V", ""), 10) - 1;
    if (isNaN(index)) {
      return;
    }
    if (!buttonGroups[index]) {
      buttonGroups[index] = [];
    }
    buttonGroups[index].push(ele);
  });
  buttonGroups.forEach((ele) =>
    ele.sort((a) => (a.label.startsWith("U") ? 1 : -1))
  );
  console.log("buttonGroups", buttonGroups);

  return (
    <ImageLayar url={url}>
      {buttonGroups.map((ele) => (
        <OneFourHover
          key={ele.map((ele) => ele.label).join("")}
          buttons={ele}
        />
      ))}
    </ImageLayar>
  );
}

function OneFourHover({ buttons }: { buttons: Button[] }) {
  const [hovered, setHovered] = useState(false);
  const { editing, draftMutate } = useContext(WorkspaceContext);

  return (
    <div
      className="w-1/2 h-1/2 "
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      {hovered ? (
        <div
          className="flex flex-col h-full w-full items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          {buttons.map((ele) => (
            <button
              key={ele.label}
              onClick={() => {
                act(editing!.id, ele.label, ele.customId).then(() => {
                  draftMutate();
                });
              }}
              className={`btn w-full mb-2 rounded-none ${
                ele.used ? "btn-disabled" : "glass"
              }  `}
            >
              {ele.label.startsWith("U") && "free up"}
              {ele.label.startsWith("V") && "var(2 credits)"}
            </button>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
