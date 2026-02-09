/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./frontend/assets/js/src/utils/get-current-path.js
const getCurrentPath = () => {
  const url = new URL(window.location);
  const urlParams = new URLSearchParams(url.search);
  const wpQueryVars = cs_promo_settings.query_vars_keys;

  let varsValue = new URLSearchParams();

  wpQueryVars.forEach((key) => {
    if (urlParams.has(key)) {
      varsValue.append(key, urlParams.get(key));
    }
  });

  const siteURL = new URL(cs_promo_settings.site_url);
  const siteURLPath = siteURL.pathname.replace(/\/$/, "");
  const currentPath = url.pathname.replace(/\/$/, "");

  const rel = currentPath.replace(siteURLPath, "") || "/";

  return `${rel}${varsValue.toString()}`;
};

;// CONCATENATED MODULE: ./frontend/assets/js/src/utils/get-timestamp.js
const getTimestamp = () => {
    const date = new Date();
    const ts = Math.floor(date.getTime() / 1000);
    return ts;
  };
;// CONCATENATED MODULE: ./frontend/assets/js/src/utils/uuid4.js
const uuid4_getUUID4 = () => {
  // if available, use crypto.randomUUID
  if (window.crypto && window.crypto.randomUUID) {
    return crypto.randomUUID();
  }

  const uuid = new Array(36);
  for (let i = 0; i < 36; i++) {
    uuid[i] = Math.floor(Math.random() * 16);
  }
  uuid[14] = 4; // set bits 12-15 of time-high-and-version to 0100
  uuid[19] = uuid[19] &= ~(1 << 2); // set bit 6 of clock-seq-and-reserved to zero
  uuid[19] = uuid[19] |= 1 << 3; // set bit 7 of clock-seq-and-reserved to one
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
  return uuid.map((x) => x.toString(16)).join("");
};

;// CONCATENATED MODULE: ./frontend/assets/js/src/Libraries/LocalStorage.js




const LocalStorage = {
  getStorageKey() {
    const { storage_key = "icp" } = window.cs_promo_settings || {};
    return storage_key;
  },

  all() {
    const storage_key = this.getStorageKey();
    let stored = window.localStorage.getItem(storage_key);

    try {
      stored = JSON.parse(stored);
    } catch (e) {
      stored = null;
    }

    if (!stored) {
      stored = {
        visitorId: uuid4_getUUID4(),
        timestamps: {
          first: getTimestamp(),
          last: getTimestamp(),
        },
      };
      window.localStorage.setItem(storage_key, JSON.stringify(stored));
    }

    return stored;
  },

  get(key, defaultValue = false) {
    const all = this.all();

    if (Object.hasOwn(all, key)) {
      return all[key];
    }
    return defaultValue;
  },

  set(key, value) {
    const all = this.all();

    all[key] = value;

    const storage_key = this.getStorageKey();
    window.localStorage.setItem(storage_key, JSON.stringify(all));
  },

  previouslyFired(popupId) {
    popupId = popupId.toString();
    const fired = this.get("fired", {});

    if (Object.hasOwn(fired, popupId)) {
      return true;
    }
    return false;
  },

  setPopupFired(popupId) {
    popupId = popupId.toString();
    const fired = this.get("fired", {});
    const date = getTimestamp();
    fired[popupId] = date;
    this.set("fired", fired);
  },

  setPopupConversion(popupId, type = "converted") {
    popupId = popupId.toString();
    const converted = this.get("converted", {});
    converted[popupId] = {
      type,
      time: getTimestamp(),
    };
    this.set("converted", converted);
  },

  updateVisitTimestamp() {
    const timestamps = this.get("timestamps", {});
    const date = getTimestamp();
    timestamps.last = date;
    this.set("timestamps", timestamps);
  },

  getLatestInteractionTimestamp() {
    const timestamps = this.get("timestamps", {});
    const date = getTimestamp();
    const lastInteraction = timestamps.last || date;
    return lastInteraction;
  },

  setPageView() {
    const pageViews = this.get("pageViews", {});
    const url = getCurrentPath();

    if (!pageViews[url]) {
      pageViews[url] = {
        first: getTimestamp(),
        last: getTimestamp(),
        time: 0,
        views: 0,
      };
    }

    this.set("pageViews", pageViews);
  },

  increasePageViewTime(amount) {
    this.setPageView();
    const pageViews = this.get("pageViews", {});
    const url = getCurrentPath();

    if (pageViews[url]) {
      pageViews[url].time += amount;
      pageViews[url].last = getTimestamp();
    }
    this.set("pageViews", pageViews);
  },

  increasePageViews() {
    this.setPageView();
    const pageViews = this.get("pageViews", {});
    const url = getCurrentPath();

    if (pageViews[url]) {
      pageViews[url].views = (pageViews[url].views || 0) + 1;
      pageViews[url].last = getTimestamp();
    }
    this.set("pageViews", pageViews);
  },

  getCurrentPageViews() {
    const pageViews = this.get("pageViews", {});
    const url = getCurrentPath();

    if (pageViews[url]) {
      return pageViews[url].views || 0;
    }
    return 0;
  },

  getPageViewTime(url = null) {
    const pageViews = this.get("pageViews", {});
    url = url || getCurrentPath();

    if (pageViews[url]) {
      return pageViews[url].time;
    }
    return 0;
  },

  getTotalSiteTime() {
    const pageViews = this.get("pageViews", {});
    let total = 0;

    if (pageViews) {
      Object.values(pageViews).forEach((entry) => {
        total += parseInt(entry.time);
      });
    }

    return total;
  },

  getTotalSessions() {
    return this.get("sessions", 0);
  },

  maybeCountSession() {
    const sessions = this.get("sessions", 0);

    if (sessions === 0) {
      this.set("sessions", 1);
      return;
    }

    const latestTS = this.getLatestInteractionTimestamp();
    const time = getTimestamp();
    const delta = time - latestTS;
    const session_duration =
      window.cs_promo_settings.session_duration || 60 * 20;

    if (delta > session_duration) {
      this.set("sessions", sessions + 1);
    }
  },

  getVisitorId() {
    return this.get("visitorId");
  },

  setProductPageViewed(pageId) {
    const viewedProducts = this.get("productViews", {});

    if (!viewedProducts[pageId]) {
      viewedProducts[pageId] = {
        first: getTimestamp(),
        last: getTimestamp(),
        times: 0,
      };
    }

    viewedProducts[pageId].times += 1;
    viewedProducts[pageId].last = getTimestamp();

    this.set("productViews", viewedProducts);
  },
};

