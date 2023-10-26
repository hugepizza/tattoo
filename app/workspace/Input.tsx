import { useContext, useEffect, useState } from "react";
import { PromptParam } from "../api/imagine/prompt";
import toast, { Toaster } from "react-hot-toast";
import { GENERATE_CREDIT } from "../constant";
import { WorkspaceContext } from "./context";

const styles = [
  {
    name: "Classic",
    prompt: "Old School Tattoo Style",
    img: "",
    describe:
      "Traditional tattoos, also known as old school tattoos, feature bold lines, bright colors, and classic themes like hearts, daggers, tigers, and pin-up girls with black outlines.",
  },

  {
    name: "Japanese",
    prompt: "Irezumi tattoo",
    img: "",
    describe:
      "New school tattoos emphasize vibrant colors, exaggerated proportions, and a cartoonish style. They often include exaggerated features and playful elements.",
  },

  {
    name: "Stick and Poke",
    prompt: "Stick and poke tattoo style",
    img: "",
    describe:
      "Watercolor tattoos mimic the style of watercolor painting, using soft and flowing colors with blurred edges to create an artistic and abstract effect.",
  },

  {
    name: "New School",
    prompt: "New School Tattoo Style",
    img: "",
    describe:
      "Geometric tattoos focus on geometric shapes such as lines, polygons, and symmetrical patterns. These tattoos can be single geometric elements or combined with other styles.",
  },

  {
    name: "Watercolor",
    prompt: "Watercolor Style Tattoo",
    img: "",
    describe:
      "This style primarily uses black and gray tones to create depth and visual impact through shading and detail. It's often used for complex details and realistic themes.",
  },

  {
    name: "Black and Grey",
    prompt: "black and grey tattoo style, amazing detail",
    img: "",
    describe:
      "Realism tattoos aim to depict subjects like people, animals, and landscapes with a high level of detail and lifelike accuracy, requiring exceptional technical and artistic skills.",
  },

  {
    name: "Line",
    prompt: "Line Tattoo Style",
    img: "",
    describe:
      "Neotraditional tattoos combine traditional tattoo elements with more modern design features. They often incorporate additional detail and color while maintaining traditional characteristics.",
  },

  {
    name: "Tribal",
    prompt: "Aztec tribal tattoo style",
    img: "",
    describe:
      "This style typically features dark and mysterious themes, such as skulls, bats, and occult symbols, using a dark color palette and shadowy effects.",
  },

  {
    name: "Ornamental",
    prompt: "Ornamental tattoo style",
    img: "",
    describe:
      "Portrait tattoos focus on depicting real individuals as subjects, including celebrities, loved ones, or personal heroes. Creating precise facial features and expressions is a key feature.",
  },

  {
    name: "Neo-Traditional",
    prompt: "Neo Traditional tattoo style",
    img: "",
    describe:
      "This category includes tattoos featuring text, letters, numbers, or fonts, often used to convey personal messages, mottos, or quotations.",
  },
];

export default function Input() {
  const { setInProgressImage, draftMutate } = useContext(WorkspaceContext);
  const [params, setParams] = useState<PromptParam>({
    style: styles[0].name,
    rawPrompt: "",
    prompt: styles[0].prompt,
  });
  const [credit, setCredit] = useState<number | null>(null);
  const [submitDisable, setSubmitDisable] = useState(false);
  useEffect(() => {
    fetch("/api/user", {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data?.UserCredit?.credits != undefined) {
          setCredit(data?.UserCredit?.credits);
        }
        console.log(data?.UserCredit?.credits);
      });
  }, []);
  const generate = async () => {
    setSubmitDisable(true);
    if (credit === null) {
      toast.error("login first");
      return;
    }
    if (credit < GENERATE_CREDIT) {
      toast.error("Out of credits");
      return;
    }
    const promise = fetch("/api/imagine", {
      method: "POST",
      body: JSON.stringify(params),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        draftMutate();
      })
      .catch((err) => {
        throw err;
      });
    toast
      .promise(promise, {
        loading: "Prossing...",
        success: "Submitted!",
        error: (data) => data.toString(),
      })
      .then(() => {
        setSubmitDisable(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="w-1/2 h-full flex-grow-0 m-2 rounded-md bottom-1 border-solid border-[1px] shadow-lg">
      <div className="flex flex-col h-full">
        <div className="bg-white px-2 py-2 ">
          <div className="flex flex-col w-full h-[160px] mt-2 justify-center items-center">
            <textarea
              className="textarea textarea-bordered w-full h-full"
              placeholder="Input your ideas, you can also choose an exmple image file ..."
              value={params.rawPrompt}
              onChange={(e) => {
                setParams({ ...params, rawPrompt: e.currentTarget.value });
              }}
            ></textarea>
          </div>
          <label className="label">
            <span className="label-text">Upload a example(optional)</span>
          </label>
          <div>
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-m"
            />
          </div>
        </div>

        <div className="flex flex-col px-2 grow bg-white overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white">
            <label className="label">
              <span className="label-text">Style</span>
              <span className="label-text-alt">
                <label className="underline">Not Sure? Explore Styles!</label>
              </span>
            </label>
          </div>
          <div className="flex flex-wrap">
            {styles.map((ele) => (
              <div
                key={ele.name}
                className={`card h-[100px] w-[100px] rounded-md mb-1 mr-1 border-[2px]   ${
                  params.style === ele.name ? "border-neutral-focus" : ""
                }`}
                style={{
                  backgroundImage:
                    "url(https://img.tuwen.aleyi.com/attachments/1156570429545267220/1163125276985794620/wardmichael._9_grids_icons_of_parts_of_a_body_aa97628a-c3cd-4ba9-9f42-9370d73bb5eb.png?ex=653e6fd3&is=652bfad3&hm=28c0af374cf2791bec7f6f31e5dd14eac8b6f0db63d55d82b14360cdece521e3&)",
                  backgroundSize: "contain",
                }}
                onClick={() => {
                  console.log(ele.name);
                  setParams({ ...params, style: ele.name, prompt: ele.prompt });
                }}
              >
                <div
                  className="absolute bottom-0 w-full h-1/5  text-center rounded-b-md text-gray-100 text-sm"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  {ele.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-1 w-full h-16  bg-white px-2 py-2 justify-between">
          <button className="btn btn-ghost no-animation">
            {" "}
            {GENERATE_CREDIT} Credit
          </button>
          <button
            className={`btn grow ${
              submitDisable ? "btn-disabled" : "btn-neutral"
            } `}
            onClick={async () => {
              await generate();
            }}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
