"use client";
import { createContext, useState } from "react";
import Input from "./Input";
import History from "./History";
import useSWR from "swr";
import Desk from "./Desk";
import { Toaster } from "react-hot-toast";
import { Imagine } from "../api/imagine/route";
import { EditingItem, WorkspaceContext } from "./context";

export default function Page() {
  const [editing, setEditing] = useState<EditingItem>(null);
  const [draftQuery, setDraftQuery] = useState(0);
  const [tattooQuery, setTattooQuery] = useState(0);

  return (
    <WorkspaceContext.Provider
      value={{
        editing: editing,
        setEditing: setEditing,
        reloadHistory: () => {
          console.log(1);
        },
      }}
    >
      <div className="flex h-full w-full flex-row text-black overflow-y-hidden">
        <Toaster />
        <Input />
        <Desk />
        <History />
      </div>
    </WorkspaceContext.Provider>
  );
}
