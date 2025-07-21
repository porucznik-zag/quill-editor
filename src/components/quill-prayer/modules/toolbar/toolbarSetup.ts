import type { RefObject } from "react";

export const initializePrayerToolbar = (
  editorRef: RefObject<HTMLDivElement | null>
) => {
  const toolbar =
    editorRef.current?.parentElement?.querySelector(".ql-toolbar");

  const prayerTitleButton = toolbar?.querySelector(
    ".ql-prayer-title"
  ) as HTMLButtonElement;
  const prayerHeaderButton = toolbar?.querySelector(
    ".ql-prayer-header"
  ) as HTMLButtonElement;
  const prayerQuoteButton = toolbar?.querySelector(
    ".ql-prayer-quote"
  ) as HTMLButtonElement;
  const prayerOpacitySelect = toolbar?.querySelector(
    ".ql-prayer-opacity-select"
  ) as HTMLElement;
  const prayerLineSelect = toolbar?.querySelector(
    ".ql-prayer-line-select"
  ) as HTMLElement;

  if (prayerTitleButton) {
    prayerTitleButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="18" fill="#D9D9D9" viewBox="0 0 42 23"> <path d="M14.86 16a57.926 57.926 0 0 0-.58-1.62c-.2-.533-.393-1.08-.58-1.64H7.86a62.24 62.24 0 0 1-.58 1.66L6.72 16H4.1a217.514 217.514 0 0 1 2.84-7.66c.453-1.12.9-2.187 1.34-3.2.44-1.013.893-2.013 1.36-3h2.38a98.155 98.155 0 0 1 2.68 6.2c.453 1.12.913 2.307 1.38 3.56.48 1.253.98 2.62 1.5 4.1h-2.72ZM10.78 4.82c-.307.707-.66 1.567-1.06 2.58a182.407 182.407 0 0 0-1.22 3.3h4.56c-.427-1.187-.84-2.293-1.24-3.32a79.71 79.71 0 0 0-1.04-2.56Zm15.372 5.92c0-1.027-.207-1.84-.62-2.44-.4-.6-1.04-.9-1.92-.9-.4 0-.78.06-1.14.18-.347.12-.627.253-.84.4V14c.173.04.393.08.66.12.28.027.613.04 1 .04.893 0 1.593-.3 2.1-.9.506-.613.76-1.453.76-2.52Zm2.48.04c0 .84-.127 1.6-.38 2.28a4.732 4.732 0 0 1-1.06 1.72 4.47 4.47 0 0 1-1.66 1.1c-.654.253-1.393.38-2.22.38-.8 0-1.567-.06-2.3-.18-.72-.12-1.32-.253-1.8-.4V.88l2.42-.4V5.9c.28-.147.62-.28 1.02-.4a4.86 4.86 0 0 1 1.36-.18c.733 0 1.386.133 1.96.4.586.253 1.073.62 1.46 1.1.387.48.68 1.06.88 1.74.213.667.32 1.407.32 2.22Zm1.914 0c0-.773.12-1.493.36-2.16a5.22 5.22 0 0 1 1.02-1.76c.453-.493 1-.88 1.64-1.16.64-.28 1.36-.42 2.16-.42.987 0 1.92.18 2.8.54l-.52 1.98c-.28-.12-.6-.22-.96-.3-.347-.08-.72-.12-1.12-.12-.947 0-1.667.3-2.16.9-.493.587-.74 1.42-.74 2.5 0 1.04.233 1.867.7 2.48.467.6 1.253.9 2.36.9.413 0 .82-.04 1.22-.12.4-.08.747-.18 1.04-.3l.34 2c-.267.133-.673.253-1.22.36a8.443 8.443 0 0 1-1.66.16c-.893 0-1.673-.133-2.34-.4-.653-.28-1.2-.66-1.64-1.14a4.917 4.917 0 0 1-.96-1.74 7.313 7.313 0 0 1-.32-2.2ZM0 18.85h42v1H0v-1Zm0 2.35h42v1H0v-1Z"/> </svg>';
    prayerTitleButton.title = "Dodaj blok tytułu";
    prayerTitleButton.setAttribute("aria-label", "Prayer Title");
    prayerTitleButton.classList.remove("ql-active");
  }

  if (prayerHeaderButton) {
    prayerHeaderButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="20" fill="#D9D9D9" viewBox="0 0 28 17"> <path d="M25.5 0A2.5 2.5 0 0 1 28 2.5v12a2.5 2.5 0 0 1-2.5 2.5h-23A2.5 2.5 0 0 1 0 14.5v-12A2.5 2.5 0 0 1 2.5 0h23ZM12.888 3.172v9.62c.312.095.702.182 1.17.26.476.078.975.117 1.495.117a3.97 3.97 0 0 0 1.443-.247 2.908 2.908 0 0 0 1.08-.715c.302-.312.532-.685.688-1.118.164-.442.247-.936.247-1.482 0-.528-.07-1.01-.208-1.443a3.235 3.235 0 0 0-.573-1.13 2.44 2.44 0 0 0-.949-.716 2.986 2.986 0 0 0-1.273-.26c-.32 0-.615.039-.884.117a3.79 3.79 0 0 0-.663.26V2.912l-1.573.26Zm10.734 2.86c-.52 0-.988.09-1.404.273a3.133 3.133 0 0 0-1.066.754c-.286.32-.507.702-.663 1.144a4.117 4.117 0 0 0-.234 1.404c0 .512.07.988.208 1.43.139.433.347.81.624 1.131.286.312.642.56 1.066.741.434.173.94.26 1.52.26.374 0 .733-.034 1.08-.104.355-.069.62-.147.793-.234l-.22-1.3a3.783 3.783 0 0 1-.678.195 4.04 4.04 0 0 1-.793.078c-.719 0-1.23-.195-1.533-.585-.303-.399-.455-.936-.455-1.612 0-.701.16-1.243.48-1.625.321-.39.79-.585 1.405-.585a3.534 3.534 0 0 1 1.352.272l.337-1.286a4.76 4.76 0 0 0-1.819-.35ZM6.666 3.992a66.597 66.597 0 0 0-.884 1.95 90.198 90.198 0 0 0-.87 2.08A138.731 138.731 0 0 0 3.064 13h1.703c.12-.347.243-.693.364-1.04.13-.355.255-.715.377-1.08h3.796c.121.365.247.72.377 1.067s.255.698.377 1.053h1.768c-.338-.962-.663-1.85-.975-2.665a88.323 88.323 0 0 0-.897-2.314 63.813 63.813 0 0 0-1.742-4.03H6.666Zm9.082 3.418c.572 0 .988.195 1.248.585.269.39.402.919.402 1.586 0 .693-.164 1.24-.494 1.638-.329.39-.784.585-1.364.585-.251 0-.468-.008-.65-.026a5.788 5.788 0 0 1-.43-.078V7.787a2.3 2.3 0 0 1 .547-.26 2.33 2.33 0 0 1 .741-.117Zm-8.34-1.677c.19.442.415.997.675 1.664.26.668.528 1.387.806 2.158H5.925c.277-.771.541-1.486.793-2.145.26-.658.49-1.217.69-1.677Z"/> </svg>';
    prayerHeaderButton.title = "Dodaj blok nagłówka";
    prayerHeaderButton.setAttribute("aria-label", "Prayer Header");
    prayerHeaderButton.classList.remove("ql-active");
  }

  if (prayerQuoteButton) {
    prayerQuoteButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="18" fill="#D9D9D9" viewBox="0 0 33 20"> <path d="M0 0h1.32v13.333H0V0Z"/> <path d="M0 0h8.8v1.333H0V0Zm33 20h-1.32V6.667H33V20Z"/> <path d="M33 20h-8.8v-1.333H33V20ZM11.31 9.847v1.413a.345.345 0 0 1-.344.347c-.677 0-1.045.701-1.096 2.085h1.096c.19 0 .344.156.344.348v2.983a.345.345 0 0 1-.344.347H8.044a.345.345 0 0 1-.344-.347V14.04c0-.664.066-1.273.197-1.81a4.383 4.383 0 0 1 .61-1.433c.278-.41.627-.732 1.036-.957.412-.225.89-.34 1.423-.34.19 0 .344.156.344.347Zm4.43-.347c-.532 0-1.011.115-1.423.34-.41.225-.758.547-1.037.957-.27.4-.476.881-.61 1.433a7.725 7.725 0 0 0-.196 1.81v2.983c0 .192.154.347.344.347h2.922c.19 0 .343-.155.343-.347V14.04a.345.345 0 0 0-.343-.348h-1.08c.05-1.384.413-2.085 1.08-2.085.19 0 .343-.155.343-.347V9.847a.345.345 0 0 0-.343-.347Zm9.762-6.167H22.58a.345.345 0 0 0-.344.348v2.983c0 .191.154.347.344.347h1.096c-.051 1.384-.42 2.085-1.096 2.085a.345.345 0 0 0-.344.347v1.413c0 .192.154.347.344.347.532 0 1.01-.114 1.423-.34a2.986 2.986 0 0 0 1.036-.957c.27-.4.476-.88.61-1.432a7.75 7.75 0 0 0 .197-1.81V3.68a.345.345 0 0 0-.344-.347Zm-4.774 0h-2.922a.345.345 0 0 0-.344.348v2.983c0 .191.154.347.344.347h1.08c-.05 1.384-.413 2.085-1.08 2.085a.345.345 0 0 0-.344.347v1.413c0 .192.154.347.344.347a2.93 2.93 0 0 0 1.423-.34c.41-.224.758-.546 1.036-.957.272-.4.477-.88.61-1.432a7.75 7.75 0 0 0 .197-1.81V3.68a.345.345 0 0 0-.344-.347Z"/> </svg>';
    prayerQuoteButton.title = "Dodaj blok cytatu";
    prayerQuoteButton.setAttribute("aria-label", "Prayer Quote");
    prayerQuoteButton.classList.remove("ql-active");
  }

  if (prayerOpacitySelect) {
    prayerOpacitySelect.title = "Wybierz przezroczystość";
    prayerOpacitySelect.setAttribute("aria-label", "Prayer Opacity");

    // Znajdź label picker i ustaw domyślny tekst
    const pickerLabel = prayerOpacitySelect.querySelector(
      ".ql-picker-label"
    ) as HTMLElement;
    if (pickerLabel) {
      // Domyślnie wyświetl 100% (brak klasy opacity)
      pickerLabel.innerHTML =
        '<p>100%</p><svg fill="#D9D9D9" width="20px" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M12,2 C17.3333333,7.05448133 20,11.0544813 20,14 C20,18.418278 16.418278,22 12,22 C7.581722,22 4,18.418278 4,14 C4,11.0544813 6.66666667,7.05448133 12,2 Z M12.5401341,5.34306485 L12,4.793 L11.7832437,5.01193635 C8.50224504,8.34406715 6.63844327,11.052329 6.13806422,13.0012894 L17.8619358,13.0012894 C17.378236,11.1172943 15.6204935,8.52377427 12.5401341,5.34306485 L12.5401341,5.34306485 Z"/> </svg>';
    }

    // Znajdź wszystkie picker items i ustaw ich teksty
    const pickerItems = prayerOpacitySelect.querySelectorAll(".ql-picker-item");
    pickerItems.forEach((item) => {
      const dataValue = item.getAttribute("data-value");
      if (dataValue === "100") {
        item.textContent = "100%";
        item.setAttribute("title", "Przezroczystość 100% (nieprzezroczyste)");
      } else if (dataValue === "75") {
        item.textContent = "75%";
        item.setAttribute("title", "Przezroczystość 75%");
      } else if (dataValue === "50") {
        item.textContent = "50%";
        item.setAttribute("title", "Przezroczystość 50%");
      } else if (dataValue === "25") {
        item.textContent = "25%";
        item.setAttribute("title", "Przezroczystość 25%");
      }
    });
  }

  if (prayerLineSelect) {
    prayerLineSelect.title = "Wybierz typ linii z tagiem";
    prayerLineSelect.setAttribute("aria-label", "Prayer Line Type");

    // Znajdź label picker i ustaw domyślny tekst
    const pickerLabel = prayerLineSelect.querySelector(
      ".ql-picker-label"
    ) as HTMLElement;
    if (pickerLabel) {
      // Wyczyść SVG i dodaj tekst
      pickerLabel.innerHTML =
        '<p>Wstaw linię z tagiem</p><svg xmlns="http://www.w3.org/2000/svg" width="29" height="18" fill="#D9D9D9" viewBox="0 0 29 14"> <path fill-rule="evenodd" d="M5.5 0A2.5 2.5 0 0 1 8 2.5v6A2.5 2.5 0 0 1 5.5 11h-3A2.5 2.5 0 0 1 0 8.5v-6A2.5 2.5 0 0 1 2.5 0h3Zm-4 5v1.5h4V5h-4Zm0-1.5h5V2h-5v1.5Zm25-3.5A2.5 2.5 0 0 1 29 2.5v9a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 9 11.5v-9A2.5 2.5 0 0 1 11.5 0h15ZM11 8v1.5h12V8H11Zm0-1.5h16V5H11v1.5Zm0-3h16V2H11v1.5Z" clip-rule="evenodd"/> </svg>';
    }

    // Znajdź wszystkie picker items i ustaw ich teksty
    const pickerItems = prayerLineSelect.querySelectorAll(".ql-picker-item");
    pickerItems.forEach((item) => {
      const dataValue = item.getAttribute("data-value");
      if (dataValue === "normal") {
        item.textContent = "Zwykła";
        item.setAttribute("title", "Wstaw blok zwykłej linii z tagiem");
      } else if (dataValue === "bold") {
        item.textContent = "Pogrubiona";
        item.setAttribute("title", "Wstaw blok pogrubionej linii z tagiem");
      }
    });
  }

  if (prayerHeaderButton) {
    const qlFormatsContainer =
      prayerHeaderButton.parentElement as HTMLSpanElement;
    qlFormatsContainer.classList.add("custom-ql-formats");
  }
};
