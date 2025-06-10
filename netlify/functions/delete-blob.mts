import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  // Extract key from URL.
  const { key } = context.params;

  const uploads = getStore("playfulplaces-v1.1-alpha-user-data");
  await uploads.delete(key);

  return new Response("Blob has been deleted");
};

export const config: Config = {
  path: "/delete/:key"
};