declare module 'masonry-layout' {
  interface MasonryOptions {
    itemSelector: string;
    columnWidth?: number | string | Element;
    gutter?: number | string;
    percentPosition?: boolean;
    horizontalOrder?: boolean;
    fitWidth?: boolean;
    originLeft?: boolean;
    originTop?: boolean;
    containerStyle?: CSSStyleDeclaration;
    transitionDuration?: string;
    resize?: boolean;
    initLayout?: boolean;
    stagger?: number | string;
    resizeContainer?: boolean;
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
