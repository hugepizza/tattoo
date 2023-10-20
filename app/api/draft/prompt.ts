export type PromptParam = {
  style: string;
  position: string;
  rawPrompt: string;
};
export default function AssemblePrompt({
  style,
  position,
  rawPrompt,
}: PromptParam) {
  return `${style} tattoo stytle, ${rawPrompt}, white background, amazing detail --no skin --no people --v 5.2 --ar 1:1 --q .25`;
}