;// CONCATENATED MODULE: ./frontend/assets/js/src/Libraries/PromoHelpers.js
const PromoHelpers = (() => {
    const parseJSON = (str) => {
        try {
            const parsed = JSON.parse(str);

            if (parsed && typeof parsed === "object") {
                return parsed;
            }
        }
        catch (e) { }

        return false;
    };

    const copyToClipboard = (textToCopy) => {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(textToCopy);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((res, rej) => {
                document.execCommand('copy') ? res() : rej();
                textArea.remove();
            });
        }
    }

    const promoDelay = (time) => {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    const selectorCompose = (typeSelector, valueSelector) => {
        switch (typeSelector) {
            case 'class':
                if (valueSelector.startsWith('.')) {
                    return valueSelector;
                }
                return '.' + valueSelector;

            case 'id':
                if (valueSelector.startsWith('#')) {
                    return valueSelector;
                }
                return '#' + valueSelector;

            default:
                return valueSelector;
        }
    }

    const isPreviewPage = () => {
        return (document.body.classList.contains('single-cs-promo-popups')  || window.location.search.includes('__iconvert-promoter-preview'));
    }

    return {
        parseJSON,
        copyToClipboard,
        promoDelay,
        selectorCompose,
        isPreviewPage
    }
})();
;// CONCATENATED MODULE: ./frontend/assets/js/src/Libraries/PromoMessageBox.js
const PromoMessageBox = (() => {   
    const $ = jQuery;
    const show = (message, settings = {}) => {
        const {
            okButton = "OK",
            animationClass = "animate__slideInUp",
        } = settings;

        const template = `
            <div class="promo-message-box">
                <div class="promo-message-text">${message}</div>
                <button class="promo-message-button">${okButton}</button>
            </div>
        `;

        if ($('.promo-message-box').length > 0) {
            $('.promo-message-box').remove();
        }
        $('body').append(template);
        const _message__box = $('.promo-message-box');

        _message__box.addClass(`visible animate__animated ${animationClass}`);

        $('.promo-message-button').on('click', function(){
            _message__box.remove();
        });
    }

    return {
        show
    }
})();
;// CONCATENATED MODULE: ./frontend/assets/js/src/Libraries/SessionStorage.js



const SessionStorage = {

   getStorageKey() {
    const { storage_key = "icp" } = window.cs_promo_settings || {};
    return storage_key;
  },

  all() {
    let stored = window.sessionStorage.getItem(this.getStorageKey());

    try {
      stored = JSON.parse(stored);
    } catch (e) {
      stored = null;
    }

    if (!stored) {
      stored = {};
      window.sessionStorage.setItem("icp", JSON.stringify(stored));
    }

    return stored;
  },

  get(key, defaultValue = false) {
    const all = this.all();

    if (Object.hasOwn(all, key)) {
      return all[key];
    }

    return defaultValue;
  },
  set(key, value) {
    const all = this.all();

    all[key] = value;

    window.sessionStorage.setItem(this.getStorageKey(), JSON.stringify(all));
  },

  setPageView() {
    const pageViews = this.get("pageViews", {});
    const url = getCurrentPath();

    if (!pageViews[url]) {
      pageViews[url] = {
        first: getTimestamp(),
        last: getTimestamp(),
        time: 0,
      };
    }

    this.set("pageViews", pageViews);
  },

  getPageViewTime() {
    const pageViews = this.get("pageViews", {});
    const url = getCurrentPath();

    if (pageViews[url]) {
      return pageViews[url].time;
    }

    return 0;
  },

  increasePageViewTime(amount) {
    this.setPageView();
    const pageViews = this.get("pageViews", {});
    const url = getCurrentPath();

    if (pageViews[url]) {
      pageViews[url].time += amount;
      pageViews[url].last = getTimestamp();
    }
    this.set("pageViews", pageViews);
  },

  getTotalSiteTime() {
    const pageViews = this.get("pageViews", {});
    let total = 0;

    if (pageViews) {
      Object.values(pageViews).forEach((entry) => {
        total += parseInt(entry.time);
      });
    }

    return total;
  },
};

;// CONCATENATED MODULE: ./frontend/assets/js/src/Triggers/PromoPreview.js


const PromoPreview = (() => {
    const name = 'preview';
    
    const setup = (_trigger, popupID) => {        
        PromoTriggers.setTrigger(name, false, popupID);
        PromoTriggers.setAsDone(name, popupID);        
    }

    return {
        setup,
        name
    }
})();
;// CONCATENATED MODULE: ./frontend/assets/js/src/Libraries/PromoTriggers.js



