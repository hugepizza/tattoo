import { useContext, useState } from "react";
import "./styles.css";
import { Button } from "../api/imagine/action/route";
import toast from "react-hot-toast";
import useSWR, { KeyedMutator } from "swr";
import { WorkspaceContext } from "./context";
const act = async (imagineId: number, label: string, customId: string) => {
  await fetch("/api/imagine/action", {
    method: "POST",
    body: JSON.stringify({
      imagineId,
      label,
      customId,
    }),
  });
};

function useDraft(type: string, id: number | null) {
  const fetcher = (url: string) =>
    fetch(url, { method: "GET" })
      .then((resp) => resp.json())
      .then((resp) => resp.data.imagine)
      .then((resp) => {
        console.log(resp);
        return resp;
      });

  const { data, error, mutate } = useSWR(
    id ? `/api/imagine/${type}/${id}` : null,
    fetcher
  );
  return {
    imagine: id ? data : null,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}

export default function Desk() {
  const { editing } = useContext(WorkspaceContext);

  const { imagine, isLoading, isError, mutate } = useDraft(
    editing?.type || "draft",
    editing === null ? null : editing.id
  );
  if (!imagine)
    return (
      <div className="flex flex-col items-center justify-start py-16 w-full space-y-6">
        <h1>load load load load load load </h1>
      </div>
    );
  let buttons: Button[] = [];
  if (isError) return <>err occured...</>;
  if (isLoading) return <>loading...</>;

  if (imagine.buttons != null && (imagine.buttons as Button[])) {
    buttons = (imagine.buttons as Button[]).filter(
      (ele) => ele.label.startsWith("U") || ele.label.startsWith("V")
    );
  }

  return (
    <div className="flex flex-col flex-grow w-full h-full  items-center m-2 rounded-md border-solid border-[1] border-neutral-focus shadow-lg text-neutral-focus">
      <DraftEditor buttons={buttons} url={imagine.imageUrl!} mutate={mutate} />
      <div className="w-1/2 py-2">
        <div className="badge badge-neutral mr-2">Traditional Tattoo</div>
        {imagine.rawPrompt}
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
              UPSCALE
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </ImageLayar>
  );
}
function DraftEditor({
  buttons,
  url,
  mutate,
}: {
  url: string;
  buttons: Button[];
  mutate: KeyedMutator<any>;
}) {
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
          mutate={mutate}
        />
      ))}
    </ImageLayar>
  );
}

function OneFourHover({
  buttons,
  mutate,
}: {
  buttons: Button[];
  mutate: KeyedMutator<any>;
}) {
  const { editing, draftMutate, tattooMutate } = useContext(WorkspaceContext);
  const [hovered, setHovered] = useState(false);
  const [disabledButtons, setDisabledButtons] = useState<boolean[]>(
    new Array(buttons.length).fill(false)
  );

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
          {buttons.map((ele, index) => (
            <button
              key={ele.label}
              onClick={() => {
                const newDisabledButtons = [...disabledButtons];
                newDisabledButtons[index] = true;
                setDisabledButtons(newDisabledButtons);

                const actPromise = act(editing!.id, ele.label, ele.customId);
                toast
                  .promise(actPromise, {
                    loading: "Prossing...",
                    success: "Submitted!",
                    error: (data) => data.toString(),
                  })
                  .then(() => {
                    console.log("run mutate");
                    if (ele.label.startsWith("U")) tattooMutate();
                    if (ele.label.startsWith("V")) draftMutate();
                    mutate();
                    console.log("run mutate done");
                  })
                  .catch((err) => console.log(err));
              }}
              className={`btn w-full mb-2 rounded-none ${
                ele.used ? "btn-disabled" : "glass"
              }  `}
              disabled={disabledButtons[index]}
            >
              {ele.label.startsWith("U") && "UPSCALE"}
              {ele.label.startsWith("V") && "VARIATION(2 credits)"}
            </button>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
