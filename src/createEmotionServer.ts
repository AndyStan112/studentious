import createEmotionCache from "./createEmotionCache";
import createEmotionServer from "@emotion/server/create-instance";

const cache = createEmotionCache();
const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

export { extractCriticalToChunks, constructStyleTagsFromChunks, cache };
