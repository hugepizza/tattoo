import { Prisma } from "@prisma/client";

export type Imagine = Omit<Prisma.ImagineGetPayload<{}>, "proxyChannel">;
