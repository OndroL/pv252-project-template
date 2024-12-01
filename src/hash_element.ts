import { FASTElement, html, observable, when } from "@microsoft/fast-element";
import { AsyncSha256 } from "./sha-256.js";

/**
 * The purpose of `HashElement` is to compute the SHA256 checksum of the given file, using the
 * implementation provided in `sha-256.js`. It will display progress, elapsed time, and the
 * final hash once computed.
 */
export class HashElement extends FASTElement {
  // The name of the file being processed.
  @observable
  fileName: string = "";

  // The total size of the file.
  @observable
  total: number = -1;

  // The size of the remaining unprocessed data.
  @observable
  remaining: number = -1;

  // The final SHA256 hash, once computed.
  @observable
  hash: string | null = null;

  // The time (in ms) elapsed while computing the file hash.
  @observable
  elapsed: number = 0;

  // Start time for computation.
  #started: Date;

  // The worker instance.
  private worker: Worker;

  constructor(file: File) {
    super();
    this.fileName = file.name;
    this.#started = new Date();

    // Create the web worker.
    this.worker = new Worker(new URL("./hash_worker.ts", import.meta.url), { type: "module" });

    // Listen for messages from the worker.
    this.worker.onmessage = (event: MessageEvent) => this.handleWorkerMessage(event);

    // Read the file and send its data to the worker for hashing.
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result as string;
      this.total = fileData.length;
      this.worker.postMessage({ fileName: this.fileName, data: fileData });
    };
    reader.readAsText(file);
  }

  /**
   * Handle messages from the web worker.
   */
  private handleWorkerMessage(event: MessageEvent) {
    const { type, progress, hash } = event.data;

    switch (type) {
      case "progress":
        this.remaining = this.total - progress;
        this.elapsed = new Date().getTime() - this.#started.getTime();
        break;

      case "complete":
        this.hash = hash;
        this.remaining = 0;
        this.elapsed = new Date().getTime() - this.#started.getTime();
        this.worker.terminate(); // Cleanup worker.
        break;
    }
  }

  disconnectedCallback() {
    this.worker.terminate();
  }
}

// Template for the element.
const hashElementTemplate = html<HashElement>`
  <div style="margin-top: 12px;">
    <b>File name:</b> ${(x) => x.fileName}<br />
    ${when(
      (x) => x.hash !== null,
      html<HashElement>`<b>Hash:</b> ${(x) => x.hash}<br />`,
      html<HashElement>`
        <progress
          max="${(x) => x.total}"
          value="${(x) => x.total - x.remaining}"
          style="margin-right: 12px;"
        ></progress>
        ${when(
          (x) => x.total > 0,
          html<HashElement>`
            <code
            >${(x) => Math.ceil((x.total - x.remaining) / 1024 / 1024)} MiB /
              ${(x) => Math.ceil(x.total / 1024 / 1024)} MiB</code
            ><br />
          `,
          html<HashElement>` Pending...<br /> `,
        )}
      `,
    )}
    <b>Elapsed:</b> <code>${(x) => Math.floor(x.elapsed / 100) / 10} s</code>
  </div>
`;

// Define the custom element.
HashElement.define({
  name: "hash-element",
  template: hashElementTemplate,
});