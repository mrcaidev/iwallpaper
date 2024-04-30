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
import { upsertHistory } from "./actions";

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
      <LoaderIcon size={16} className="mr-2 animate-spin" />
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

  const download = async () => {
    setStatus(DownloadStatus.Pending);

    const { error: upsertError } = await upsertHistory({
      wallpaper_id: wallpaperId,
      is_downloaded: true,
    });

    if (upsertError) {
      toast({ variant: "destructive", description: upsertError });
      setStatus(DownloadStatus.Error);
      return;
    }

    const { error: downloadError } = await downloadImage(pathname);

    if (downloadError) {
      toast({ variant: "destructive", description: downloadError });
      setStatus(DownloadStatus.Error);
      return;
    }

    setStatus(DownloadStatus.Success);
  };

  return (
    <Button
      type="button"
      variant={status === DownloadStatus.Error ? "destructive" : "default"}
      onClick={download}
      disabled={status === DownloadStatus.Pending}
    >
      {statusRepresentation[status]}
    </Button>
  );
}

async function downloadImage(pathname: string) {
  try {
    const imageUrl = new URL(pathname, "https://images.unsplash.com");
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const href = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "";
    anchor.click();

    URL.revokeObjectURL(href);

    return { error: "" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Download failed due to an unknown error" };
  }
}
