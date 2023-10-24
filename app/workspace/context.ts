import { Imagine } from "../api/imagine/route";
import { createContext, useState } from "react";

export type EditingItem = { type: string; id: number } | null;
export const WorkspaceContext = createContext({
  reloadHistory: () => {},
  editing: {} as EditingItem | null,
  setEditing: (item: EditingItem) => {},
  inProgressImage: {} as string,
  setInProgressImage: (item: string) => {},
  draftMutate: () => {},
  tattooMutate: () => {},
  drafts: [] as Imagine[] | undefined,
  tattoos: [] as Imagine[] | undefined,
});