const PromoTriggers = (() => {
  const triggers = {};
  let watcher = false;

  const actions = [
    "on-click",
    "exit-intent",
    "scroll-percent",
    "scroll-to-element",
  ];

  const repeatableActions = ["on-click"];

  const showTriggers = () => {
    console.log("triggers::");
    console.log(triggers);
  };

  const initPopup = (popupID) => {
    if (typeof triggers[popupID] !== Object) {
      triggers[popupID] = {
        settings: {
          hasRepeatableAction: false,
          isPromoPreview: false,
        },
      };
    }
  };

  const setTrigger = (triggerName, value, popupID) => {
    if (triggers[popupID] === undefined) {
      triggers[popupID] = {};
    }

    triggers[popupID][triggerName] = value;
    if (repeatableActions.includes(triggerName)) {
      triggers[popupID].settings.hasRepeatableAction = true;
    }

    if (triggerName === PromoPreview.name) {
      triggers[popupID].settings.isPromoPreview = true;
    }
  };

  const setAsDone = (triggerName, popupID) => {
    if (triggers[popupID] === undefined) {
      triggers[popupID] = {};
    }

    triggers[popupID][triggerName] = true;
  };

  const watch = () => {
    checkAllTriggers();
    watcher = setInterval(checkAllTriggers, 1000);
  };

  const checkAllTriggers = () => {
    Object.keys(triggers).forEach((popupID) => {
      shouldShowCampaign(popupID);
    });
    shouldWatcherStop();
  };

  const shouldShowCampaign = (popupID, triggeredByAction = false) => {
    let allTrue = true;
    let hasAction = false;
    let shouldShow = false;

    Object.entries(triggers[popupID]).forEach((trigger) => {
      if (actions.includes(trigger[0])) {
        hasAction = true;
      } else {
        if (trigger[1] === false) {
          allTrue = false;
        }
      }
    });

    if (triggeredByAction === false) {
      // show the popup if there is no action trigger and every thing is true
      if (allTrue === true && hasAction === false) {
        PromoPopup.promoShow(popupID);
        shouldShow = true;
      }
    } else {
      if (allTrue === true) {
        PromoPopup.promoShow(popupID);
        shouldShow = true;
      }
    }

    return shouldShow;
  };

  const shouldWatcherStop = () => {
    if (Object.keys(triggers).length === 0) {
      stopWatcher();
    }
  };

  const stopWatcher = () => {
    clearInterval(watcher);
  };

  const isPromoPreview = (popupID) => {
    return triggers[popupID]?.settings?.isPromoPreview;
  };

  const dequeuePopup = (popupID) => {
    if (!triggers[popupID]) {
      return;
    }

    if (!triggers[popupID].settings.hasRepeatableAction) {
      delete triggers[popupID];
    }
  };

  return {
    setTrigger,
    setAsDone,
    watch,
    dequeuePopup,
    showTriggers,
    shouldShowCampaign,
    initPopup,
    isPromoPreview,
  };
})();

;// CONCATENATED MODULE: ./frontend/assets/js/src/Libraries/PromoPopup.js





const popups = ["simple-popup", "lightbox-popup", "slidein-popup"];

const maybeMoveCloseButton = (popupEl, promoType) => {
  if (promoType === "fullscreen-mat") {
    const closeButtonElement = popupEl.find(
      ".wp-block-cspromo-promopopupclose__outer"
    );
    closeButtonElement.hide();
    const targetWrapper = popupEl.find(".wp-block-cspromo-promopopup__outer");
    if (closeButtonElement && targetWrapper) {
      closeButtonElement.detach().prependTo(targetWrapper).fadeIn(1000);
    }
  }
};

// check for type - simple / slidein / lightbox / mate
const maybeMovePopup = (popupEl) => {
  const $ = jQuery;
  const promoType = popupEl.data().csPromoType;

  maybeMoveCloseButton(popupEl, promoType);

  if (popups.includes(promoType)) {
    $("html").append(popupEl);
  }
};

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const target = entry.target;
    const popupWrapper = target.closest("[data-cs-promoid]");
    const targetHeight = target.clientHeight;
    const childrenHeight = target.querySelector(
      ".wp-block-cspromo-promopopup__container"
    ).clientHeight;

    if (targetHeight < childrenHeight) {
      target.classList.add("align-items-top");
    } else {
      target.classList.remove("align-items-top");
      popupWrapper.classList.add("is-overflowed");
    }

    if (childrenHeight > window.innerHeight) {
      popupWrapper.classList.add("is-overflowed");
    } else {
      popupWrapper.classList.remove("is-overflowed");
    }
  }
});

const getObservedContainer = (popupId) => {
  return document.querySelector(
    `#cs-popup-container-${popupId} .wp-block-cspromo-promopopup__outer`
  );
};

const popupObserveResize = (popupId) => {
  const popupContent = getObservedContainer(popupId);
  if (popupContent) {
    resizeObserver.observe(popupContent);
  }
};

const popupUnobserveResize = (popupId) => {
  const popupContent = getObservedContainer(popupId);
  if (popupContent) {
    resizeObserver.unobserve(popupContent);
  }
};

const addAnimationOverflowWhileAnimate = (popupID, popupContent) => {
  const $popupContainer = jQuery("#cs-popup-container-" + popupID);

  const popupType = $popupContainer.data("cs-promo-type");

  let overflowWrapper = ".wp-block-cspromo-promopopup__wrapperContent";

  switch (popupType) {
    case "slidein-popup":
      overflowWrapper = ".wp-block-cspromo-promopopup__wrapperContainer";
    case "simple-popup":
      overflowWrapper = ".wp-block-cspromo-promopopup__outer";
      break;
  }

  const $el = $popupContainer.find(overflowWrapper);

  $el[0].style.setProperty("overflow", "hidden", "important");
  popupContent.on("animationstart.overflow", () => {
    $el[0].style.setProperty("overflow", "hidden", "important");
    popupContent.on("animationend.overflow", () => {
      $el.css("overflow", "");
      $el.off("animationstart.overflow");
      $el.off("animationend.overflow");
    });
  });
};

