import { Draft } from "../api/draft/route";
import { createContext, useState } from "react";

export const WorkspaceContext = createContext({
  reloadHistory: () => {},
  editing: {} as Draft | null,
  setEditing: (item: Draft | null) => {},
  draftMutate: () => {},
});
