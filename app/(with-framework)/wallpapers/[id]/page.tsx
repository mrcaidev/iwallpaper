import type { Metadata } from "next";
import { createServerSupabaseClient } from "utils/supabase/server";

export const metadata: Metadata = {
  title: "Wallpaper",
};

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params: { id } }: Props) {
  const supabase = createServerSupabaseClient();

  const { data: wallpaper, error } = await supabase
    .from("wallpapers")
    .select("id, slug, pathname, description, width, height, tags")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return (
    <div>
      <p>{JSON.stringify(wallpaper)}</p>
    </div>
  );
}