const PromoPopup = (() => {
  const $ = jQuery;

  const promoShow = (popupID) => {
    let elementPopupByID = $("#cs-popup-container-" + popupID);

    const isPromoPreview =
      PromoTriggers.isPromoPreview(popupID) || PromoHelpers.isPreviewPage();

    // don't try to show it again if it's already visible
    if (!elementPopupByID.length || elementPopupByID.hasClass("visible")) {
      return false;
    }

    maybeMovePopup(elementPopupByID);
    // we need to select the element again otherwise it will reference the old node
    elementPopupByID = $("#cs-popup-container-" + popupID);

    if (!isPromoPreview) {
      // check if the popup is already fired
      if (!LocalStorage.previouslyFired(popupID)) {
        promoAnalytics(popupID, "first_view");
      }

      // set the popup as fired
      LocalStorage.setPopupFired(popupID);

      // send view event
      promoAnalytics(popupID, "view");
    }

    // update the stats
    PromoTriggers.dequeuePopup(popupID);

    let duration =
      elementPopupByID
        .find("[data-animation-duration]")
        .data("animation-duration") ?? 1;

    duration = Math.max(parseFloat(duration) * 1000, 10);

    const isFullScreenMat = elementPopupByID.hasClass(
      "cs-popup-container-type-fullscreen-mat"
    );

    const isFloatingBar = elementPopupByID.hasClass(
      "cs-popup-container-type-floating-bar"
    );
    const isAboveContent = elementPopupByID.hasClass(
      "cs-fb-position-above-content"
    );

    let bodyClasses = ["cs-popup-open"].filter(Boolean);

    const isLightbox = elementPopupByID.hasClass(
      "cs-popup-container-type-lightbox-popup"
    );

    const isSlideIn = elementPopupByID.hasClass(
      "cs-popup-container-type-slidein-popup"
    );

    const isSimplePopup = elementPopupByID.hasClass(
      "cs-popup-container-type-simple-popup"
    );

    const isInlinePopup = elementPopupByID.hasClass(
      "cs-popup-container-type-inline-promotion-bar"
    );

    const animateContainer =
      isLightbox || isSlideIn || isSimplePopup || isFullScreenMat;

    document.body.classList.add(...bodyClasses);

    if (isFullScreenMat) {
      document
        .querySelector("html")
        .classList.add("cs-popup-open__fullscreen-mat");
    }

    if (animateContainer) {
      elementPopupByID.fadeIn({
        duration,
        complete: () => {
          elementPopupByID.addClass("visible");
        },
      });
    } else {
      elementPopupByID.addClass("visible");
    }

    let popupContent = elementPopupByID.find(
      ".wp-block-cspromo-promopopup__container"
    );

    if (isFullScreenMat) {
      popupContent = popupContent.closest(
        ".wp-block-cspromo-promopopup__outer"
      );
      popupContent.css("animation-duration", duration + "ms");
      popupContent.addClass("animate__animated");
    }

    const animateContent = () => {
      elementPopupByID.css("display", "");
      const effect = popupContent.data("show-effect") || "animate__none";
      if (!isInlinePopup) {
        addAnimationOverflowWhileAnimate(popupID, popupContent);
      }
      popupContent.addClass(effect);

      if (effect === "animate__none") {
        popupContent.addClass("animate__animated");
      }
    };

    // floating bar position
    if (isFloatingBar) {
      const vClass = popupContent.data("v-position");
      elementPopupByID.addClass("cs-v-pos-" + vClass);
    }

    // special cases popup type floating-bar
    if (
      elementPopupByID.hasClass("cs-popup-container-type-floating-bar") &&
      $(window).scrollTop() >= elementPopupByID.height()
    ) {
      elementPopupByID.css({
        position: "relative",
        left: "0",
        top: "0",
        right: "0",
      });
    }

    // above content
    if (elementPopupByID.hasClass("cs-fb-position-above-content")) {
      $("body").prepend(elementPopupByID);
    }

    if (popupContent.length) {
      if (isAboveContent) {
        elementPopupByID.css("max-height", "0px");

        const whileAnimate = () => {
          const frameExecution = () => {
            const popupContentRect = popupContent
              .closest(".animate__animated")[0]
              .getBoundingClientRect();
            const popupIdRect = elementPopupByID[0].getBoundingClientRect();

            // calculate the intersection height of the two rects
            const intersectionHeight = Math.max(
              popupContentRect.bottom - popupIdRect.top,
              0
            );

            elementPopupByID.css(
              "max-height",
              Math.max(intersectionHeight) + "px"
            );
          };

          const start = performance.now();
          const end = start + duration;

          frameExecution();

          function animate(time) {
            if (time <= end) {
              frameExecution();
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        };

        popupContent.on("animationstart.cs-promo-popup-enter", () =>
          requestAnimationFrame(whileAnimate)
        );
        popupContent.on("animationend.cs-promo-popup-enter", () => {
          popupContent.off("animationstart.cs-promo-popup-enter");
          popupContent.off("animationend.cs-promo-popup-enter");
          elementPopupByID.css("max-height", "auto");
        });
      }

      popupObserveResize(popupID);
      animateContent();

      if (isLightbox) {
      }
    }
  };

  const promoAnalytics = (popupId, gaEvent, identifier = null) => {
    if (PromoTriggers.isPromoPreview(popupId) || PromoHelpers.isPreviewPage()) {
      return;
    }

    const payload = {
      action: "iconvertpr_promo_analytics",
      event: gaEvent,
      popup: popupId,
      identifier: identifier,
      _wpnonce: SessionStorage.get("analytics_nonce"),
      visitor_id: LocalStorage.getVisitorId(),
    };

    $.post(cs_promo_settings.ajax_url, payload, (response) => {});
  };

  const promoRemovePopupEvent = (
    popupID,
    { disableEsc = false, externalClose = false, disableMaskClick = false } = {}
  ) => {
    const mainPopupContainer = $("#cs-popup-container-" + popupID);

    mainPopupContainer.attr("data-disable-esc", disableEsc);
    mainPopupContainer.attr("data-disable-mask-click", disableMaskClick);
    mainPopupContainer.attr("data-external-close", externalClose);

    if (mainPopupContainer.attr("data-exit-bounded")) {
      return;
    }

    mainPopupContainer.attr("data-exit-bounded", true);
    setTimeout(() => {
      $("body").on("keydown", exit);
      $("body").on("click", mainPopupContainer, exit);
      mainPopupContainer.on("click", exit);
    }, 0);

    const exit = (e) => {
      const popupContainer = e.target.closest(".cs-popup-container");
      const newPopupID = popupContainer?.dataset?.csPromoid;

      if (typeof newPopupID !== "undefined") {
        popupID = newPopupID;
      }

      const mainPopupContainer = $("#cs-popup-container-" + popupID);
      const disableEsc = mainPopupContainer.attr("data-disable-esc") === "true";
      const disableMaskClick =
        mainPopupContainer.attr("data-disable-mask-click") === "true";
      const externalClose =
        mainPopupContainer.attr("data-external-close") === "true";

      const isCloseButton = !!e.target.closest(".cs-popup-close");

      if (isCloseButton) {
        e.preventDefault();
      }

      let isClosedByMask =
        !disableMaskClick && e.target.id === "cs-popup-container-" + popupID;

      let isClosedByEsc = !disableEsc && e.keyCode === 27;

      let isClosedByIcon = isCloseButton;

      let shouldExit =
        isClosedByMask ||
        isClosedByEsc ||
        isClosedByIcon ||
        externalClose === true;
      if (
        $("#cs-popup-container-" + popupID).hasClass(
          "cs-popup-container-type-floating-bar"
        )
      ) {
        shouldExit = isCloseButton;
      }

      if (shouldExit) {
        promoClosePopup(popupID);

        if (isCloseButton) {
          const label = $(e.target)
            .closest("[data-conversion-identifier]")
            .data("conversion-identifier");
          promoAnalytics(popupID, "close", label);
        }
      }
    };

    if (externalClose === true) {
      exit();
    }
  };

  const promoClosePopup = (popupID) => {
    document.body.classList.forEach((className) => {
      if (className.startsWith("cs-popup-open")) {
        document.body.classList.remove(className);
      }
    });

    document
      .querySelector("html")
      .classList.remove("cs-popup-open__fullscreen-mat");

    const mainPopupContainer = $("#cs-popup-container-" + popupID);

    // don't try to show it again if it's already visible
    if (!mainPopupContainer.length || !mainPopupContainer.hasClass("visible")) {
      return false;
    }

    let duration =
      mainPopupContainer
        .find("[data-animation-duration]")
        .data("animation-duration") ?? 1;

    duration = parseFloat(duration) * 1000;

    let popupContent = mainPopupContainer.find(
      ".wp-block-cspromo-promopopup__container"
    );

    const isFullScreenMat = mainPopupContainer.hasClass(
      "cs-popup-container-type-fullscreen-mat"
    );

    if (isFullScreenMat) {
      popupContent = popupContent.closest(
        ".wp-block-cspromo-promopopup__outer"
      );
    }

    const showAnimate =
      popupContent.attr("data-show-effect") || "animate__none";
    const exitAnimate =
      popupContent.attr("data-exit-effect") || "animate__none";

    const isAboveContent = mainPopupContainer.hasClass(
      "cs-fb-position-above-content"
    );

    const hideMainContainer = (slide = false, duration = 0) => {
      popupUnobserveResize(popupID);

      const complete = () => {
        mainPopupContainer.removeClass("visible");
        popupContent.removeClass(exitAnimate);
        mainPopupContainer.css("display", "");
      };

      mainPopupContainer[slide ? "slideUp" : "fadeOut"]({
        duration,
        complete,
      });
    };

    if (exitAnimate) {
      if (isAboveContent) {
        const whileAnimate = () => {
          const frameExecution = () => {
            const popupContentRect = popupContent[0].getBoundingClientRect();
            const popupIdRect = mainPopupContainer[0].getBoundingClientRect();

            // calculate the intersection height of the two rects
            const intersectionHeight = Math.max(
              popupContentRect.bottom - popupIdRect.top,
              0
            );

            mainPopupContainer.css(
              "max-height",
              Math.max(intersectionHeight) + "px"
            );
          };

          const start = performance.now();
          const end = start + duration;

          frameExecution();

          function animate(time) {
            if (time <= end) {
              frameExecution();
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        };

        popupContent.on("animationstart.cs-promo-popup-exit", whileAnimate);
        popupContent.on("animationend.cs-promo-popup-exit", () => {
          popupContent.off("animationstart.cs-promo-popup-exit");
          popupContent.off("animationend.cs-promo-popup-exit");
          mainPopupContainer.css("max-height", "0");
        });
        hideMainContainer(
          true,
          exitAnimate === "animate__none" ? 0 : duration
        );
      } else {
        const isLightbox =
          mainPopupContainer.hasClass(
            "cs-popup-container-type-lightbox-popup"
          ) ||
          mainPopupContainer.hasClass(
            "cs-popup-container-type-fullscreen-mat"
          ) ||
          mainPopupContainer.hasClass(
            "cs-popup-container-type-slidein-popup"
          ) ||
          mainPopupContainer.hasClass("cs-popup-container-type-floating-bar") ||
          mainPopupContainer.hasClass("cs-popup-container-type-simple-popup");

        if (isLightbox) {
          hideMainContainer(false, duration);
        } else {
          popupContent.on("animationend", () => hideMainContainer(false, 0));
        }
      }
      addAnimationOverflowWhileAnimate(popupID, popupContent);

      popupContent.removeClass(showAnimate).addClass(exitAnimate);
    } else {
      hideMainContainer();
    }

    if (!PromoHelpers.isPreviewPage()) {
      LocalStorage.setPopupConversion(popupID, "closed");
    }
  };

  const listenForExternalClose = () => {
    document.body.addEventListener("closePopup", (e) => {
      promoClosePopup(e.detail.popupID);
    });
  };

  const listenForExternalOpen = () => {
    document.body.addEventListener("openPopup", (e) => {
      promoShow(e.detail.popupID);
    });
  };

  const listenForExternalAnalytics = () => {
    document.body.addEventListener("icPromoAnalyticsPopup", (e) => {
      const { popupID, event, identifier } = e.detail;
      promoAnalytics(popupID, event, identifier);
    });
  };

  return {
    promoAnalytics,
    promoShow,
    promoRemovePopupEvent,
    promoClosePopup,
    listenForExternalClose,
    listenForExternalOpen,
    listenForExternalAnalytics,
  };
})();

;// CONCATENATED MODULE: ./frontend/assets/js/src/Libraries/Editor/PromoActionButton.js





const PromoActionButton = (() => {
  const $ = jQuery;
  const visibleClass = "visible";

  const setup = () => {
    copyCode();
    setAnalyticsOnClick();
    setConversionTracking();
  };

  const setAnalyticsOnClick = () => {
    if (PromoHelpers.isPreviewPage()) {
      $(document).on("click", ".cs-popup-action a", function (e) {
        e.preventDefault();
        e.stopPropagation();
        PromoMessageBox.show(
          "You cannot click links and buttons in preview mode.",
          {}
        );
      });
      return;
    }

    document.querySelectorAll(".cs-popup-action a").forEach((element) => {
      element.addEventListener("click", clickPopupElemEvent);
    });
  };

  const clickPopupElemEvent = (e) => {
    const element = e.target;
    const parentPopup = element.closest(".cs-popup-container");

    if (parentPopup) {
      const popupID = parentPopup?.dataset?.csPromoid;
      if (popupID) {
        const label = $(e.target)
          .closest("[data-conversion-identifier]")
          .data("conversion-identifier");
        PromoPopup.promoAnalytics(popupID, "click", label);
        // prevent multiple clicks
        element.removeEventListener("click", clickPopupElemEvent);
      }
    }
  };

  const copyCode = () => {
    document.querySelectorAll(".cs-popup-copy").forEach((item) => {
      const css = {
        backgroundColor: $(item).css("background-color"),
        borderColor: $(item).css("border-color"),
        borderRadius: $(item).css("border-radius"),
        color: $(item).css("color"),
      };
      item.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const textToCopy = item.dataset?.copy;

        if(PromoHelpers.isPreviewPage()) {
          PromoMessageBox.show(
           `Normally this button would copy <strong style="font-weight:700;color:#2271b1">${textToCopy}</strong> to clipboard,<br/>but in preview mode, the copy functionality is disabled.`,
            {}
          );
          return;
        }

        if (textToCopy) {
          PromoHelpers.copyToClipboard(textToCopy);
          showTooltip(item, css);
        }
      });
    });
  };

  const showTooltip = (item, css = {}) => {
    const _elem = $(item);
    let messageDiv = _elem
      .parents(".cs-popup-action")
      .find(".optrix-success-message");
    if (messageDiv.length > 0) {
      messageDiv.removeClass(visibleClass);
    } else {
      // const container = document.createElement("div");
      _elem.after(
        `<div class="optrix-success-message animate__animated">${item.dataset?.success}</div>`
      );
      messageDiv = _elem
        .parents(".cs-popup-action")
        .find(".optrix-success-message");
    }

    if (!css.backgroundColor) {
      css.backgroundColor = _elem.css("background-color");
    }

    if (!css.borderColor) {
      css.borderColor = _elem.css("border-color");
    }

    if (!css.borderRadius) {
      css.borderRadius = _elem.css("border-radius");
    }

    if (!css.color) {
      css.color = _elem.css("color");
    }

    messageDiv.css(css);

    messageDiv.addClass(visibleClass);

    setTimeout(
      () => {
        messageDiv.removeClass(visibleClass);
      },
      Math.max(
        1200,
        // an educated guess of how long it takes to read 10 characters
        Math.ceil(messageDiv.text().length / 7) * 1000
      )
    );
  };

  const setConversionTracking = () => {
    $(document).on("click", "[data-is-conversion] a", function () {
      if (PromoHelpers.isPreviewPage()) {
        return;
      }

      const parentPopup = $(this).closest(".cs-popup-container");

      if (parentPopup) {
        const popupID = parentPopup.data("cs-promoid");
        if (popupID) {
          LocalStorage.setPopupConversion(popupID, "converted");
        }
      }
    });

    $(document).on("iconvert_email_subscribed", function (e, data) {
      if (PromoHelpers.isPreviewPage()) {
        return;
      }

      const popupID = data.popupID;

      if (popupID) {
        LocalStorage.setPopupConversion(popupID, "converted");
      }
    });
  };

  return {
    setup,
  };
})();

;// CONCATENATED MODULE: ./frontend/assets/js/src/Triggers/PromoAfterInactivity.js


const PromoAfterInactivity = (() => {
    const name = 'after-inactivity';
    const $ = jQuery;
    const events = 'mousemove mousedown keypress DOMMouseScroll mousewheel touchmove MSPointerMove';
    let time = 0;
    let threads = {};
    let watcher = false;

    const watch = () => {
        watcher = setInterval(() => {
            // count
            time += 1000;
            
            Object.keys(threads).forEach((popupID) => {                
                if(time >= threads[popupID]) {
                    PromoTriggers.setAsDone(name, popupID);
                    removeThread(popupID);
                }
            });

            garbageCollector();
        }, 1000);
    };

    const resetTimer = () => {
        time = 0;
    }

    const addListener = () => {        
        $('body').on(events, resetTimer);
    }

    const removeListener = () => {
        $('body').off(events, resetTimer);
    }

    const setup = (_trigger, popupID) => {        
        let popupTime = parseInt(_trigger[0]) * 1000;

        addThread(popupID, popupTime);
        PromoTriggers.setTrigger(name, false, popupID);

        if (watcher === false) {
            addListener();
            watch();
        }
    }

    const addThread = (popupID, popupTime) => {
        threads[popupID] = popupTime;
    }

    const removeThread = (popupID) => {
        delete threads[popupID];
    }

    const garbageCollector = () => {
        if (Object.keys(threads).length === 0) {            
            clearInterval(watcher);
            removeListener();
        }
    }

    return {
        setup,
        name
    }
})();
;// CONCATENATED MODULE: ./frontend/assets/js/src/Triggers/PromoManuallyOpen.js


const PromoManuallyOpen = (() => {
    const name = 'manually-open';
    
    const setup = (_trigger, popupID) => {        
        PromoTriggers.setTrigger(name, false, popupID);
    }    

    return {
        setup,
        name
    }
})();
;// CONCATENATED MODULE: ./frontend/assets/js/src/Triggers/PromoOnClick.js



const PromoOnClick = (() => {
    const name = 'on-click';
    const listeners = [];

    const setup = (_trigger, popupID) => {        
        const selector = PromoHelpers.selectorCompose(_trigger[0], _trigger[1]);        
        
        PromoTriggers.setTrigger(name, false, popupID);

        if (selector !== null) {
            document.querySelectorAll(selector).forEach(item => {
                item.addEventListener('click', (e) => {
                    clickEventWithoutRemovingListener(e, popupID)
                });                
            });

            if(!listeners.includes(popupID)) {
                listeners.push(popupID);
            }
        }
    }

   

    const clickEventWithoutRemovingListener = (e, popupID) => {
        e.preventDefault();

        PromoTriggers.shouldShowCampaign(popupID, true)
    }

    return {
        setup,
        name
    }
})();
;// CONCATENATED MODULE: ./frontend/assets/js/src/Triggers/PromoScrollToElement.js



const PromoScrollToElement = (() => {
    const name = 'scroll-to-element';
    const listeners = [];

    const setup = (_trigger, popupID) => {
        const selector = PromoHelpers.selectorCompose(_trigger[0], _trigger[1]);

        window.addEventListener('scroll', (e) => {
            scrollEvent(e, popupID, selector)
        });
        
        addListener(popupID);
    }

    const scrolledIntoView = (selector) => {
        const element = document.querySelector(selector);        

        if (element === null) {
            return false;
        }

        const rectElement = element.getBoundingClientRect();
        const elemTop = rectElement.top;
        const elemBottom = rectElement.bottom;
        
        const isElementVisible = elemTop < window.innerHeight && elemBottom >= 0;
        
        return isElementVisible;
    }

    const scrollEvent = (e, popupID, selector) => {
        if (!listeners.includes(popupID)) {
            return false;
        }        
        
        if (scrolledIntoView(selector) === true) {
            if (PromoTriggers.shouldShowCampaign(popupID, true) === true) {            
                removeListener(popupID);
            }
        }
    }

    const addListener = (popupID) => {
        if (!listeners.includes(popupID)) {
            PromoTriggers.setTrigger(name, false, popupID);
            listeners.push(popupID);
        }
    }

    const removeListener = (popupID) => {
        listeners.splice(listeners.indexOf(popupID), 1);
    }

    return {
        setup,
        name
    }
})();
;// CONCATENATED MODULE: ./frontend/assets/js/src/Triggers/PromoScrollPercent.js


const PromoScrollPercent = (() => {
    const name = 'scroll-percent';
    const listeners = [];

    const setup = (_trigger, popupID) => {
        window.addEventListener('scroll', (e) => {
            scrollEvent(e, popupID, _trigger[0])
        });
        
        addListener(popupID);
    }

    const scrollPercentage = () => {
        return Math.round((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100);
    }

    const scrollEvent = (e, popupID, percentage) => {
        if (!listeners.includes(popupID)) {
            return false;
        }
        
        if (scrollPercentage() >= percentage) {
            if (PromoTriggers.shouldShowCampaign(popupID, true) === true) {            
                removeListener(popupID);
            }
        }
    }

    const addListener = (popupID) => {
        if (!listeners.includes(popupID)) {
            PromoTriggers.setTrigger(name, false, popupID);
            listeners.push(popupID);
        }
    }

    const removeListener = (popupID) => {
        listeners.splice(listeners.indexOf(popupID), 1);
    }

    return {
        setup,
        name
    }
})();
;// CONCATENATED MODULE: ./frontend/assets/js/src/Triggers/PromoPageLoad.js








const triggersToSkipPageLoad = [
  PromoOnClick.name,
  PromoAfterInactivity.name,
  PromoManuallyOpen.name,
  PromoScrollPercent.name,
  PromoScrollToElement.name,

];

const PromoPageLoad = (() => {
  const name = "page-load";

  let time = 0;
  let threads = {};
  let watcher = false;

  const watch = () => {
    watcher = setInterval(() => {
      time += 1000;

      Object.keys(threads).forEach((popupID) => {
        if (time >= threads[popupID]) {
          completeTrigger(popupID);
        }
      });

      garbageCollector();
    }, 1000);
  };

  const setup = (_trigger, popupID, allTriggers) => {
    let triggersKeys = Object.keys(allTriggers);
    if (
      triggersToSkipPageLoad.some((trigger) => triggersKeys.includes(trigger))
    ) {
      PromoTriggers.setAsDone(name, popupID);
      return;
    }

    let popupTime = parseInt(_trigger[0]) * 1000;

    addThread(popupID, popupTime);
    PromoTriggers.setTrigger(name, false, popupID);

    if (popupTime === 0) {
      completeTrigger(popupID);
      garbageCollector();
    } else {
      if (watcher === false) {
        watch();
      }
    }
  };

  const completeTrigger = (popupID) => {
    PromoTriggers.setAsDone(name, popupID);
    removeThread(popupID);
  };

  const addThread = (popupID, popupTime) => {
    threads[popupID] = popupTime;
  };

  const removeThread = (popupID) => {
    delete threads[popupID];
  };

  const garbageCollector = () => {
    if (Object.keys(threads).length === 0) {
      clearInterval(watcher);
    }
  };

  return {
    setup,
    name,
  };
})();

;// CONCATENATED MODULE: ./frontend/assets/js/src/Libraries/PromoTriggerSetup.js











const $ = jQuery;


class PromoTriggerSetup {
  constructor(triggers, extraData) {
    this.cartEventActivate = false;
    this.triggers = triggers;
    this.extraData = extraData;
    this.addExtras();
    this.setup();
    this.cartDetails();
  }
  customEventCartDetails(cartDetails) {
    const event = new CustomEvent("icpPromoCartDetailsChanged", {
      detail: {
        countItemsCart: cartDetails?.count || 0,
        amountTotalCart: cartDetails?.total || 0,
        productsIdsCart: cartDetails?.productsIds || [],
      },
    });
    document.body.dispatchEvent(event);
  }

  loadCartDetails() {
    $.post(
      cs_promo_settings.ajax_url,
      {
        action: "iconvertpr_promo_get_cart_details",
        cart: "cart_details",
      },
      (response) => {
        if (response.success) {
          this.customEventCartDetails(response.data);
        }
      }
    );
  }

  addWCDomEvents() {
    $(document.body).on(
      "added_to_cart removed_from_cart updated_cart_totals wc_cart_button_updated",
      (e) => {
        this.loadCartDetails();
      }
    );
  }

  addWCEvents() {
    if (window.wp && window.wp.data) {
      const unsub = window.wp.data.subscribe(() => {
        const wcCartStore = window.wp.data.select("wc/store/cart");

        if (wcCartStore) {
          const cartItems = wcCartStore.getCartData().items;
          const cartTotals = wcCartStore?.getCartTotals();

          const total =
            parseInt(cartTotals.total_price, 10) /
            10 ** cartTotals.currency_minor_unit;

          const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

          const productsIds = cartItems.map((item) => item.id);

          this.customEventCartDetails({
            count,
            total,
            productsIds,
          });
        } else {
          unsub();
          this.addWCDomEvents();
        }
      });

      return;
    } else {
      this.addWCDomEvents();
    }
  }

  cartDetails() {
    this.cartEventActivate = true;
    if (this.extraData?.wc?.active) {
      this.addWCEvents();
      this.customEventCartDetails(this.extraData.wc.cart);
    }
  }

  addExtras() {
    if (this.extraData?.wc?.is_product) {
      LocalStorage.setProductPageViewed(this.extraData.page_id);
    }

    LocalStorage.increasePageViews();
  }

  setup() {
    Object.keys(this.triggers).forEach((popupID) => {
      PromoPopup.promoRemovePopupEvent(popupID);
      PromoTriggers.initPopup(popupID);

      Object.keys(this.triggers[popupID]).forEach((triggerName) => {
        this.addTrigger(popupID, triggerName);
      });
    });
  }

  addTrigger(popupID, triggerName) {
    popupID = popupID + "";
    // console.log('setup triggerName', this.triggers);
    switch (triggerName) {
      case PromoPreview.name:
        PromoPreview.setup(this.triggers[popupID][triggerName], popupID);
        break;

      case PromoOnClick.name:
        PromoOnClick.setup(this.triggers[popupID][triggerName], popupID);
        break;

      case PromoAfterInactivity.name:
        PromoAfterInactivity.setup(
          this.triggers[popupID][triggerName],
          popupID
        );
        break;

      case PromoPageLoad.name:
        PromoPageLoad.setup(
          this.triggers[popupID][triggerName],
          popupID,
          this.triggers[popupID]
        );
        break;

      case PromoManuallyOpen.name:
        PromoManuallyOpen.setup(this.triggers[popupID][triggerName], popupID);
        break;

      case PromoScrollPercent.name:
        PromoScrollPercent.setup(this.triggers[popupID][triggerName], popupID);
        break;

      case PromoScrollToElement.name:
        PromoScrollToElement.setup(
          this.triggers[popupID][triggerName],
          popupID
        );
        break;
    }
  }
}

;// CONCATENATED MODULE: ./frontend/assets/js/src/monitors.js




const subs = new Map();
let isVisible = true;

const activateTab = () => {
  isVisible = true;
};

const deactivateTab = () => {
  isVisible = false;
};

window.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    activateTab();
  } else {
    deactivateTab();
  }
});

