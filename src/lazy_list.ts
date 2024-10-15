const template = document.createElement("template");
template.innerHTML = `
<style>
#list {
  height: var(--height);
  width: var(--width);  
  border: var(--border);
  padding: var(--padding);
  overflow: scroll;
  scrollbar-width: none;
  scroll-behavior: smooth;
}
#spacer-top {
  width: 100%;
  height: 0px;
}
#spacer-bottom {
  width: 100%;
  height: 1000px;
}
</style>
<div id="list">
  <div id="spacer-top"></div>
  <slot></slot>
  <div id="spacer-bottom"></div>
</div>
`;

export type Renderer<T> = (item: T) => HTMLElement;

export class LazyList<T> extends HTMLElement {
  // By default, the list renders the items as div-s with strings in them.
  #renderFunction: Renderer<T> = (item) => {
    const element = document.createElement("div");
    element.innerText = JSON.stringify(item);
    return element;
  };

  // These could be useful properties to consider, but not mandatory to use.
  // Similarly, feel free to edit the shadow DOM template in any way you want.

  // By default, the list is empty.
  #data: T[] = [];

  // The index of the first visible data item.
  #visiblePosition: number = 0;

  // The amount of space that needs to be shown before the first visible item.
  #topOffset: number = 0;
  #topOffsetElement: HTMLElement;
  // The amount of space that needs to be shown after the last visible item.
  #bottomOffset: number = 0;
  #bottomOffsetElement: HTMLElement;

  // The container that stores the spacer elements and the slot where items are inserted.
  #listElement: HTMLElement;

  #itemHeight: number = 50;
  #visibleItemCount: number = 10;

  static register() {
    customElements.define("lazy-list", LazyList);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#topOffsetElement =
      this.shadowRoot.querySelector<HTMLElement>("#spacer-top")!;
    this.#bottomOffsetElement =
      this.shadowRoot.querySelector<HTMLElement>("#spacer-bottom")!;
    this.#listElement = this.shadowRoot.querySelector<HTMLElement>("#list")!;

    this.#listElement.onscroll = () => {
      this.#scrollPositionChanged(this.#listElement.scrollTop);
    };
  }

  setData(data: T[]) {
    this.#data = data;
    this.#updateOffsets();
    this.#renderVisibleItems();
  }

  setRenderer(renderer: Renderer<T>) {
    this.#renderFunction = renderer;
    this.#renderVisibleItems();
  }

  #updateOffsets() {
    const totalHeight = this.#data.length * this.#itemHeight;
    const visibleHeight = this.#visibleItemCount * this.#itemHeight;

    this.#topOffset = this.#visiblePosition * this.#itemHeight;
    this.#bottomOffset = totalHeight - visibleHeight - this.#topOffset;

    this.#topOffsetElement.style.height = `${this.#topOffset}px`;
    this.#bottomOffsetElement.style.height = `${this.#bottomOffset}px`;
  }

  #renderVisibleItems() {
    this.innerHTML = "";

    const visibleEnd = this.#visiblePosition + this.#visibleItemCount;
    const visibleItems = this.#data.slice(this.#visiblePosition, visibleEnd);

    for (const item of visibleItems) {
      this.appendChild(this.#renderFunction(item));
    }
  }

  #scrollPositionChanged(scrollTop: number) {
    const newVisiblePosition = Math.floor(scrollTop / this.#itemHeight);
    if (newVisiblePosition !== this.#visiblePosition) {
      this.#visiblePosition = newVisiblePosition;
      this.#updateOffsets();
      this.#renderVisibleItems();
    }
  }
}

