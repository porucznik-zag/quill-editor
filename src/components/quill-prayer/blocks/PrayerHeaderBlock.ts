import Block from "quill/blots/block";

export class PrayerHeaderBlock extends Block {
  static create(value: any) {
    let node = super.create();
    if (value) {
      node.classList.remove("prayer-quote");
      node.className = "prayer-header";
    }
    return node;
  }

  static formats(node: HTMLElement) {
    return node.className === "prayer-header" ? true : undefined;
  }
}

PrayerHeaderBlock.blotName = "prayer-header";
PrayerHeaderBlock.tagName = "sapp";
PrayerHeaderBlock.className = "prayer-header";
