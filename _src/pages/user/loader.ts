import { LoaderFunctionArgs } from "react-router-dom";
import { snakeToCamel } from "utils/case";
import { supabase } from "utils/supabase";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: snakeToCamel(data), error: null };
}
