import axios from "axios";

const baseUrl = process.env.MIDJOURNEY_BASEURL;
const secret = process.env.MIDJOURNEY_SECRET;
const notifyHook = process.env.MIDJOURNEY_NOTIFY_HOOK;
const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
    "mj-api-secret": secret,
  },
};
export interface ImagineRes {
  code: number;
  result: string;
  description: string;
  properties?: {
    discordInstanceId?: string;
  };
}
export interface ImagineReq {
  prompt: string;
  urls?: string[];
  fast?: boolean;
  targetAccount?: string;
}

export async function imagine({
  prompt,
  fast,
}: ImagineReq): Promise<ImagineRes> {
  const handleCode = (code: number) => {
    if (code === 23) {
      throw new Error("MJDrawCreateError");
    } else if (code === 24) {
      throw new Error("MJDrawCreateSensitiveError");
    }
  };

  let modes: string[] = fast ? ["FAST"] : [];
  const resp = await axios.post<ImagineRes>(
    `${baseUrl}/mj/submit/imagine`,
    {
      prompt,
      notifyHook,
      modes,
    },
    axiosConfig
  );
  const result = resp.data;
  handleCode(result.code);
  return result;
}

export interface ActionReq {
  customId: string;
  notifyHook?: string;
  taskId: string;
}

export interface ActionRes {
  code: number;
  description: string;
  properties: Record<string, unknown>;
  result: string;
}

export async function action({ taskId, customId, notifyHook }: ActionReq) {
  const resp = await axios.post<ActionRes>(
    `${baseUrl}/mj/submit/action`,
    {
      customId,
      taskId,
      notifyHook,
    },
    axiosConfig
  );
  const result = resp.data;
  if (![1, 21, 22].includes(result.code)) {
    throw new Error("MJDrawCreateError");
  }

  return result;
}

export interface CallbackReq {
  id: string;
  action: "IMAGINE" | "UPSCALE" | "VARIATION" | "REROLL" | "DESCRIBE" | "BLEND";
  status:
    | "SUCCESS"
    | "NOT_START"
    | "SUBMITTED"
    | "MODAL"
    | "IN_PROGRESS"
    | "FAILURE";
  prompt: string;
  progress: string;
  imageUrl: string;
  failReason: string;
  buttons: [{ customId: string; label: string }];
  properties: {
    finalPrompt: string;
  };
}

export async function getTasks(taskIds: string[]) {
  const resp = await axios.post<CallbackReq[]>(
    `${baseUrl}/mj/task/list-by-condition`,
    {
      ids: taskIds,
    },
    axiosConfig
  );
  const result = resp.data;
  return result;
}
