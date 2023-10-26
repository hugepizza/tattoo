export type PromptParam = {
  style: string;
  prompt: string;
  rawPrompt: string;
};
export default function AssemblePrompt({
  style,
  prompt,
  rawPrompt,
}: PromptParam) {
  return `${prompt}, ${rawPrompt}, white pure background --no skin,people,body,arm,back,face,hair --v 5.2 --ar 1:1 --q .25`;
}
