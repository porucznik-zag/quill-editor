import Block from "quill/blots/block";

export class PrayerOpacityBlock extends Block {
  static create(value: any) {
    let node = super.create();
    if (value) {
      // Remove any existing prayer-opacity classes
      node.classList.remove(
        "prayer-opacity",
        "prayer-opacity-25",
        "prayer-opacity-50",
        "prayer-opacity-75"
      );

      // Only add classes if opacity is not 100%
      if (value.opacity && value.opacity !== "100") {
        node.className = "prayer-opacity";
        node.classList.add(`prayer-opacity-${value.opacity}`);
      }
    }
    return node;
  }

  static formats(node: HTMLElement) {
    if (node.classList.contains("prayer-opacity-75")) {
      return "75";
    }
    if (node.classList.contains("prayer-opacity-50")) {
      return "50";
    }
    if (node.classList.contains("prayer-opacity-25")) {
      return "25";
    }
    // Jeśli ma tylko prayer-opacity bez dodatkowej klasy, to znaczy że to 100%
    if (node.classList.contains("prayer-opacity")) {
      return "100";
    }
    return undefined;
  }
}

PrayerOpacityBlock.blotName = "prayer-opacity";
PrayerOpacityBlock.tagName = "sapp";
PrayerOpacityBlock.className = "prayer-opacity";
