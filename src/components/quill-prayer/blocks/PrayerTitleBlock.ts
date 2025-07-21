import Block from "quill/blots/block";

export class PrayerTitleBlock extends Block {
  static create(value: any) {
    let node = super.create();
    if (value) {
      node.classList.remove("prayer-title");
      node.className = "prayer-title";
    }
    return node;
  }

  static formats(node: HTMLElement) {
    return node.className === "prayer-title" ? true : undefined;
  }
}

PrayerTitleBlock.blotName = "prayer-title";
PrayerTitleBlock.tagName = "p";
PrayerTitleBlock.className = "prayer-title";
