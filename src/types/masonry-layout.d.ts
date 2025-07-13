declare module 'masonry-layout' {
  interface MasonryOptions {
    itemSelector: string;
    columnWidth?: number | string;
    gutter?: number;
    percentPosition?: boolean;
    horizontalOrder?: boolean;
    originLeft?: boolean;
    originTop?: boolean;
    containerStyle?: string;
    transitionDuration?: string;
    resize?: boolean;
    initLayout?: boolean;
  }

  class Masonry {
    constructor(container: Element | string, options: MasonryOptions);
    layout(): void;
    layoutItems(items: Element[], isStill?: boolean): void;
    stamp(elements: Element | Element[]): void;
    unstamp(elements: Element | Element[]): void;
    appended(elements: Element | Element[]): void;
    prepended(elements: Element | Element[]): void;
    addItems(elements: Element | Element[]): void;
    remove(elements: Element | Element[]): void;
    reloadItems(): void;
    destroy(): void;
    getItemElements(): Element[];
    on(eventName: 'layoutComplete' | 'removeComplete', listener: (items: Element[]) => void): void;
    off(eventName: 'layoutComplete' | 'removeComplete', listener: (items: Element[]) => void): void;
    once(eventName: 'layoutComplete' | 'removeComplete', listener: (items: Element[]) => void): void;
  }

  export = Masonry;
}
