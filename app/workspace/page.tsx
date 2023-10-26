"use client";
import { useState } from "react";
import Input from "./Input";
import History from "./History";
import useSWR from "swr";
import Desk from "./Desk";
import { Toaster } from "react-hot-toast";
import { EditingItem, WorkspaceContext } from "./context";
import { Imagine } from "../types";

function useHistoryPage(type: string, page: number) {
  page = page < 1 ? 1 : page;
  const fetcher = async (url: string, page: number) => {
    const apiUrl = `${url}/?page=${page}`;
    return fetch(apiUrl, { method: "GET" })
      .then((resp) => resp.json())
      .then((resp) => resp.data.imagine as Imagine[]);
  };
  const {
    data,
    error: error,
    isLoading: loading,
    mutate,
  } = useSWR([`/api/imagine/${type}`, page], ([url, page]) =>
    fetcher(url, page)
  );
  return { data, mutate };
}

export default function Page() {
  const [editing, setEditing] = useState<EditingItem>(null);
  const [inProgressImage, setInProgressImage] = useState("");

  const [tattooPage, setTattooPage] = useState(1);
  const [draftPage, setDraftPage] = useState(1);
  const { data: drafts, mutate: draftMutate } = useHistoryPage(
    "draft",
    draftPage
  );
  const { data: tattoos, mutate: tattooMutate } = useHistoryPage(
    "tattoo",
    tattooPage
  );

  return (
    <WorkspaceContext.Provider
      value={{
        editing,
        setEditing,
        inProgressImage,
        setInProgressImage,
        tattoos,
        drafts,
        tattooMutate,
        draftMutate,
        tattooPage,
        draftPage,
        setTattooPage,
        setDraftPage,
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
