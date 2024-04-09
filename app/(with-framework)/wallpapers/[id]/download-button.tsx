"use client";

import { Button } from "components/ui/button";
import { useToast } from "components/ui/use-toast";
import {
  CheckIcon,
  DownloadIcon,
  LoaderIcon,
  RotateCcwIcon,
} from "lucide-react";
import { useState } from "react";
import { react } from "./actions";

enum DownloadStatus {
  Idle,
  Pending,
  Success,
  Error,
}

const statusRepresentation = {
  [DownloadStatus.Idle]: (
    <>
      <DownloadIcon size={16} className="mr-2" />
      Download
    </>
  ),
  [DownloadStatus.Pending]: (
    <>
      <LoaderIcon size={16} className="mr-2" />
      Downloading...
    </>
  ),
  [DownloadStatus.Success]: (
    <>
      <CheckIcon size={16} className="mr-2" />
      Success
    </>
  ),
  [DownloadStatus.Error]: (
    <>
      <RotateCcwIcon size={16} className="mr-2" />
      Try again
    </>
  ),
};

type Props = {
  wallpaperId: string;
  pathname: string;
};

export function DownloadButton({ wallpaperId, pathname }: Props) {
  const [status, setStatus] = useState(DownloadStatus.Idle);
  const { toast } = useToast();

  const handleClick = async () => {
    setStatus(DownloadStatus.Pending);

    const reactError = await react(wallpaperId, { type: "download" });

    if (reactError) {
      toast({ variant: "destructive", description: reactError });
      setStatus(DownloadStatus.Error);
      return;
    }

    const downloadError = await downloadImage(pathname);

    if (downloadError) {
      toast({ variant: "destructive", description: downloadError });
      setStatus(DownloadStatus.Error);
      return;
    }

    setStatus(DownloadStatus.Success);
  };

  return (
    <Button
      variant={status === DownloadStatus.Error ? "destructive" : "default"}
      onClick={handleClick}
      disabled={status === DownloadStatus.Pending}
      className="w-full"
    >
      {statusRepresentation[status]}
    </Button>
  );
}

async function downloadImage(pathname: string) {
  try {
    const response = await fetch(`https://images.unsplash.com/${pathname}`);
    const blob = await response.blob();
    const href = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "";
    anchor.click();

    URL.revokeObjectURL(href);

    return "";
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return "Download failed due to an unknown error.";
  }
}