window.addEventListener("focus", activateTab);
window.addEventListener("blur", deactivateTab);


const subscribeToMonitor = (callback) => {
  const id = getUUID4();

  subs.set(id, callback);

  return () => {
    subs.delete(id);
  };
};


const runSubs = () => {
  subs.forEach((callback) => {
    try {
      callback();
    } catch (e) {
      console.error(e);
    }
  });
}

const updateStorage = () => {
  if (!isVisible) {
    return;
  }

 
  LocalStorage.updateVisitTimestamp();
  LocalStorage.increasePageViewTime(1);
  SessionStorage.increasePageViewTime(1);

  runSubs();
};

window.addEventListener("storage", runSubs);

const startInteractivityMonitor = () => {
  setInterval(updateStorage, 1000);
};

;// CONCATENATED MODULE: ./frontend/assets/js/src/cs-promo-popups-main.js
/* global promoTriggersSettings */











const loadHeadData = (headHTML) => {
  jQuery("head").append(headHTML);
};

async function start($) {
  if (PromoHelpers.isPreviewPage()) {
    PromoActionButton.setup();

    $(" a , button ").each((index, elem) => {
      const container = $(elem).closest(".cs-popup-container");
      if (container.length === 0) {
        $(elem).on("click", function (e) {
          e.stopPropagation();
          e.preventDefault();

          PromoMessageBox.show(
            "You cannot click links and buttons in preview mode.",
            {}
          );
        });
      }
    });

    $(window).on("iconvert-promo-box-message", function (event, data) {
      PromoMessageBox.show(data.message, data.options || {});
    });

    return;
  }

  const {
    head,
    popups,
    triggers,
    inlinePopups,
    analytics_nonce,
    data: extraData = {},
  } = window.icPromoPopupsData || {};

  loadHeadData(head);

  $("head").append(head);

  LocalStorage.maybeCountSession();
  startInteractivityMonitor();

  Object.entries(popups).forEach(([key, value]) => {
    if (value) {
      if (inlinePopups.includes(parseInt(key))) {
        $(`[data-iconvert-inline-popup-id="${key}"]`).replaceWith(value);
        return;
      }

      $("body").append(value);
    }
  });

  SessionStorage.set("analytics_nonce", analytics_nonce);

  new PromoTriggerSetup(triggers, extraData);
  PromoTriggers.watch();
  PromoActionButton.setup();

  PromoPopup.listenForExternalClose();
  PromoPopup.listenForExternalOpen();
  PromoPopup.listenForExternalAnalytics();
}

if (document.body.classList.contains("cs-promo-popups-loaded")) {
  start(jQuery);
}

document.addEventListener("cs-promo-popups-loaded", function () {
  start(jQuery);
});

;// CONCATENATED MODULE: ./frontend/assets/js/index.js





window.iconvertPromoPopup = PromoPopup;

/******/ })()
;
