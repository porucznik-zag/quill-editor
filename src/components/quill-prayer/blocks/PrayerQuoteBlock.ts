import Block from "quill/blots/block";

export class PrayerQuoteBlock extends Block {
  static create(value: any) {
    let node = super.create();
    if (value) {
      node.classList.remove("prayer-header");
      node.className = "prayer-quote";
    }
    return node;
  }

  static formats(node: HTMLElement) {
    return node.className === "prayer-quote" ? true : undefined;
  }
}

PrayerQuoteBlock.blotName = "prayer-quote";
PrayerQuoteBlock.tagName = "p";
PrayerQuoteBlock.className = "prayer-quote";
