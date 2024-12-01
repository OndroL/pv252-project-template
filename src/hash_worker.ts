import { AsyncSha256 } from "./sha-256.js";

// In this file, you can define the worker script that will compute the
// hash digest for a given file. Of course, it is up to you what kind
// of messages should the worker receive/send.

// Web Worker setup
self.onmessage = async (event: MessageEvent) => {
  const { fileName, data } = event.data;
  const hasher = new AsyncSha256();

  hasher.async_digest(
    data,
    (hash) => self.postMessage({ type: "complete", fileName, hash }),
    (progress) => self.postMessage({ type: "progress", fileName, progress })
  );
};
