/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 247:
/***/ (() => {

jQuery(function ($) {
  const url = new URL(window.location.href);

  const allowedRoutes = [
    "promo.edit",
    "promo.create",
    "subscribers.lists.emails",
  ];

  const allowedPages = ["promoter-integrations", "promoter-subscribers"];

  const route = url.searchParams.get("route");
  const page = url.searchParams.get("page");

  const isPageAllowed = allowedPages.some((allowedPage) => {
    return page && page.includes(allowedPage);
  });

  const isRouteAllowed = allowedRoutes.some((allowedRoute) => {
    return route && route.includes(allowedRoute);
  });

  if (!isPageAllowed && !isRouteAllowed) {
    return;
  }

  const template = /*html*/ `
    <div class="popover" role="tooltip">
      <h3 class="popover-header"></h3>
      <div class="popover-body"></div>
    </div>
  `;

  const content =
    document.querySelector("#icp-promo-available-in-pro-template")?.innerHTML ||
    "";

  if (!content) {
    return;
  }

  const proPopoverSelectors = [
    `[data-pro=required]:not([data-pro-template])`,
    `[ic-promo-integration-field]`,
  ].join(",");

  $(proPopoverSelectors).not("a").attr("disabled", true);

  let activePopover = null;

  $(document).on(
    "click ic-promo-display-pro-message",
    proPopoverSelectors,
    function (e) {
      const $this = $(this);

      const placement = $this.data("placement") || "top";
      const offset = $this.data("offset") || 0;
      const selfBoundary = $this.data("self-boundary");
      const $content = $(content);
      const text =
        $this.data("pro-text") ||
        $content.find("[data-text]").attr("data-text");

      $content.find("[data-text]").html(text);

      const props = {
        content: $content,
        html: true,
        placement,
        template,
        trigger: "click",
        offset: [0, offset],
      };

      if (selfBoundary) {
        props.container = this;
      }

      $this.popover(props);

      $this.on("shown.bs.popover", function () {
        jQuery(".popover.show").css("z-index", 100000);
      });

      if (activePopover) {
        activePopover.popover("hide");
        $this.popover("enable");
      }

      $this.popover("show");
      activePopover = $(this);
    }
  );

  $(document).on("click", function (e) {
    if (activePopover) {
      // is inside the popover
      if (e.target.closest(".popover")) {
        return;
      }

      // is the popover trigger
      if (e.target.closest(proPopoverSelectors)) {
        return;
      }

      try {
        // activePopover.popover("hide");
        activePopover.popover("dispose");
        activePopover = null;
      } catch (err) {
        //ignore
      }
    }
  });
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ./admin/assets/js/src/snack-bar-alert.js
const SnackBarAlert = (() => {

    const $ = jQuery;
    let snackBar = false;

    const alertMessage = (aMessage, aStatus = null, options) => {
    
        const visibleSnackbar = $('.js-snackbar__wrapper');
        const keepInfo = options?.keepInfo ? options.keepInfo : false;

        if(visibleSnackbar.length > 0 && !keepInfo) {
          snackBar.Close();
        }
        
        snackBar = new SnackBar({
          message: aMessage,
          dismissible: true,
          status: aStatus,
          ...options,
        });
    }

    return {
      alertMessage,
	}
})()
;// CONCATENATED MODULE: ./admin/assets/js/src/email-lists/Lib/ICModal.js
const ICModal = (() => {
  const beforePopupClose = () => {
    cs_promo_settings.windowPopup.status = false;
  };

  const beforePopupShow = (modal) => {
    if (cs_promo_settings.windowPopup.status === false) {
      modal.modal("show");
    }
    cs_promo_settings.windowPopup.status = true;
  };

  const dialog = (title, message, settings) => {
    const {
      primary_button = "Save",
      primary_className = "ic-promo-button ic-promo-button-sm ic-promo-button-primary",
      secondary_button = "Cancel",
      secondary_className = "ic-promo-button ic-promo-button-sm  ic-promo-button-secondary",
      callback = () => {},
      secondary_callback = () => {},
      show = false,
      size = "custom",
      className = "ic-dialog",
      onShow = () => {
        beforePopupClose();
      },
      onEscape = () => {
        beforePopupClose();
      },
      onHide = () => {
        beforePopupClose();
      },
    } = settings;

    const modal = bootbox.dialog({
      title: title,
      message: message,
      onEscape: true,
      centerVertical: true,
      size,
      className,
      onHide,
      onShow,

      buttons: {
        submit: {
          label: primary_button,
          className: primary_className,
          callback: callback,
        },
        cancel: {
          label: secondary_button,
          className: secondary_className,
          callback: secondary_callback,
        },
      },
      show,
    });

    beforePopupShow(modal);

    return modal;
  };

  const confirmationDialog = (title, message, settings) => {
    const {
      primary_button = "Save",
      secondary_button = "Cancel",
      callback = () => {},
      secondary_callback = () => {},
      show = true,
      size = "small",
      className = "ic-dialog",
    } = settings;

    bootbox.dialog({
      title: title,
      message: message,
      onEscape: true,
      centerVertical: true,
      size,
      className,
      show,
      buttons: {
        delete: {
          label: primary_button,
          className: "ic-promo-button ic-promo-button-sm ic-promo-button-primary",
          callback: callback,
        },
        cancel: {
          label: secondary_button,
          className: "ic-promo-button ic-promo-button-sm  ic-promo-button-secondary",
          callback: secondary_callback,
        },
      },
    });

    if (!show) {
      modal.modal("show");
    }

    return modal;
  };

  const indeterminateLoading = (title, message, settings) => {
    const {
      show = true,
      size = "small",
      className = "ic-dialog ic-dialog-loading",
      onShow = () => {},
    } = settings;

    const modal = bootbox.dialog({
      title: title,
      message: `
            <div class="ic-sync-modal-wrapper">
              <div class="progress progress-bar-animated progress-bar-striped"></div>
              <p class="ic-sync-modal-wrapper-message">${message}</p>
            </div>
          `,
      onEscape: false,
      centerVertical: true,
      closeButton: false,
      size,
      className,
      show,
      buttons: {},
      onShow,
    });

    if (!show) {
      modal.modal("show");
    }

    return modal;
  };

  const previewModal = (title, message, settings) => {
    const {
      show = true,
      size = "large",
      className = "ic-dialog-preview",
    } = settings;

    const modal = bootbox.dialog({
      title: title,
      message: message,
      onEscape: true,
      centerVertical: true,
      size,
      className,
      show,
      buttons: {},
    });

    if (!show) {
      modal.modal("show");
    }

    return modal;
  };

  const info = (title, message, callback = () => {}) => {
    bootbox.dialog({
      title,
      message,
      onEscape: true,
      centerVertical: true,
      size: "custom",
      className: "ic-dialog",
      buttons: {
        ok: {
          label: "OK",
          className: "ic-promo-button ic-promo-button-sm ic-promo-button-primary",
          callback: callback,
        },
      },
    });

    return modal;
  };

  return {
    confirmationDialog,
    info,
    dialog,
    previewModal,
    beforePopupClose,
    indeterminateLoading,
  };
})();

;// CONCATENATED MODULE: ./admin/assets/js/src/email-lists/Lib/ICEmailLists.js


const $ = jQuery;
const ajaxURL = cs_promo_settings.ajax_url;

const getProviderLists = (provider) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: ajaxURL,
      data: {
        action: "iconvertpr_email_lists_provider_lists",
        provider: provider,
      },
    })
      .then((response) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const bindProvider = async (
  shadow,
  { provider: initialProvider, list: initialList } = {}
) => {
  const providerEl = shadow.querySelector('select[name="provider"]');
  const providerListEl = shadow.querySelector('select[name="provider_list"]');

  const fillProviderLists = async (provider, select = "") => {
    const $field = $(providerListEl.closest(".icp-field"));

    if (!provider) {
      $field.hide();
      providerListEl.removeAttribute("required");
      return;
    }

    providerListEl.setAttribute("required", "required");

    $field.show();

    $field.removeClass("loaded");

    const lists = await getProviderLists(provider);
    // console.log(lists);

    if (providerListEl) {
      // remove non default options
      const defaultOption = providerListEl.querySelector('option[value=""]');
      providerListEl.innerHTML = "";
      providerListEl.appendChild(defaultOption);
      lists.forEach((list) => {
        const option = document.createElement("option");
        option.value = list.id;
        option.text = list.name;
        providerListEl.appendChild(option);
      });

      providerListEl.value = select;
    }

    $field.addClass("loaded");
  };

  if (providerEl) {
    providerEl.value = initialProvider || "";

    providerEl.addEventListener("change", (event) => {
      fillProviderLists(event.target.value);
    });

    if (providerListEl) {
      await fillProviderLists(providerEl.value, initialList || "");
    }
  }
};

const ICEmailLists = (() => {
  const setup = () => {
    const listElement = document.querySelector("#ic-listid");
    const __nonce = document.querySelector("#_wpnonce")?.value;
    let listID = 0;

    if (listElement) {
      listID = listElement?.value;
    }

    const listItemActive = document.querySelector(".list-item-active");
    if (listItemActive) {
      listItemActive.scrollIntoView();
    }

    deleteList(listID, __nonce);
    createList(__nonce);
    editList(listID, __nonce);
    syncList(listID, __nonce);
  };

  const toggleSubjectField = (elm) => {
    const template = elm.querySelector('select[name="templateID"]');
    const subject = elm.querySelector(".iwpa-subject");

    if (!template) {
      return false;
    }

    if (template.selectedOptions[0].value == 0) {
      subject.style.display = "none";
    }

    template.addEventListener("change", (event) => {
      if (event.target.value == 0) {
        subject.style.display = "none";
      } else {
        subject.style.display = "block";
      }
    });
  };

  const deleteList = (listID, __nonce) => {
    const deleteButton = document.querySelector(".ic-delete-list");

    if (deleteButton) {
      const settings = {
        primary_button: "Delete",
        secondary_button: "Cancel",
        callback: () => {
          removeListFromDB(listID, __nonce);
        },
      };

      deleteButton.addEventListener("click", (e) => {
        e.preventDefault();
        ICModal.dialog(
          "Delete Confirmation",
          "<p>Are you sure you want to delete this email list?</p>",
          settings
        );
      });
    }
  };

  const editList = (listID, __nonce) => {
    const editButton = document.querySelector(".ic-edit-list");

    if (editButton) {
      editButton.addEventListener("click", (e) => {
        e.preventDefault();

        getListFromServer({
          action: "iconvertpr_email_lists_edit",
          post_id: listID,
          _wpnonce: __nonce,
        });
      });
    }
  };

  const syncList = (listID, __nonce) => {
    const syncButton = document.querySelector(".ic-sync-list");

    function callSync() {
      return new Promise((resolve, reject) => {
        $.post(
          cs_promo_settings.ajax_url,
          {
            action: "iconvertpr_email_lists_sync",
            list_id: listID,
            _wpnonce: __nonce,
          },
          (response) => {
            if (response && response.success) {
              resolve(response.data);
            } else {
              reject(response.data);
            }
          }
        );
      });
    }

    const updateModalMessage = (modal, message) => {
      modal.find(".ic-sync-modal-wrapper-message").text(message);
    };

    const rejectCallback = (data, modal) => {
      SnackBarAlert.alertMessage(data || "Unkown error", "error");

      if (modal) {
        const modalObj = modal.data()["bs.modal"];
        modal.modal("hide");
      }
    };

    const callSyncCallback = (data, modal) => {
      if (data.finished) {
        if (modal) {
          const modalObj = modal.data()["bs.modal"];
          modal.modal("hide");
        }
        SnackBarAlert.alertMessage("The list was synced!", "success");
        return;
      }

      if (!data.finished) {
        callSync()
          .then((data) => callSyncCallback(data, modal))
          .catch((data) => rejectCallback(data, modal));
        updateModalMessage(modal, data.message);
      }
    };

    if (syncButton) {
      syncButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if ($(syncButton).is('[data-provider="none"]')) {
          const settings = {
            primary_button: "Edit configuration",
            callback: () => {
              setTimeout(() => {
                getListFromServer({
                  action: "iconvertpr_email_lists_edit",
                  post_id: listID,
                  _wpnonce: __nonce,
                });
              }, 300);
            },
            size: "custom",
          };
          ICModal.dialog(
            "Sync Not Configured",
            "<p>To sync this list with an external service (like Mailchimp), you must first link it to a list from your chosen provider in the configuration.</p>",
            settings
          );

          return;
        }

        ICModal.indeterminateLoading("Sync List", "Syncing list...", {
          size: null,
          onShow: (ev) => {
            const modal = $(ev.delegateTarget);
            callSync()
              .then((data) => callSyncCallback(data, modal))
              .catch((data) => rejectCallback(data, modal));
          },
        });
      });
    }
  };

  const createList = (__nonce) => {
    const createButton = document.querySelector(".ic-create-email-list");
    const html = document.querySelector("#ic-lists-create")?.innerHTML;

    if (createButton) {
      createButton.addEventListener("click", (e) => {
        e.preventDefault();

        const settings = {
          size: "custom",
          primary_button: "Create list",
          secondary_button: "Cancel",
          callback: () => {
            return createListDB(__nonce);
          },
        };

        const shadow = document.createElement("div");

        shadow.insertAdjacentHTML("beforeend", html);
        bindProvider(shadow, {
          provider: "",
          list: "",
        });

        ICModal.dialog("Create new list", shadow, settings);

        toggleSubjectField(document);
      });
    }
  };

  const createListDB = (__nonce) => {
    const name = document.querySelector('input[name="name"]');
    const subject = document.querySelector('input[name="subject"]');
    const description = document.querySelector('textarea[name="description"]');
    const template = document.querySelector('select[name="templateID"]');
    const form = document.querySelector("#ic-create-list-form");

    const provider = document.querySelector('select[name="provider"]');
    const providerList = document.querySelector('select[name="provider_list"]');

    const providerValue = provider?.value;
    const providerListValue = !!providerValue ? providerList?.value : "";

    if (form.checkValidity()) {
      form.querySelectorAll(".is-invalid").forEach((el) => {
        el.classList.remove("is-invalid");
      });

      $.post(
        cs_promo_settings.ajax_url,
        {
          action: "iconvertpr_email_lists_create",
          name: name?.value,
          description: description?.value,
          subject: subject?.value,
          template: template ? template.selectedOptions[0].value : 0,
          provider: providerValue,
          provider_list: providerListValue,
          _wpnonce: __nonce,
        },
        (response) => {
          if (response && response.success) {
            window.location.href = response.data.body;
          } else {
            SnackBarAlert.alertMessage(
              "The email list was not created!",
              "error"
            );
            return false;
          }
        }
      );
    } else {
      form.querySelectorAll("[required]").forEach((el) => {
        if (!el.value) {
          el.classList.add("is-invalid");
        }
      });
      return false;
    }
  };

  const getListFromServer = (settings) => {
    $.ajax({
      type: "GET",
      url: ajaxURL,
      data: settings,
    }).then(async (response) => {
      if (response.success) {
        const html = document.querySelector("#ic-lists-create").innerHTML;
        const shadow = document.createElement("div");

        shadow.insertAdjacentHTML("beforeend", html);

        const name = shadow.querySelector('input[name="name"]');
        const description = shadow.querySelector(
          'textarea[name="description"]'
        );
        const template = shadow.querySelector('select[name="templateID"]');
        const subject = shadow.querySelector('input[name="subject"]');

        if (name) {
          name.value = response.data.body.name;
        }

        if (subject) {
          subject.value = response.data.body.subject;
        }

        if (description) {
          description.value = response.data.body.description;
        }

        if (template) {
          template.value = response.data.body.templateID;
        }

        showEditForm(shadow, settings.post_id, settings._wpnonce);

        bindProvider(shadow, {
          provider: response.data.body.provider || "",
          list: response.data.body.providerList || "",
        });
      }

      return false;
    });
  };

  const showEditForm = (content, id, __nonce) => {
    toggleSubjectField(content);
    const settings = {
      primary_button: "Save",
      secondary_button: "Cancel",
      callback: () => {
        return editListDB(id, __nonce);
      },
      size: "custom",
    };
    ICModal.dialog("Edit list", content, settings);
  };

  const editListDB = (id, __nonce) => {
    const name = document.querySelector('input[name="name"]');
    const subject = document.querySelector('input[name="subject"]');
    const description = document.querySelector('textarea[name="description"]');
    const form = document.querySelector("#ic-create-list-form");
    const template = document.querySelector('select[name="templateID"]');
    const provider = document.querySelector('select[name="provider"]');
    const providerList = document.querySelector('select[name="provider_list"]');

    const providerValue = provider?.value;
    const providerListValue = !!providerValue ? providerList?.value : "";

    if (form.checkValidity()) {
      form.querySelectorAll(".is-invalid").forEach((el) => {
        el.classList.remove("is-invalid");
      });

      $.post(
        ajaxURL,
        {
          action: "iconvertpr_email_lists_update",
          post_id: id,
          name: name.value,
          template: template ? template.selectedOptions[0].value : 0,
          description: description.value,
          subject: subject?.value,
          provider: providerValue,
          provider_list: providerListValue,
          _wpnonce: __nonce,
        },
        (response) => {
          if (response && response.success) {
            window.location.reload();
          } else {
            SnackBarAlert.alertMessage("The list was not updated!", "error");
            return false;
          }
        }
      );
    } else {
      // name.classList.add("is-invalid");
      form.querySelectorAll("[required]").forEach((el) => {
        if (!el.value) {
          el.classList.add("is-invalid");
        }
      });
      return false;
    }
  };

  const removeListFromDB = (listID, __nonce) => {
    $.post(
      cs_promo_settings.ajax_url,
      {
        action: "iconvertpr_email_lists_delete",
        post_id: listID,
        _wpnonce: __nonce,
      },
      (response) => {
        if (response && response.success) {
          window.location.reload();
        } else {
          if (typeof response.data.message !== "undefined") {
            SnackBarAlert.alertMessage(response.data.message, "error");
          } else {
            SnackBarAlert.alertMessage(
              "The email list was not deleted!",
              "error"
            );
          }
        }
      }
    );
  };

  return {
    setup,
  };
})();

;// CONCATENATED MODULE: ./admin/assets/js/src/email-lists/Lib/ICSubscriber.js



const ICSubscriber = (() => {
  const $ = jQuery;
  const ajaxURL = cs_promo_settings.ajax_url;

  const setup = () => {
    const listElement = document.querySelector("#ic-listid");
    const __nonce = document.querySelector("#_wpnonce")?.value;
    let listID = 0;

    if (listElement) {
      listID = listElement?.value;
    }

    deleteSubscriber(listID, __nonce);
    editSubscriber(listID, __nonce);
  };

  const editSubscriber = (listID, __nonce) => {
    const editButtons = document.querySelectorAll(".cs-el-edit");

    if (editButtons) {
      editButtons.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const id = item.dataset.id;

          getSubscriberFromServer({
            action: "iconvertpr_subscribers_edit",
            post_id: id,
            _wpnonce: __nonce,
          });
        });
      });
    }
  };

  const showEditSubscribeForm = (content, id, __nonce) => {
    const settings = {
      primary_button: "Save",
      secondary_button: "Cancel",
      callback: () => {
        return editSubscriberFromDB(id, __nonce);
      },
      size: "custom",
    };
    ICModal.dialog("Edit subscriber", content, settings);
  };

  const editSubscriberFromDB = (id, __nonce) => {
    const name = document.querySelector('input[name="name"]');
    const email = document.querySelector('input[name="email"]');
    const form = document.querySelector("#ic-create-list-form");

    if (form.checkValidity()) {
      email.classList.remove("is-invalid");

      $.post(
        ajaxURL,
        {
          action: "iconvertpr_subscribers_update",
          post_id: id,
          name: name.value,
          email: email.value,
          _wpnonce: __nonce,
        },
        (response) => {
          if (response && response.success) {
            window.location.reload();
          } else {
            SnackBarAlert.alertMessage(
              "The subscriber was not updated!",
              "error"
            );

            return false;
          }
        }
      );
    } else {
      email.classList.add("is-invalid");
      return false;
    }
  };

  const deleteSubscriber = (listID, __nonce) => {
    const deleteButtons = document.querySelectorAll(".cs-el-delete");

    if (deleteButtons) {
      deleteButtons.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const id = item.dataset.id;
          const settings = {
            primary_button: "Remove from this list",
            secondary_button: "Remove from all lists",
            callback: () => {
              const removeFromMarketingProviders = jQuery(
                `[name=remove_from_marketing_providers_lists]`
              ).prop("checked");
              removeFromDB(id, {
                where: "list",
                list_id: listID,
                _wpnonce: __nonce,
                include_marketing_providers: removeFromMarketingProviders,
              });
            },
            secondary_callback: () => {
              const removeFromMarketingProviders = jQuery(
                `[name=remove_from_marketing_providers_lists]`
              ).prop("checked");
              removeFromDB(id, {
                where: "all_lists",
                _wpnonce: __nonce,
                include_marketing_providers: removeFromMarketingProviders,
              });
            },
            size: "custom",
          };

          let removeFromMarketingTemplate =
            cs_promo_settings.has_providers_configured
              ? `<label class="align-items-center d-flex">
                <input type="checkbox" class="mb-0 mt-0" name="remove_from_marketing_providers_lists">
                <span class="flex-grow-1">Also remove from marketing associated provider(s) list(s)</span>
              </label>
            `
              : "";

          ICModal.dialog(
            "Remove email list item",
            `<p>From where do you want to remove the email list item?</p>` +
              removeFromMarketingTemplate,
            settings
          );
        });
      });
    }
  };

  const removeFromDB = (
    id,
    {
      where = "list",
      list_id = 0,
      _wpnonce = "",
      include_marketing_providers = false,
    } = {}
  ) => {
    $.post(
      ajaxURL,
      {
        action: "iconvertpr_subscribers_delete",
        post_id: id,
        list_id: list_id,
        where: where,
        _wpnonce: _wpnonce,
        include_marketing_providers: include_marketing_providers ? 1 : 0,
      },
      (response) => {
        if (response && response.success) {
          window.location.reload();
          return;
        } else {
          SnackBarAlert.alertMessage("The email was not deleted!", "error");
        }
      }
    );
  };

  const getSubscriberFromServer = (settings) => {
    $.ajax({
      type: "GET",
      url: ajaxURL,
      data: settings,
    }).then((response) => {
      if (response.success) {
        showEditSubscribeForm(
          response.data.body,
          settings.post_id,
          settings._wpnonce
        );
      }

      return false;
    });
  };

  return {
    setup,
  };
})();

;// CONCATENATED MODULE: ./admin/assets/js/src/email-lists/Lib/ICGlobal.js


const ICGlobal = (() => {
    const $ = jQuery;  

    const checkFlashMessages = () => {
        const fleshMessagesSelector = $("#ic-flash-messages .cs-flash-messages .cs-flash-message");
        const message = fleshMessagesSelector.html();
        const messageType = fleshMessagesSelector.data('type');

        const amOptions = {
            timeout: ( messageType === 'success' ? 5000 : false )
        }        

        if(fleshMessagesSelector.length > 0) {
            SnackBarAlert.alertMessage(message, messageType, amOptions );
        }
    }

    return {
        checkFlashMessages        
    };
})();
;// CONCATENATED MODULE: ./admin/assets/js/src/email-lists/index.js




document.addEventListener('DOMContentLoaded', () => {
    // console.log('EMAIL LISTS')
    ICEmailLists.setup();
    ICSubscriber.setup();
    ICGlobal.checkFlashMessages();
});
;// CONCATENATED MODULE: ./admin/assets/js/src/utils/index.js
const utils_$  = jQuery;


const updateInputValue = (element,value)=>{
    const $element = utils_$(element);

    switch ($element.attr('type')) {
        case 'checkbox':
            $element.prop('checked', value);
            break;
        case 'radio':
            $element.prop('checked', value);
            break;
        default:
            $element.val(value);
            break;

    }
}

const utils_triggerUIUpdateChange = (element) => {
    const $element = utils_$(element);

    const customChangeEvent = utils_$.Event('change');
    customChangeEvent._isPromoterUIUpdate = true;

    $element.trigger(customChangeEvent);
}

const updateUIValue = (element,value)=>{

    const $element = utils_$(element);

    switch ($element.prop('tagName')?.toLowerCase()) {
        case 'input':
            updateInputValue(element,value);
            break;
        default:
            $element.val(value);
            break;

        }

    utils_triggerUIUpdateChange(element);

}

const eventIsFromUIUpdate = (event) => {
    if (event && event._isPromoterUIUpdate) {
        return true;
    }

    return false;
}
;// CONCATENATED MODULE: ./admin/assets/js/src/promo-popups/cs-promo-popups.js



jQuery(document).ready(function ($) {
  // prevent double click on form submit
  $(".icp-prevent-double-click").on("submit", function (e) {
    $(this).find('button[type="submit"]').attr("disabled", "disabled");
  });
  // set the temnplate
  $(".promo-select-template").on("click", function (e) {
    e.preventDefault();

    const elem = $(this);
    const payload = {
      action: "iconvertpr_promo_set_template",
      template: elem.data("template"),
      popup: elem.data("popup"),
      _wpnonce_set_template: $("#_wpnonce_set_template").val(),
    };

    $.post(cs_promo_settings.ajax_url, payload, (response) => {
      if (response.success) {
        // redirect
        window.location.href = $("#promoEditorUrl").val();
      }
    });
  });

  //activate/deactivate toggle
  $(".cs-switch.cs-toggle-status input").on("change", function (e) {
    const elem = $(this);
    const inputStatus = $(this).is(":checked") ? 1 : 0;
    const payload = {
      action: "iconvertpr_promo_status",
      post_id: $(this).data("id"),
      nonce: $(this).data("nonce"),
      status: inputStatus,
    };

    const checked = elem.is(":checked");
    const bulletStatus = $(this)
      .parent()
      .parent()
      .find('[data-icon="data-icon"]');
    const textStatus = $(this)
      .parent()
      .parent()
      .find('[data-label="data-label"]');

    const onChecked = () => {
      bulletStatus.removeClass("inactive");
      bulletStatus.addClass("active");
      textStatus.text("Active");
      $('[name="save-and-activate-popup"]').attr("hidden", true);
    };

    const onUnchecked = () => {
      bulletStatus.removeClass("active");
      bulletStatus.addClass("inactive");
      textStatus.text("Inactive");
      $('[name="save-and-activate-popup"]').removeAttr("hidden");
    };

    if (eventIsFromUIUpdate(e)) {
      if (checked) {
        onChecked();
      } else {
        onUnchecked();
      }
      return;
    }

    $.post(cs_promo_settings.ajax_url, payload, (response) => {
      if (!response.success) {
        elem.prop("checked", !checked);
      }
      if (response.success && checked) {
        onChecked();
      }
      if (response.success && !checked) {
        onUnchecked();
      }
    });
  });

  const countriesOptions = Object.keys(cs_promo_autocomplete.countries).map(
    (countryKey) => ({
      text: cs_promo_autocomplete.countries[countryKey],
      id: countryKey,
    })
  );

  // element selectors
  const generalTypeElement = $('select[name="select_type_promo"]');
  const selectCountriesElem = $('select[name="countries-autocomplete"]');
  const selectLocationService = $('select[name="location-service"]');

  const selectCitiesElem = $('select[name="cities-autocomplete"]');
  const prodSelectorElem = $('select[name="product_in_cart"]');
  const prodNotInCartSelectorElem = $('select[name="product_not_in_cart"]');
  const arrivingFromSourceElem = $(
    'select[name="select_arriving_from_source"]'
  );
  const scrollToElem = $('select[name="select_scroll_to_element"]');
  const containerValidationElem = $(".container-validation");

  const selectCitiesDropdown = selectCitiesElem.select2({
    data: {},
    width: "100%",
  });

  selectLocationService.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });

  if (selectCountriesElem && selectCountriesElem.length) {
    selectCountriesElem.select2({
      data: countriesOptions,
      width: "100%",
      // minimumResultsForSearch: Infinity,
    });
    const countriesSelected =
      selectCountriesElem.data("selected") &&
      selectCountriesElem.data("selected").split(",");
    selectCountriesElem.val(countriesSelected).trigger("change");

    selectCountriesElem.on("select2:open", function (e) {
      const select2Dropdown = jQuery(this).data()["select2"].$dropdown;
      setTimeout(() => {
        select2Dropdown.find("input[type='search']").focus();
      }, 100);
    });

    updateCitiesList(selectCountriesElem);

    if (selectCitiesElem && selectCitiesElem.length) {
      const citiesSelected =
        selectCitiesElem.data("selected") &&
        selectCitiesElem.data("selected").split(",");
      selectCitiesElem.val(citiesSelected).trigger("change");
    }

    selectCountriesElem.change(() => {
      updateCitiesList(selectCountriesElem);
    });
  }

  function updateCitiesList(selectCountriesElem) {
    const selectedCountry = selectCountriesElem.select2("data");
    if (selectedCountry[0].id) {
      const citiesList =
        cs_promo_autocomplete.cities[selectedCountry[0].id] || {};

      if (citiesList) {
        selectCitiesDropdown.val("").empty();

        Object.keys(citiesList).forEach((cityKey) => {
          const newOption = new Option(
            citiesList[cityKey],
            cityKey,
            false,
            false
          );
          // Append it to the select
          selectCitiesDropdown.append(newOption).trigger("change");
        });

        selectCitiesDropdown.attr("disabled", false);
      }
    } else {
      selectCitiesDropdown.attr("disabled", true);
      selectCitiesDropdown.val("").empty();
    }
  }

  if (prodSelectorElem.length) {
    prodSelectorElem.select2({
      ajax: {
        url: cs_promo_settings.ajax_url,
        data: function (params) {
          {
            return {
              search: params.term,
              action: "iconvertpr_products_search",
              _wpnonce_iconvertpr_product_search: $(
                'input[name="_wpnonce_iconvertpr_product_search"]'
              ).val(),
            };
          }
        },
        processResults: function (data) {
          // Transforms the top-level key of the response object from 'items' to 'results'
          const results = data.data.posts.map((post) => ({
            text: post.post_title,
            id: post.ID,
          }));

          return {
            results: results,
          };
        },
      },
      width: "100%",
    });

    $.ajax({
      type: "GET",
      url: cs_promo_settings.ajax_url,
      data: {
        action: "iconvertpr_products_search",
        _wpnonce_iconvertpr_product_search: $(
          'input[name="_wpnonce_iconvertpr_product_search"]'
        ).val(),
        ids: prodSelectorElem.data("selected") || 0,
      },
    }).then(function (data) {
      data.data.posts.forEach((post) => {
        const option = new Option(post.post_title, post.ID, true, true);
        prodSelectorElem.append(option).trigger("change");
      });

      triggerUIUpdateChange(prodSelectorElem);

      // manually trigger the `select2:select` event
      prodSelectorElem.trigger({
        type: "select2:select",
        params: {
          data: data,
        },
      });
    });
  }
  // end autocomplete products in cart

  // autocomplete products not in cart
  if (prodNotInCartSelectorElem.length) {
    prodNotInCartSelectorElem.select2({
      ajax: {
        url: cs_promo_settings.ajax_url,
        data: function (params) {
          {
            return {
              search: params.term,
              action: "iconvertpr_products_search",
              _wpnonce_iconvertpr_product_search: $(
                'input[name="_wpnonce_iconvertpr_product_search"]'
              ).val(),
            };
          }
        },
        processResults: function (data) {
          // Transforms the top-level key of the response object from 'items' to 'results'
          const results = data.data.posts.map((post) => ({
            text: post.post_title,
            id: post.ID,
          }));

          return {
            results: results,
          };
        },
      },
      width: "100%",
    });
    $.ajax({
      type: "GET",
      url: cs_promo_settings.ajax_url,
      data: {
        action: "iconvertpr_products_search",
        _wpnonce_iconvertpr_product_search: $(
          'input[name="_wpnonce_iconvertpr_product_search"]'
        ).val(),
        ids: prodNotInCartSelectorElem.data("selected") || 0,
      },
    }).then(function (data) {
      data.data.posts.forEach((post) => {
        const option = new Option(post.post_title, post.ID, true, true);
        prodNotInCartSelectorElem.append(option).trigger("change");
      });

      triggerUIUpdateChange(prodNotInCartSelectorElem);

      // manually trigger the `select2:select` event
      prodNotInCartSelectorElem.trigger({
        type: "select2:select",
        params: {
          data: data,
        },
      });
    });
  }
  // end autocomplete products not in cart

  generalTypeElement.select2({
    width: "100%",
  }); // here

  generalTypeElement.on("select2:select", function (e) {
    if (e.params.data.id === "inline-promotion-bar") {
      $('[data-section="triggers"]').hide("slow");
    } else {
      $('[data-section="triggers"]').show("slow");
    }
  });

  $('[name="copy-shortcode"]').on("click", function (e) {
    e.preventDefault();
    const $temp = $("<input>");
    $("body").append($temp);
    $temp.val($('[name="shortcode"]').val()).select();
    $('[name="shortcode"]').focus();
    $('[name="shortcode"]').select();

    document.execCommand("copy");
    $temp.remove();
    new SnackBar({
      message: "The shortcode was copied to your clipboard.",
      dismissible: true,
      status: "success",
    });
  });

  function showReferrerInputValue() {
    $(".box-referrer-value").css("display", "block");

    $(".box-referrer-value")
      .find('input[name="referrer_value"]')
      .removeAttr("disabled", true)
      .removeAttr("data-relation-disabled", true);
  }

  function hideReferrerInputValue() {
    $(".box-referrer-value").css("display", "none");

    $(".box-referrer-value")
      .find('input[name="referrer_value"]')
      .attr("data-relation-disabled", true)
      .attr("disabled", true);
  }

  if (arrivingFromSourceElem.val() === "referrer") {
    showReferrerInputValue();
  } else {
    hideReferrerInputValue();
  }

  arrivingFromSourceElem.on("change", function (e) {
    if ($(this).val() === "referrer") {
      showReferrerInputValue();
    } else {
      hideReferrerInputValue();
    }
  });

  arrivingFromSourceElem.select2({
    width: "100%",
  });

  scrollToElem.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });

  $('button[name="create-popup"]').on("click", function (e) {
    e.preventDefault();

    containerValidationElem.addClass("d-none");
    if (!formValidation()) {
      SnackBarAlert.alertMessage("Form invalid!", "error");
      containerValidationElem.removeClass("d-none");

      return;
    }
    const payload = getPayload();
    $.post(
      cs_promo_settings.ajax_url,
      {
        action: "iconvertpr_create_popup",
        payload: payload,
        _wpnonce: $('input[name="_wpnonce"]').val(),
      },
      (response) => {
        if (response.success) {
          SnackBarAlert.alertMessage(response.data.message, "success");

          const url = new URL(window.location.href);
          url.search = url.search
            .replace("settings.popup", "settings.popup.edit")
            .concat("&post_id=", response.data.post);
          window.location.href = url.toString();

          return;
        }
        SnackBarAlert.alertMessage(response.data, "error");
      }
    );
  });
});

;// CONCATENATED MODULE: ./admin/assets/js/src/promo-popups/pickers-script.js



jQuery(function ($) {
  let deviceIsMobile = window.innerWidth < 1024;
  if (deviceIsMobile) {
    $('[data-col-type="customize"] a').addClass("disabled");
  }
  const elemStart = $('[name="when-start"]');
  const elemEnd = $('[name="when-end"]');

  elemStart
    .closest(".input-group.group-append")
    .find("i")
    .on("click", () => {
      elemStart.datetimepicker("show");
    });
    
  elemEnd
    .closest(".input-group.group-append")
    .find("i")
    .on("click", () => {
      elemEnd.datetimepicker("show");
    });

  const timerOptions ={
    defaultTime: '00:00',
    minDate: [
      (new Date()).getFullYear(),
      (new Date()).getMonth() + 1,
      (new Date()).getDate(),
    ].join('/'),
    minYear: (new Date()).getFullYear(),
  }

  elemStart.datetimepicker({
    ...timerOptions,
    onShow: function (ct) {
      this.setOptions({
        maxDate: elemEnd.val() ? elemEnd.val() : false,
      });
    },
    format: "Y-m-d H:i",
  });

  elemEnd.datetimepicker({
    ...timerOptions,
    onShow: function (ct) {
      this.setOptions({
        minDate: elemStart.val() ? elemStart.val() : false,
      });
    },
    format: "Y-m-d H:i",
  });

  elemStart.on("keypress", function (e) {
    e.preventDefault();
  });

  elemEnd.on("keypress", function (e) {
    e.preventDefault();
  });

  $('a[data-scope="confirm-dialog"]').on("click", function (e) {
    const actionBtn = $(this);
    const confirmMessage = actionBtn.data("confirm-message");
    e.preventDefault();

    const postId = actionBtn.data("post-id");
    const wpNonce = actionBtn.data("wpnonce");
    const title = actionBtn.attr("title");
    const type = actionBtn.data("type");

    let action = "";
    let primaryButton = title;
    let confirmTitle = `${title} campaign`;
    let promoType = actionBtn.data("promo-type");

    let postParams = {
      action: action,
      post_id: postId,
      _wpnonce: wpNonce,
    };

    let settingExtraParams = {};

    switch (type) {
      case "delete":
        postParams.action = "iconvertpr_delete_campaign";
        break;
      case "duplicate":
        postParams.action = "iconvertpr_duplicate_campaign";
        settingExtraParams.className = "ic-dialog js-duplicate-dialog";
        break;
      case "reset-stats":
        postParams.action = "iconvertpr_reset_stats_campaign";
        break;
      default:
        break;
    }

    const settings = {
      primary_button: primaryButton,
      secondary_button: "Cancel",
      ...settingExtraParams,
      callback: () => {
        if (title === "Duplicate") {
          const campaignName = $('input[name="duplicate-campaign-name"]').val();
          postParams.campaign_name = campaignName;
          if ($('select[name="duplicate-as"]').length) {
            postParams.duplicate_as = $('select[name="duplicate-as"]').val();
          }
        }

        $.post(cs_promo_settings.ajax_url, postParams, (response) => {
          if (response.success) {
            SnackBarAlert.alertMessage(response.data.message, "success");
            window.location.href = response.data.url_redirect;
            return;
          }
          SnackBarAlert.alertMessage(response.data, "error");
        });
      },
      onShow: () => {
        ICModal.beforePopupClose();
        $(".js-duplicate-dialog .button-primary").attr("disabled", true);
        $(".js-duplicate-dialog [name='duplicate-as']").val(promoType || "");
      },
    };

    ICModal.dialog(confirmTitle, confirmMessage, settings);
  });

  const toggleDuplicateBtn = (e) => {
    const elem = e.currentTarget;
    const duplicateBtn = $(elem)
      .parents(".js-duplicate-dialog")
      .find(".button-primary");

    if (elem.value !== "") {
      duplicateBtn.attr("disabled", false);
    } else {
      duplicateBtn.attr("disabled", true);
    }
  };

  $(document).on(
    "keyup",
    '.js-duplicate-dialog input[name="duplicate-campaign-name"]',
    toggleDuplicateBtn
  );
  $(document).on(
    "keypress",
    '.js-duplicate-dialog input[name="duplicate-campaign-name"]',
    function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const elem = e.currentTarget;
        const duplicateBtn = $(elem)
          .parents(".js-duplicate-dialog")
          .find(".button-primary");
        duplicateBtn.click();
      }
    }
  );

  $(".cs-list-popup-switch .cs-active-slider").on("click", function (e) {
    const elem = $(this);
    if (elem.parent().find("input").prop("disabled")) {
      e.preventDefault();
      elem.tooltip({
        title: elem.parent().data("no-content"),
      });
      elem.tooltip("show");
    }
  });
  $('[data-col-type="customize"] a').on("click", function (e) {
    if (deviceIsMobile) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
});

;// CONCATENATED MODULE: ./admin/assets/js/src/promo-popups/ICPromoTypesSettings.js



const ICPromoTypesSettings = (() => {
  const $ = jQuery;
  const maybeParseJSON = (str) => {
    try {
      const parsed = JSON.parse(str);

      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch (e) {}

    return false;
  };

  let positionManuallyChanged = false;
  let animationsManuallyChanged = false;

  const setOptionsVisible = (_input) => {
    const settings = _input.data("settings");
    $(".promo-type-options .pto-position-wrapper").removeClass(
      "pto-position-selected"
    );
    $(
      ".promo-type-options .pto-position-wrapper." + settings.position
    ).addClass("pto-position-selected");

    $("input[name='toggle-options-position-tb']").on("change", (event) => {
      const _selected = $(".pto-position-selected")
        .find('input[name="toggle-options-position-tb"]:checked')
        .val();
      if (_selected === "end") {
        $(".icp-toggle-options-content").hide();
      } else {
        $(".icp-toggle-options-content").show();
      }

      if (!eventIsFromUIUpdate(event)) {
        setAnimations();
        positionManuallyChanged = true;
      }

    });

    $("input[name='toggle-options-content']").on("change", (event) => {
      if (!eventIsFromUIUpdate(event)) {
        positionManuallyChanged = true;
      }
    });

    $('select[name="toggle-options-position"]').on("change", (event) => {
      if (!eventIsFromUIUpdate(event)) {
        positionManuallyChanged = true;
      }

      setAnimations();
    });

    $('select[name="toggle-options-position"]').select2();

    $(".pto-animation-wrapper").show();

    const animateInSelect = $("[name='toggle-options-animation-in']");
    const animateOutSelect = $("[name='toggle-options-animation-out']");

    animateInSelect.add(animateOutSelect).on("change", (event) => {
      if (eventIsFromUIUpdate(event)) {
        return;
      }

      animationsManuallyChanged = true;
    });

    animateInSelect.select2();
    animateOutSelect.select2();

    setTimeout(() => {
      if (settings.animationIn) {
        updateUIValue(animateInSelect, settings.animationIn);
      }

      if (settings.animationOut) {
        updateUIValue(animateOutSelect, settings.animationOut);
      }
    });
  };

  const computeAnimationsValues = (
    promoType,
    position,
    effectsSides = null
  ) => {
    let effect = "effectFading";
    let animation = "fade";

    if (!effectsSides) {
      effectsSides = {
        in: "In",
        out: "Out",
      };
    }

    switch (promoType) {
      case "slidein-popup":
        effect = "effectSliding";
        animation = "slide";

        if (position === "center#center") {
          effectsSides = {
            in: "InRight",
            out: "OutRight",
          };
        }

        break;
      case "floating-bar":
        animation = "fade";

        if (position === "start") {
          effectsSides = {
            in: "InDown",
            out: "OutUp",
          };
        } else {
          effectsSides = {
            in: "InUp",
            out: "OutDown",
          };
        }
        break;
    }

    let animationIn = effect + "#" + animation + effectsSides.in;
    let animationOut = effect + "#" + animation + effectsSides.out;

    if (promoType === "inline-promotion-bar") {
      animationIn = "";
    }

    return {
      animationIn,
      animationOut,
    };
  };

  const setAnimations = (templateSettings) => {
    if (animationsManuallyChanged) {
      return;
    }

    let { effectsSides, position, promoType } = buildPromoTypeSettings();

    let { animationIn, animationOut } = computeAnimationsValues(
      promoType,
      position,
      effectsSides
    );

    if (templateSettings) {
      animationIn = templateSettings?.showEffect || animationIn;
      animationOut = templateSettings?.hideEffect || animationOut;
    }

    $(".animations-in-options").hide();
    $(".animations-out-options").hide();

    switch (promoType) {
      case "inline-promotion-bar":
        $(".animations-out-options").show();
        break;
      default:
        $(".animations-in-options").show();
        $(".animations-out-options").show();
        break;
    }

    updateUIValue($("[name='toggle-options-animation-in']"), animationIn);
    updateUIValue($("[name='toggle-options-animation-out']"), animationOut);
  };

  const setDefaultSettings = (settings) => {
    if (typeof settings === "undefined") {
      settings = false;
    }
    getPromoTypeSettings(settings, true);
  };

  const buildPromoTypeSettings = (
    templateSettings = false,
    categoryDefaults = false
  ) => {
    const selected = $(".pto-position-selected");
    let settings = {};

    const promoType = $(
      '.wrapper-types .active input[name="promo-type"],#promo-edit-form [name="promo-type"][data-settings]'
    );
    settings.promoType = promoType.val();

    if (selected.hasClass("position-matrix")) {
      const position = selected
        .find('select[name="toggle-options-position"]')
        .val();
      settings.position = position;
    }

    if (selected.hasClass("settings-floating-bar")) {
      const position = selected
        .find('input[name="toggle-options-position-tb"]:checked')
        .val();
      settings.position = position;

      const contentPosition = selected
        .find('input[name="toggle-options-content"]:checked')
        .val();
      settings.contentPosition = contentPosition;
    }

    // get effects sides
    const { effectsSides = null } =
      selected
        .find('select[name="toggle-options-position"]')
        .find(`[value="${settings.position}"`)
        .data() || {};

    settings.effectsSides = effectsSides;

    if (templateSettings !== false) {
      if (selected.hasClass("position-matrix")) {
        settings.position = positionMatrix(settings.position, templateSettings);
      }

      if (selected.hasClass("settings-floating-bar")) {
        settings.position = getTemplateSetting(
          "align",
          templateSettings,
          settings.position
        );
        settings.contentPosition = getTemplateSetting(
          "contentPosition",
          templateSettings,
          settings.contentPosition
        );
      }
    } else if (categoryDefaults !== false) {
      // set category defaults
      const category = $('input[name="promo-type"]:checked');

      if (category.length) {
        const categorySettings = category.data("settings");

        if (selected.hasClass("position-matrix")) {
          settings.position = positionMatrix(
            categorySettings.defaultPosition,
            {}
          );
        }

        if (selected.hasClass("settings-floating-bar")) {
          settings.position = categorySettings.defaultPosition;
          settings.contentPosition = categorySettings.contentPosition;
        }
      }
    }

    settings.animationIn = $(
      'select[name="toggle-options-animation-in"]'
    ).val();

    settings.animationOut = $(
      'select[name="toggle-options-animation-out"]'
    ).val();

    if ($('input[name="options-animation-duration"]').length) {
      settings.animationDuration = $(
        'input[name="options-animation-duration"]'
      ).val();
    }

    if (templateSettings.useAppropriateAnimations) {
      const { effectsSides = null } =
        selected
          .find('select[name="toggle-options-position"]')
          .find(`[value="${settings.position}"`)
          .data() || {};

      const { animationIn, animationOut } = computeAnimationsValues(
        promoType,
        settings.position,
        effectsSides
      );
      settings.animationIn = animationIn;
      settings.animationOut = animationOut;
    }

    if (templateSettings) {
      settings.animationIn =
        templateSettings.showEffect || settings.animationIn;
      settings.animationOut =
        templateSettings.hideEffect || settings.animationOut;
    }

    return settings;
  };

  const getPromoTypeSettings = (
    templateSettings = false,
    categoryDefaults = false
  ) => {
    const settings = buildPromoTypeSettings(templateSettings, categoryDefaults);
    const selected = $(".pto-position-selected");

    if (!positionManuallyChanged) {
      setSelectedOptions(settings, selected);
    }

    if (!animationsManuallyChanged) {
      setAnimations(templateSettings);
    }

    return settings;
  };

  const setSelectedOptions = (settings, selected) => {
    if (selected.hasClass("position-matrix")) {
      updateUIValue(
        selected.find("select[name='toggle-options-position']"),
        settings.position
      );
    }

    if (selected.hasClass("settings-floating-bar")) {
      updateUIValue(
        selected.find(
          `input[name="toggle-options-position-tb"][value="${settings.position}"]`
        ),
        settings.position
      );

      updateUIValue(
        selected.find(
          `input[name="toggle-options-content"][value="${settings.contentPosition}"]`
        ),
        settings.contentPosition
      );
    }
  };

  const getTemplateSetting = (setting, templateSettings, defaultValue) => {
    let result = defaultValue;

    if (Object.hasOwn(templateSettings, setting)) {
      result = templateSettings[setting];
    }

    return result;
  };

  const positionMatrix = (position, templateSettings) => {
    const alignSettings = (position || "center#center").split("#");

    const align = getTemplateSetting(
      "align",
      templateSettings,
      alignSettings[0]
    );
    const alignH = getTemplateSetting(
      "alignH",
      templateSettings,
      alignSettings[1]
    );

    return `${align}#${alignH}`;
  };

  const showPreviewTemplate = (
    previewURL,
    previewID,
    templateSettings,
    label
  ) => {
    const image = encodeURIComponent(previewURL);

    templateSettings = $.extend({}, templateSettings);

    if (positionManuallyChanged) {
      delete templateSettings["align"];
      delete templateSettings["alignH"];
      delete templateSettings["contentPosition"];
    }

    if (positionManuallyChanged) {
      delete templateSettings["showEffect"];
      delete templateSettings["hideEffect"];
    }

    if (positionManuallyChanged && !animationsManuallyChanged) {
      templateSettings["useAppropriateAnimations"] = true;
    }

    if(animationsManuallyChanged){
      delete templateSettings["useAppropriateAnimations"];
      delete templateSettings["showEffect"];
      delete templateSettings["hideEffect"];
    }

    const settings = buildPromoTypeSettings(templateSettings);

    let preview = new URL($("#icp-preview-url").val());

    Object.keys(settings).forEach((param) => {
      preview.searchParams.append(param, settings[param]);
    });

    preview.searchParams.append("template_id", previewID);
    preview.searchParams.append("image", image);
    preview.searchParams.append("promoType", settings.promoType);

    if (window.innerWidth > 1024) {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("src", preview.href);
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.opacity = "0";

      const container = document.createElement("div");
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.overflow = "hidden";
      container.appendChild(iframe);

      const loader = document.createElement("div");
      loader.className = "icp-preview-loader";
      loader.innerHTML = `<div class="d-flex flex-wrap align-content-start templates"><div class="d-flex justify-content-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div></div>`;

      container.appendChild(loader);
      iframe.onload = () => {
        container.removeChild(loader);
        iframe.style.opacity = "1";
      };

      const modalSettings = {
        size: "large",
        primary_button: "x",
        secondary_button: "Cancel",
        callback: () => {},
      };

      ICModal.previewModal(
        label ? `Previewing - ${label}` : "Preview",
        container,
        modalSettings
      );
    } else {
      window.open(preview.href, "_blank").focus();
    }
  };
  return {
    setOptionsVisible,
    getPromoTypeSettings,
    showPreviewTemplate,
    maybeParseJSON,
    setDefaultSettings,
    buildPromoTypeSettings,
  };
})();

;// CONCATENATED MODULE: ./admin/assets/js/src/promo-popups/promo-create.js



jQuery(document).ready(function ($) {
  const bodyElem = $("body");

  function markProButtonAsRequiresPro(e = false) {
    let isForPro = false;
    if (e === false) {
      isForPro = true;
    } else {
      isForPro =
        $(e.currentTarget).find(".template-name").data("pro") === "required";
    }
    const _button = $(".button-create-campaign");
    if (isForPro) {
      _button.attr("data-pro", "required");
      _button.attr(
        "data-pro-text",
        "The selected template is only available in PRO."
      );
    } else {
      _button.removeAttr("data-pro");
      _button.removeAttr("data-pro-text");
      _button.popover("dispose");
    }
  }

  function activateCreateCampaignButton() {
    const _button = $(".button-create-campaign");
    _button.attr("disabled", false);
  }

  bodyElem.on("click", ".wrapper-templates .templates .box-item .item", (e) => {
    markProButtonAsRequiresPro(e);
  });

  $(".wrapper-types label.item").on("click", function (e) {
    e.preventDefault();
    activateCreateCampaignButton();
    $(".wrapper-types label.item").removeClass("active");
    $(this).addClass("active");
    const promoTypeInput = $(this).find('input[name="promo-type"]');
    const templatesNode = $(".wrapper-templates .templates");
    const templatesCategoriesNode = $(".templates-categories-list");
    const promoTypeVal = promoTypeInput.val();
    promoTypeInput.prop("checked", "checked");
    templatesNode.html(null);
    templatesNode.append(spinnerNode());
    templatesCategoriesNode
      .closest(".template-categories")
      .addClass("in-progress");

    $(".promo-type-preview img").attr("src", $(this).data("preview-img"));
    $(".promo-type-preview img").attr("alt", $(this).find(".title").text());

    $(document).on("click", ".templates-categories button", function () {
      const $btn = $(this);
      const category = $btn.data("category");

      $btn
        .removeClass("ic-promo-button-secondary")
        .addClass("ic-promo-button-primary active");
      $btn
        .siblings(".ic-promo-button")
        .removeClass("ic-promo-button-primary active")
        .addClass("ic-promo-button-secondary");

      const items = templatesNode.find(".box-item");
      let itemsToDisplay = items;

      if (category !== "*") {
        itemsToDisplay = items.filter(`[data-category*="${category}"]`);
      }

      itemsToDisplay = itemsToDisplay.add(items.filter("[data-is-blank]"));

      items.not(itemsToDisplay).hide();
      let animationCompleteRun = false;
      itemsToDisplay.fadeIn({
        duration: 200,
        complete: function () {
          if (animationCompleteRun) {
            return;
          }

          animationCompleteRun = true;

          itemsToDisplay.first().find(".item ").click();
        },
      });
    });

    // change the promo name to accomodate the promo type if the user has not typed anything
    const promoName = $('input[name="promo-name"]');
    if (!promoName.attr("data-user-typed")) {
      const labelPrefix = $(this).find(".title").text();
      const date = new Date().toLocaleString();

      promoName.val(labelPrefix + " - " + date);
    }

    $.post(
      cs_promo_settings.ajax_url,
      {
        action: "iconvertpr_promo_get_template_by_type",
        promo_type: promoTypeVal,
        _wpnonce_get_template: $('input[name="_wpnonce_get_template"]').val(),
      },
      (response) => {
        templatesNode.html(null);

        if (response.success) {
          let _selected = false;
          let _first = 0;

          const previousCat =
            templatesCategoriesNode
              .find("button.ic-promo-button-primary.active")
              .data("category") || "*";

          const { categories, templates } = response.data;

          renderCategories(templatesCategoriesNode, categories);

          templates.forEach((item) => {
            if (_first == 0 && parseInt(item.is_blank) == 0) {
              _selected = true;
              _first = parseInt(item.id);
            } else {
              _selected = false;
            }

            if (_selected) {
              ICPromoTypesSettings.setOptionsVisible(promoTypeInput);
              ICPromoTypesSettings.setDefaultSettings(
                promoTypeInput.data.settings
              );
              selectTemplateItem(promoTypeInput);

              if (item.is_pro === "1") {
                markProButtonAsRequiresPro();
              }
            }

            templatesNode.append(createTemplateItemNode(item, _selected));
          });

          const hasPrevCategory =
            templatesCategoriesNode.find(
              `button[data-category="${previousCat}"]`
            ).length > 0;

          if (!hasPrevCategory) {
            templatesCategoriesNode
              .find("button[data-category='*']")
              .trigger("click");
          } else {
            templatesCategoriesNode
              .find(`button[data-category="${previousCat}"]`)
              .trigger("click");
          }
        }
      }
    );
  });

  $(document).on("keydown", 'input[name="promo-name"]', function () {
    $(this).removeClass("validation-fail");
    activateCreateCampaignButton();
    $(this).attr("data-user-typed", "true");
  });

  bodyElem.on("click", 'button[name="promo-create"]', function (e) {
    const _button = $(this);
    const isPRO = _button.attr("data-pro") === "required";

    if (isPRO) {
      return;
    }

    e.preventDefault();

    _button.attr("disabled", "disabled");
    const promoName = $('input[name="promo-name"]');
    const promoType = $('input[name="promo-type"]:checked');
    const promoTemplate = $(
      '.item.selected input[name="template-selected"]'
    ).val();
    const promoTemplateIsPro = $(".item.selected .template-name").data("pro");

    const isEmpty = (fieldVal) => {
      return fieldVal.length === 0 || !fieldVal.trim().length;
    };

    if (isEmpty(promoName.val())) {
      promoName.addClass("validation-fail");
      setTimeout(function () {
        promoName.removeClass("validation-fail");
      }, 5000);
      SnackBarAlert.alertMessage("Campaign Name is required.", "error", {
        timeout: false,
      });
      promoName.focus();
      return;
    }
    if (promoTemplate === undefined) {
      _button.removeAttr("disabled");
      return;
    } else {
      _button.html(_button.data("loading"));
    }
    const payload = getPayloadCreate(
      promoName.val(),
      promoType.val(),
      promoTemplate
    );

    const promoSettings = ICPromoTypesSettings.getPromoTypeSettings();

    $.post(
      cs_promo_settings.ajax_url,
      {
        action: "iconvertpr_create_popup",
        payload,
        promoSettings,
        _wpnonce: $('input[name="_wpnonce"]').val(),
      },
      (response) => {
        if (response && response.success) {
          SnackBarAlert.alertMessage(response.data.message, "success");
          window.location.href = response.data.url_redirect;
        } else {
          SnackBarAlert.alertMessage(response.data, "error");
          _button.removeAttr("disabled");
        }
      }
    );
  });

  $('input[name="promo-type"][value="simple-popup"]')
    .closest(".item")
    .trigger("click");

  bodyElem.on("click", ".button-preview-template", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const _elem = $(this);
    const position = _elem.data("position-preview");

    ICPromoTypesSettings.showPreviewTemplate(
      _elem.data("template-preview"),
      _elem.data("template-id"),
      {
        ...position,
      },
      $(this).closest("[data-settings]").find(".wrapper-template-title").text()
    );
  });

  const selectTemplateItem = (item) => {
    item.closest(".templates").find(".item").removeClass("selected");

    // if (item.closest("[data-pro-template]").length > 0) {
    //   return;
    // }
    const settings = item.data("settings");
    ICPromoTypesSettings.setDefaultSettings(settings);

    item.addClass("selected");
  };

  bodyElem.on(
    "click",
    ".wrapper-templates .templates .box-item .item",
    function () {
      selectTemplateItem($(this));
    }
  );

  function createTemplateItemNode(item, _selected = false) {
    const { id, name, image: preview, is_pro, is_blank, settings } = item;
    const templateSettings = ICPromoTypesSettings.maybeParseJSON(item.settings);

    const wrapperItem = document.createElement("div");
    wrapperItem.classList.add(
      "col-xl-4",
      "col-lg-6",
      "col-md-12",
      "col-sm-12",
      "col-xs-12",
      "box-item"
    );

    const itemTemplateNode = document.createElement("div");
    itemTemplateNode.classList.add("item", "d-flex", "flex-column");

    if (_selected) {
      itemTemplateNode.classList.add("selected");

      if (templateSettings !== false) {
        ICPromoTypesSettings.setDefaultSettings(templateSettings);
      }
    }

    if (templateSettings !== false) {
      itemTemplateNode.setAttribute("data-settings", item.settings);
    }

    const spanWrapperTemplateTitle = document.createElement("div");
    spanWrapperTemplateTitle.classList.add(
      "d-flex",
      "flex-row",
      "justify-content-between",
      "align-content-center",
      "wrapper-template-title"
    );

    const spanNameNode = document.createElement("div");
    spanNameNode.classList.add("template-name");
    spanNameNode.innerHTML = name;
    if (is_pro == 1 && $(`[data-template-list-is-pro-preview]`).length > 0) {
      spanNameNode.setAttribute("data-pro", "required");
      wrapperItem.setAttribute("data-pro-template", true);
      wrapperItem.setAttribute("data-placement", "bottom");
      wrapperItem.setAttribute("data-self-boundary", true);
      wrapperItem.setAttribute("data-offset", "0px, -50%r - 100%p");
    }

    spanWrapperTemplateTitle.appendChild(spanNameNode);

    const divWrapperImg = document.createElement("div");
    divWrapperImg.classList.add(
      "d-flex",
      "align-items-center",
      "justify-content-center",
      "wrapper-img"
    );

    const imgPreviewNode = document.createElement("img");
    imgPreviewNode.classList.add("template-preview");
    imgPreviewNode.alt = "Image " + name;
    imgPreviewNode.src = preview;

    divWrapperImg.appendChild(imgPreviewNode);

    itemTemplateNode.appendChild(spanWrapperTemplateTitle);
    itemTemplateNode.appendChild(divWrapperImg);
    const inputHidden = document.createElement("input");
    inputHidden.type = "hidden";
    inputHidden.name = "template-selected";
    inputHidden.value = id;

    if (is_blank == 0) {
      const divWrapperActions = document.createElement("div");
      divWrapperActions.classList.add(
        "d-flex",
        "justify-content-end",
        "wrapper-actions"
      );

      const buttonPreview = document.createElement("div");
      buttonPreview.classList.add(
        "button",
        "button-secondary",
        "button-preview-template"
      );
      buttonPreview.setAttribute("data-template-preview", preview);
      buttonPreview.setAttribute("data-template-id", id);
      buttonPreview.setAttribute("data-position-preview", settings);
      buttonPreview.name = "promo-preview";
      buttonPreview.innerHTML = '<i class="bi bi-eye-fill"></i>';

      divWrapperActions.appendChild(buttonPreview);
      itemTemplateNode.appendChild(divWrapperActions);
    }

    itemTemplateNode.appendChild(inputHidden);
    wrapperItem.appendChild(itemTemplateNode);

    wrapperItem.setAttribute("data-category", item?.categories || "*");
    if (is_blank == 1) {
      wrapperItem.setAttribute("data-is-blank", true);
    }
    return wrapperItem;
  }

  function createTemplateCategoryNode(category) {
    const { slug, label } = category;

    const buttonCategory = document.createElement("button");
    buttonCategory.classList.add(
      "ic-promo-button",
      "ic-promo-button-secondary",
      "ic-promo-button-sm"
    );

    buttonCategory.setAttribute("data-category", slug);
    buttonCategory.innerHTML = label;

    return buttonCategory;
  }

  function renderCategories(templatesCategoriesNode, categories) {
    templatesCategoriesNode.find("button:not([data-category='*'])").remove();
    categories.forEach((category) => {
      templatesCategoriesNode.append(createTemplateCategoryNode(category));
    });

    templatesCategoriesNode.closest(".in-progress").removeClass("in-progress");
  }

  function spinnerNode() {
    const divSpinnerNode = document.createElement("div");
    divSpinnerNode.classList.add("d-flex", "justify-content-center");

    const divSpinnerBorder = document.createElement("div");
    divSpinnerBorder.classList.add("spinner-border");
    divSpinnerBorder.role = "status";

    const spanSrOnly = document.createElement("span");
    spanSrOnly.classList.add("sr-only");
    spanSrOnly.innerHTML = "Loading...";

    divSpinnerBorder.appendChild(spanSrOnly);
    divSpinnerNode.appendChild(divSpinnerBorder);

    return divSpinnerNode;
  }

  function getPayloadCreate(name, type, template) {
    const payload = {
      triggers: {},
      display_conditions: {},
      name,
      type,
      template,
    };

    payload.display_conditions["start-time"] = "";
    payload.display_conditions["end-time"] = "";

    payload.display_conditions["devices"] = ["desktop", "mobile", "tablet"];

    payload.display_conditions["countries"] = undefined;
    payload.display_conditions["regions"] = undefined;
    payload.display_conditions["pages"] = ["all"];

    payload.display_conditions["cs-roles"] = [];

    payload.display_conditions["recurring"] = {
      converted: {
        when: "always",
        delay: 1,
        unit: "d",
      },
      closed: {
        when: "always",
        delay: 1,
        unit: "d",
      },
    };

    payload.triggers["exit-intent"] = { checkbox: false };
    payload.triggers["after-inactivity"] = { checkbox: false, 0: undefined };
    payload.triggers["time-spent-on-page"] = {
      checkbox: false,
      0: undefined,
    };
    payload.triggers["time-spent-on-site"] = {
      checkbox: false,
      0: undefined,
    };
    payload.triggers["total-view-products"] = {
      checkbox: false,
      0: undefined,
    };
    payload.triggers["product-in-cart"] = {
      checkbox: 0,
      0: null,
    };
    payload.triggers["total-number-in-cart"] = {
      checkbox: false,
      0: undefined,
    };
    payload.triggers["on-click"] = {
      checkbox: false,
      0: "class",
      1: undefined,
    };
    payload.triggers["scroll-percent"] = {
      checkbox: false,
      0: undefined,
    };
    payload.triggers["scroll-to-element"] = {
      checkbox: false,
      0: "class",
      1: undefined,
    };
    payload.triggers["page-load"] = {
      checkbox: true,
      0: 3,
    };
    payload.triggers["page-views"] = {
      checkbox: false,
      0: undefined,
    };

    payload.triggers["new-returning"] = {
      checkbox: true,
      0: "all",
    };

    payload.triggers["x-sessions"] = {
      checkbox: false,
      0: undefined,
    };

    payload.triggers["specific-traffic-source"] = {
      checkbox: false,
      0: null,
      1: undefined,
    };
    payload.triggers["specific-utm"] = {
      checkbox: false,
    };

    payload.triggers["location"] = {
      checkbox: false,
      0: "",
      1: [],
      2: "browser",
    };

    return payload;
  }
});

;// CONCATENATED MODULE: ./admin/assets/js/src/promo-popups/form-validator.js
const FormValidator = (() => {
  const $ = jQuery;
  let validateFields = [
    '[name="promo-name"]',
    ".wrapper-trigger-value.active input[required]:not(:disabled)",
    ".wrapper-trigger-value.active select.select2-dropdown[required]:not(:disabled)",
    ".wrapper-display-condition-value select.select2-dropdown[required]:not(:disabled)",
  ].join(",");

  let validateFieldsAtLeastOne = [
    ".validate-at-least-one .wrapper-trigger-value.active input:not(:disabled)",
    ".validate-at-least-one .wrapper-trigger-value.active select.select2-dropdown:not(:disabled)",
    ".validate-at-least-one .wrapper-display-condition-value select.select2-dropdown:not(:disabled)",
    ".validate-at-least-one .container-specific-device input:not(:disabled)",
  ].join(",");

  const isEmpty = (fieldVal) => {
    if (typeof fieldVal === "object") {
      return fieldVal.length === 0;
    } else if (typeof fieldVal === "string") {
      return !fieldVal.trim().length;
    } else {
      return false;
    }
  };
  const addValidationFailClass = (aField) => {
    if (aField.is("[name='promo-name']")) {
      aField.addClass("validation-fail");
    }

    aField.parents(".wrapper-trigger-value").addClass("validation-fail");
  };
  const removeValidationFailClass = (aField) => {
    if (aField.is("[name='promo-name']")) {
      aField.removeClass("validation-fail");
    }

    aField.parents(".wrapper-trigger-value").removeClass("validation-fail");
  };

  const validateForm = (ajQueryFormElem, callbackAlertMessage) => {
    let formValid = true;

    removeFormFieldErrors(ajQueryFormElem);

    const errorMessages = [];
    const formFields = ajQueryFormElem.find(validateFields);

    const validateField = (aField) => {
      if (isEmpty(aField.val())) {
        formValid = false;
        addValidationFailClass(aField);
        const fieldErrorMessage = aField.data("text-validation");

        if (
          typeof fieldErrorMessage !== "undefined" &&
          fieldErrorMessage.length > 0
        ) {
          errorMessages.push(fieldErrorMessage);
        } else {
          errorMessages.push(`${aField.attr("name")} is required.`);
        }
      } else if (aField.data("valid-selector")) {
        const selectorType = $(
          `[name="${aField.data("valid-selector")}"]`
        ).val();
        const selectorValue = aField.val();
        const fieldErrorMessage = aField.data("valid-selector-message");
        switch (selectorType) {
          case "class":
            // regex to validate a single class name, allow starting with dot
            const isSingleClassRegex = /^(\.?[_a-zA-Z]+[_a-zA-Z0-9-]*)$/;
            if (!selectorValue.match(isSingleClassRegex)) {
              formValid = false;
              addValidationFailClass(aField);

              if (fieldErrorMessage) {
                errorMessages.push(fieldErrorMessage);
              } else {
                errorMessages.push(
                  `${aField.attr("name")} must be a valid class name.`
                );
              }
            }
            break;
          case "id":
            // regex to validate a single id name, allow starting with hash
            const isSingleIdRegex = /^(\#?[_a-zA-Z]+[_a-zA-Z0-9-]*)$/;
            if (!selectorValue.match(isSingleIdRegex)) {
              formValid = false;
              addValidationFailClass(aField);

              if (fieldErrorMessage) {
                errorMessages.push(fieldErrorMessage);
              } else {
                errorMessages.push(
                  `${aField.attr("name")} must be a valid ID name.`
                );
              }
            }
            break;
          default:
            // check if selector is valid CSS selector
            try {
              document.querySelector(selectorValue);
            } catch (e) {
              formValid = false;
              addValidationFailClass(aField);

              if (fieldErrorMessage) {
                errorMessages.push(fieldErrorMessage);
              } else {
                errorMessages.push(
                  `${aField.attr("name")} must be a valid CSS selector.`
                );
              }
            }
        }
      } else {
        removeValidationFailClass(aField);
      }
    };

    formFields.each((i, thisElem) => {
      const fieldElem = $(thisElem);
      validateField(fieldElem);
    });

    const atLeastOne = new Map();

    ajQueryFormElem.find(validateFieldsAtLeastOne).each((_, field) => {
      const fieldElem = $(field);
      const group = fieldElem.closest(".validate-at-least-one");

      let groupUID = group.attr("data-uid");

      if (!groupUID) {
        groupUID = Math.random().toString(36).substring(2, 15);
        group.attr("data-uid", groupUID);
      }

      if (!atLeastOne.has(groupUID)) {
        atLeastOne.set(groupUID, {
          value: false,
          group: group,
        });
      }

      const prevValue = atLeastOne.get(groupUID);
      let fieldValue = fieldElem.val();

      if (fieldElem.is(":checkbox")) {
        fieldValue = fieldElem.is(":checked");
      }

      atLeastOne.set(groupUID, {
        value: prevValue.value || !!fieldValue,
        group: group,
      });
    });

    atLeastOne.forEach((data) => {
      const { group, value } = data;
      if (!value) {
        formValid = false;
        errorMessages.push(group.data("text-validation"));
      }
    });

    if (!formValid) {
      let errorText =
        "The form contains invalid values. Please correct them and try again!";
      if (errorMessages) {
        errorText += "<ul>";
        errorMessages.forEach(function (message) {
          errorText += `<li>${message}</li>`;
        });
        errorText += "</ul>";
      }
      callbackAlertMessage(errorText, "error", { timeout: false });
    } else {
      // after every validation is ok we check if at least one trigger is checked
      if (
        $(".optrix-at-least-one").length &&
        $(".optrix-at-least-one:checked").length === 0
      ) {
        $("#switch_page_load").attr("checked", true).trigger("click");
        // formValid = false;
      }
      $(".js-snackbar__close").trigger("click");
    }

    return formValid;
  };

  const removeFormFieldErrors = (ajQueryFormElem) => {
    ajQueryFormElem.find(".validation-fail").removeClass("validation-fail");
  };

  const revalidateFieldOnChange = (aField) => {
    if (isEmpty(aField.val())) {
      addValidationFailClass(aField);
    } else {
      removeValidationFailClass(aField);
    }
  };

  $(document).on("keydown, change", validateFields, function () {
    revalidateFieldOnChange($(this));
  });

  return {
    validateForm,
  };
})();

;// CONCATENATED MODULE: ./admin/assets/js/src/promo-popups/promo-edit/change-template-modal.js



jQuery(document).ready(function ($) {
  let newPromoTemplate = null;
  let templateItems = [];
  let displayProMarks = true;

  function createTemplateItemNode(item, _selected = false) {
    const { id, name, image: preview, is_pro, is_blank, settings } = item;

    const wrapperItem = document.createElement("div");
    wrapperItem.classList.add(
      "col-xl-4",
      "col-lg-6",
      "col-md-12",
      "col-sm-12",
      "col-xs-12",
      "box-item"
    );
    wrapperItem.setAttribute("data-category", item?.categories || "*");

    const itemTemplateNode = document.createElement("div");
    itemTemplateNode.classList.add("item", "d-flex", "flex-column");

    const spanWrapperTemplateTitle = document.createElement("div");
    spanWrapperTemplateTitle.classList.add(
      "d-flex",
      "flex-row",
      "justify-content-between",
      "align-content-center",
      "wrapper-template-title"
    );

    const spanNameNode = document.createElement("div");
    spanNameNode.classList.add("template-name");
    spanNameNode.innerHTML = name;

    if (is_pro == 1 && displayProMarks) {
      spanNameNode.setAttribute("data-pro", "required");
      wrapperItem.setAttribute("data-pro-template", true);
      wrapperItem.setAttribute("data-placement", "bottom");
      wrapperItem.setAttribute("data-self-boundary", true);
      wrapperItem.setAttribute("data-offset", "0px, -50%r - 100%p");
    }

    spanWrapperTemplateTitle.appendChild(spanNameNode);

    const divWrapperImg = document.createElement("div");
    divWrapperImg.classList.add(
      "d-flex",
      "align-items-center",
      "justify-content-center",
      "wrapper-img"
    );

    const imgPreviewNode = document.createElement("img");
    imgPreviewNode.classList.add("template-preview");
    imgPreviewNode.alt = "Image " + name;
    imgPreviewNode.src = preview;

    divWrapperImg.appendChild(imgPreviewNode);

    itemTemplateNode.appendChild(spanWrapperTemplateTitle);
    itemTemplateNode.appendChild(divWrapperImg);
    const inputHidden = document.createElement("input");
    inputHidden.type = "hidden";
    inputHidden.name = "template-selected";
    inputHidden.value = id;

    itemTemplateNode.appendChild(inputHidden);
    itemTemplateNode.setAttribute("data-settings", item.settings);
    wrapperItem.appendChild(itemTemplateNode);

    if (_selected) {
      selectTemplateItem($(itemTemplateNode));
    }

    return wrapperItem;
  }

  const preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const triggerProPopover = (e) => {
    preventDefault(e);
    $(e.target).trigger("ic-promo-display-pro-message");
  };

  const selectTemplateItem = (item) => {
    const isPRO = item.closest("[data-pro-template]").length;
    item.closest(".templates").find(".item").removeClass("selected");

    if (isPRO) {
      item
        .closest(".modal-content")
        .find(".modal-footer .ic-promo-button-primary")
        .attr("data-pro", "required")
        .on("click", triggerProPopover)
        .attr(
          "data-pro-text",
          "The selected template is only available in PRO."
        );
    } else {
      const _button = item
        .closest(".modal-content")
        .find(".modal-footer .ic-promo-button-primary");

      _button.removeAttr("data-pro");
      _button.off("click", triggerProPopover);
      _button.popover("dispose");
    }

    const newPromoTemplateId = item.find(`[name="template-selected"]`).val();
    newPromoTemplate =
      templateItems.find((template) => template.id == newPromoTemplateId) ||
      null;
    item.addClass("selected");
  };

  function createTemplateCategoryNode(category) {
    const { slug, label } = category;

    const buttonCategory = document.createElement("button");
    buttonCategory.classList.add(
      "ic-promo-button",
      "ic-promo-button-secondary",
      "ic-promo-button-sm"
    );

    buttonCategory.setAttribute("data-category", slug);
    buttonCategory.innerHTML = label;

    return buttonCategory;
  }

  const getTemplates = (
    templatesNode,
    templatesCategoriesNode,
    promoTypeVal
  ) => {
    $(templatesCategoriesNode).on("click", "button", function () {
      const $btn = $(this);
      const category = $btn.data("category");

      $btn
        .removeClass("ic-promo-button-secondary")
        .addClass("ic-promo-button-primary active");
      $btn
        .siblings(".ic-promo-button")
        .removeClass("ic-promo-button-primary active")
        .addClass("ic-promo-button-secondary");

      const items = templatesNode.find(".box-item");
      let itemsToDisplay = items;

      if (category !== "*") {
        itemsToDisplay = items.filter(`[data-category*="${category}"]`);
      }

      itemsToDisplay = itemsToDisplay.add(items.filter("[data-is-blank]"));

      items.not(itemsToDisplay).hide();
      let animationCompleteRun = false;
      itemsToDisplay.fadeIn({
        duration: 200,
        complete: function () {
          if (animationCompleteRun) {
            return;
          }

          animationCompleteRun = true;

          itemsToDisplay.first().find(".item ").click();
        },
      });
    });

    return new Promise((resolve, reject) => {
      $.post(
        cs_promo_settings.ajax_url,
        {
          action: "iconvertpr_promo_get_template_by_type",
          promo_type: promoTypeVal,
          _wpnonce_get_template: $('input[name="_wpnonce_get_template"]').val(),
        },
        (response) => {
          templatesNode.html(null);

          if (response.success) {
            const { categories, templates } = response.data;

            templateItems = templates;

            templates.forEach((item, index) => {
              templatesNode.append(createTemplateItemNode(item, index === 0));
            });

            templatesCategoriesNode
              .find("button:not([data-category='*'])")
              .remove();
            categories.forEach((category) => {
              templatesCategoriesNode.append(
                createTemplateCategoryNode(category)
              );
            });

            templatesCategoriesNode
              .closest(".in-progress")
              .removeClass("in-progress");
          }
        }
      );
    });
  };

  function changeTemplate(promoId, promoTypeVal) {
    newPromoTemplate = null;
    const $content = $(`
        <div class="iconvert-change-template-modal-wrapper">
            <div class="templates-categories in-progress">
              <span class="templates-cats-label">Category</span>
              <div class="templates-categories-list">
                <button data-category="*" class="ic-promo-button ic-promo-button-primary ic-promo-button-sm active">All</button>
              </div>
            </div>
            <div class="iconvert-change-template-wrapper-templates">
                    <div class="d-flex flex-wrap align-content-start templates">
                        <div class="templates-loader-spinner">
                            <div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>
                        </spinner>
                    </div>
			</div>
        </div>`);

    const templatesNode = $content.find(".templates");
    const templatesCategoriesNode = $content.find(".templates-categories-list");

    $content.on("click", ".templates .box-item .item", function () {
      selectTemplateItem($(this));
    });

    getTemplates(templatesNode, templatesCategoriesNode, promoTypeVal);

    let modal = null;

    function callAjaxAction() {
      let $notice = modal.find(".modal-notice");
      if (!$notice.length) {
        $notice = $('<div class="modal-notice"></div>');
        modal.find(".modal-footer").append($notice);
      }

      $notice.html(
        "<span class='spinner visible'></span><span>Changing template...</span>"
      );

      $.post(
        cs_promo_settings.ajax_url,
        {
          action: "iconvertpr_change_popup_template",
          post_id: promoId,
          template_id: newPromoTemplate.id,
          _wpnonce: $(
            'input[name="_wpnonce_iconvertpr_change_popup_template"]'
          ).val(),
        },
        (response) => {
          if (response.success) {
            modal.modal("hide");
            SnackBarAlert.alertMessage(response.data.message, "success", {
              keepInfo: true,
            });
          } else {
            $notice.html(`<span class="text-danger">${response.data}</span>`);
          }
        }
      );
    }

    function showConfirmationMessage() {
      const confirmMessage = $(`<div class="ic-change-template-confirm-modal">
            <div class="modal-confirm-message">
               <div class="row">
                <div class="col col-auto">
                  <img src="${newPromoTemplate?.image}" alt="Image ${newPromoTemplate?.name}" class="template-preview" />
                </div>
                <div class="col d-flex flex-column justify-content-center">
                  <h6>Are you sure you want to change the template?</h6>
                  <p>This action will remove your current content and replace it with the new template.</p>
                </div>
            </div>
        </div>
      `);

      modal = ICModal.dialog("Change template", confirmMessage, {
        primary_button: "Change template",
        primary_className:
          "ic-promo-button ic-promo-button-sm ic-promo-button-danger",
        secondary_button: "Cancel",
        callback: () => {
          callAjaxAction();
          return false;
        },
        className: "ic-dialog ic-change-template-confirm-modal",
      });
    }

    modal = ICModal.dialog("Change Template", $content, {
      primary_button: "Use selected template",
      secondary_button: "Cancel",
      callback: (...args) => {
        setTimeout(() => {
          showConfirmationMessage();
        }, 500);
      },
      className: "ic-dialog ic-change-template-modal",
    });
  }

  $(".modal-change-template-popup").on("click", function () {
    displayProMarks = !!$(this).attr("data-template-pro-preview");
    changeTemplate($(this).data("id"), $(this).data("promo-type"));
  });
});

;// CONCATENATED MODULE: ./admin/assets/js/src/promo-popups/promo-edit/position-and-effect.js


jQuery(function ($) {
  const url = new URL(window.location.href);

  if (url.searchParams.get("route") !== "promo.edit") {
    return;
  }

  const promoTypeInput = $(this).find('input[name="promo-type"]');

  ICPromoTypesSettings.setOptionsVisible(promoTypeInput);
  ICPromoTypesSettings.setDefaultSettings(promoTypeInput.data().settings);
});

;// CONCATENATED MODULE: ./admin/assets/js/src/promo-popups/promo-edit/preview-modal.js



jQuery(document).ready(function ($) {
  $(".modal-preview-popup").on("click", function (e) {
    e.preventDefault();

    let deviceIsMobile = window.innerWidth < 1024;

    const url = new URL($(this).data("href"));

    url.searchParams.append(
      "settings",
      JSON.stringify(ICPromoTypesSettings.buildPromoTypeSettings())
    );

    if (deviceIsMobile) {
      window.open(url, "_blank").focus();
      return;
    }
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", url);
    iframe.style.width = "100%";
    iframe.style.height = "100%";

    const settings = {
      size: "large",
      primary_button: "x",
      secondary_button: "Cancel",
      callback: () => {},
    };

    const label = $(this)
      .closest(".table-row")
      .find('[data-col-group="name"]')
      .text();

    ICModal.previewModal(
      label ? `Previewing - ${label}` : "Preview",
      iframe,
      settings
    );
  });
});

;// CONCATENATED MODULE: ./admin/assets/js/src/promo-popups/promo-edit.js








jQuery(document).ready(function ($) {
  const bodyElem = $("body");

  const promoEditFormElem = $("#promo-edit-form");
  const startTimeElem = $('input[name="when-start"]');
  const endTimeElem = $('input[name="when-end"]');
  const selectCountriesElem = $('select[name="countries-autocomplete"]');
  const selectLocationService = $('select[name="location-service"]');
  const selectCitiesElem = $('select[name="cities-autocomplete"]');
  const whichPageTypeElem = $('select[name="which-pages-type"]');
  const whichSpecificPagesElem = $('select[name="which-pages-autocomplete"]');
  const whichSpecificPostsElem = $('select[name="which-posts-autocomplete"]');
  const whichSpecificProductsElem = $(
    'select[name="which-products-autocomplete"]'
  );
  // const prodSelectorElem = $('select[name="product_in_cart"]');
  const selectItemsInCart = $('select[name="select_items_in_cart"]');
  const selectTotalAmountCart = $('select[name="select_total_amount_cart"]');
  const switchOnClickElem = $('input[name="switch_on_click"]');
  const selectOnClickElem = $('select[name="select_on_click"]');
  const valueOnClickElem = $('input[name="value_on_click"]');
  const selectProductInCart = $('select[name="select_product_in_cart"]');
  const valueProductInCart = $('select[name="product_in_cart"]');
  const selectProductNotInCart = $('select[name="select_product_not_in_cart"]');
  const valueProductNotInCart = $('select[name="product_not_in_cart"]');
  const arrivingFromSourceElem = $(
    'select[name="select_arriving_from_source"]'
  );
  const referrerValueElem = $('[name="referrer_value"]');
  const scrollToElem = $('select[name="select_scroll_to_element"]');
  const valueScrollToElem = $('input[name="value_on_scroll_element"]');
  const switchAfterInactivityElem = $('input[name="switch_after_inactivity"]');
  const valueAfterInactivityElem = $('input[name="after_inactivity"]');
  const switchOnPageLoadElem = $('input[name="switch_page_load"]');
  const valueOnPageLoadElem = $('input[name="page_load_seconds"]');

  // actions switches ( switch_on_click,switch_manually_open ) will turn off the pageload switch
  let actionSwitches = [
    "switch_on_click",
    "switch_manually_open",
    "switch_page_exit",
    "switch_scroll_percent",
    "switch_scroll_to_element",
  ];

  $(actionSwitches.map((item) => `input[name="${item}"]`).join(", ")).on(
    "change",
    function () {
      const elem = $(this);
      if (elem.is(":checked")) {
        $('input[name="switch_page_load"]').prop("checked", false);
        // $('input[name="page_load_seconds"]').val("");
        $('input[name="switch_page_load"]').trigger("change");
      }
    }
  );

  // Disable mouse middle click
  window.addEventListener("auxclick", (e) => {
    if (
      e.button === 1 &&
      e.target.classList.contains("js-disable-middle-click")
    ) {
      e.preventDefault();
    }
  });

  $(function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
  });

  const enforceMinMax = (e) => {
    const elem = e.currentTarget;
    if (elem.value !== "") {
      if (parseInt(elem.value) < parseInt(elem.min)) {
        elem.value = elem.min;
      }
      if (parseInt(elem.value) > parseInt(elem.max)) {
        elem.value = elem.max;
      }
    }
  };

  $(document).on("keyup", 'input[type="number"]', enforceMinMax);

  $('[data-row="recurring"]').each(function () {
    const elem = $(this);
    elem.find("select").select2({
      width: "100%",
      minimumResultsForSearch: Infinity,
    });

    const whenSelect = elem.find('select[ name="recurring-when"]');
    function onWhenSelectChange() {
      const value = whenSelect.val();

      const delayControlsElem = elem.find(
        '[data-name="recurring-after-time-section"]'
      );

      delayControlsElem.toggleClass("d-none", value !== "after");
    }

    whenSelect.on("select2:select", onWhenSelectChange);
    onWhenSelectChange();
  });

  const onNewReturningSelectChange = (e) => {
    const elem = $('[name="new-returning"]');

    if (elem.val() === "returning") {
      $('[data-row="sessions-number"]').removeClass("d-none");
    } else {
      $('[data-row="sessions-number"]').addClass("d-none");
    }

    $('[name="switch_after_sessions"]')
      .prop("checked", false)
      .trigger("change");
  };
  $('[name="new-returning"]').on("change", onNewReturningSelectChange);

  $('[name="new-returning"]').select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });
  onNewReturningSelectChange();

  $('.wrapper-display-condition-switch input[type="checkbox"]')
    .each((index, input) => {
      const elem = $(input);
      toggleSelectDisplayConditionInputValueDisabled(elem);
    })
    .on("change", function () {
      const elem = $(this);
      toggleSelectDisplayConditionInputValueDisabled(elem);
    });

  $('.wrapper-trigger-switch input[type="checkbox"]')
    .each((index, input) => {
      const elem = $(input);
      toggleSelectTriggerInputValueDisabled(elem);
    })
    .on("change", function () {
      const elem = $(this);
      toggleSelectTriggerInputValueDisabled(elem);
    });

  const saveButtons = $(
    'button[name="update-popup"],button[name="save-and-activate-popup"]'
  );

  const setSaveButtonsState = (state) => {
    switch (state) {
      case "loading":
        saveButtons.each(function () {
          const _button = $(this);

          _button.html(_button.data("loading"));
          _button.attr("disabled", true);
        });
        break;
      case "enabled":
        saveButtons.each(function () {
          const _button = $(this);
          _button.html(_button.data("save"));
          _button.removeAttr("disabled");
        });
        break;
      case "disabled":
        saveButtons.each(function () {
          const _button = $(this);
          _button.html(_button.data("save"));

          if (_button.is(`button[name="save-and-activate-popup"]`)) {
            _button.removeAttr("disabled");
            return;
          }
          _button.attr("disabled", true);
        });
        break;
    }
  };

  saveButtons.on("click", function (e) {
    e.preventDefault();
    const _button = $(this);
    const saveAndActivateURL = _button.data("save-activate-redirect");
    const isSaveAndActivate = _button.is(
      'button[name="save-and-activate-popup"]'
    );
    setSaveButtonsState("loading");
    if (
      !FormValidator.validateForm(promoEditFormElem, SnackBarAlert.alertMessage)
    ) {
      setTimeout(function () {
        setSaveButtonsState("enabled");
      }, 100);
      return;
    }

    const payload = getPayload();

    payload.settings = ICPromoTypesSettings.buildPromoTypeSettings();

    let reqBody = {
      action: "iconvertpr_update_popup",
      payload: payload,
      post_id: $('[name="post_id"]').val(),
      _wpnonce: $('input[name="_wpnonce"]').val(),
    };

    if (isSaveAndActivate) {
      reqBody.activate = 1;
    }

    $.post(cs_promo_settings.ajax_url, reqBody, (response) => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      if (response.success) {
        SnackBarAlert.alertMessage(response.data.message, "success", {
          keepInfo: true,
        });
        setSaveButtonsState("disabled");
        if (isSaveAndActivate) {
          updateUIValue(".cs-switch.cs-toggle-status input", true);
          if (saveAndActivateURL) {
            window.location.href = saveAndActivateURL;
          }
        }
        return;
      }
      SnackBarAlert.alertMessage(response.data, "error");
      _button.html(_button.data("save"));
    });
  });

  $('.icpm-wrapper input[type="number"]').on("input", function (e) {
    $(this).val($(this).val().replace(/\D/g, ""));
  });

  selectOnClickElem.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });
  selectItemsInCart.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });
  selectTotalAmountCart.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });
  whichPageTypeElem.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });
  selectProductInCart.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });
  selectProductNotInCart.select2({
    width: "100%",
    minimumResultsForSearch: Infinity,
  });
  const showHideSpecificPostType = (e, aWhichSpecificElem) => {
    let postTypes = "";

    switch (aWhichSpecificElem.attr("name")) {
      case "which-pages-autocomplete":
        postTypes = "pages";
        break;
      case "which-posts-autocomplete":
        postTypes = "posts";
        break;
      case "which-products-autocomplete":
        postTypes = "products";
        break;
    }

    const data = e.params.data;

    if (data && data.id === `specific_${postTypes}`) {
      $(`[data-target="specific-${postTypes}"]`).show();
      aWhichSpecificElem.prop("disabled", false);
    } else {
      $(`[data-target="specific-${postTypes}"]`).hide();
      aWhichSpecificElem.prop("disabled", true);
    }
  };

  whichPageTypeElem.on("select2:select", function (e) {
    showHideSpecificPostType(e, whichSpecificPagesElem);
    showHideSpecificPostType(e, whichSpecificPostsElem);
    showHideSpecificPostType(e, whichSpecificProductsElem);
  });

  const initSelect2Specific = (aWhichSpecificElem) => {
    if (!aWhichSpecificElem.length) {
      return;
    }

    let postType = "";

    switch (aWhichSpecificElem.attr("name")) {
      case "which-pages-autocomplete":
        postType = "page";
        break;
      case "which-posts-autocomplete":
        postType = "post";
        break;
      case "which-products-autocomplete":
        postType = "product";
        break;
    }

    aWhichSpecificElem.select2({
      ajax: {
        url: cs_promo_settings.ajax_url,
        data: function (params) {
          {
            return {
              search: params.term,
              post_type: postType,
              action: "iconvertpr_posts_search",
              _wpnonce_iconvertpr_search: $(
                'input[name="_wpnonce_iconvertpr_search"]'
              ).val(),
            };
          }
        },
        processResults: function (data) {
          // Transforms the top-level key of the response object from 'items' to 'results'
          const results = data.data.posts.map((post) => ({
            text: post.post_title,
            id: post.ID,
          }));

          return {
            results: results,
          };
        },
      },
      width: "100%",
    });

    $.ajax({
      type: "GET",
      url: cs_promo_settings.ajax_url,
      data: {
        post_type: postType,
        action: "iconvertpr_posts_search",
        _wpnonce_iconvertpr_search: $(
          'input[name="_wpnonce_iconvertpr_search"]'
        ).val(),
        ids: aWhichSpecificElem.data("selected") || 0,
      },
    }).then(function (data) {
      data.data.posts.forEach((post) => {
        const option = new Option(post.post_title, post.ID, true, true);
        aWhichSpecificElem.append(option);
      });

      utils_triggerUIUpdateChange(aWhichSpecificElem);

      // manually trigger the `select2:select` event
      aWhichSpecificElem.trigger({
        type: "select2:select",
        params: {
          data: data,
        },
      });
    });
  };

  initSelect2Specific(whichSpecificPagesElem);
  initSelect2Specific(whichSpecificPostsElem);
  initSelect2Specific(whichSpecificProductsElem);

  $(".container-specific-device").on("click", function () {
    const inputElem = $(this).find("input");
    if (inputElem.is(":checked")) {
      inputElem.prop("checked", false);
      $(this).removeClass("active");
      return;
    }

    inputElem.prop("checked", true);
    $(this).addClass("active");
  });
  function toggleSelectTriggerInputValueDisabled(elem) {
    if (elem.is(":checked")) {
      elem
        .closest(".wrapper-trigger-switch")
        .parent()
        .find("select")
        .not("[data-relation-disabled]")
        .prop("disabled", false);
      elem
        .closest(".wrapper-trigger-switch")
        .parent()
        .find('input[type="text"], input[type="number"]')
        .not("[data-relation-disabled]")
        .prop("disabled", false);

      elem
        .closest(".wrapper-trigger-switch")
        .parent()
        .find(".wrapper-trigger-value")
        .show()
        .addClass("active");
    } else {
      elem
        .closest(".wrapper-trigger-switch")
        .parent()
        .find("select")
        .not("[data-relation-disabled]")
        .prop("disabled", true);
      elem
        .closest(".wrapper-trigger-switch")
        .parent()
        .find('input[type="text"], input[type="number"]')
        .not("[data-relation-disabled]")
        .prop("disabled", true);

      elem
        .closest(".wrapper-trigger-switch")
        .parent()
        .find(".wrapper-trigger-value")
        .hide()
        .removeClass("active");
    }
  }

  function toggleSelectDisplayConditionInputValueDisabled(elem) {
    if (elem.is(":checked")) {
      elem
        .closest(".wrapper-display-condition-switch")
        .parent()
        .find("select")
        .prop("disabled", false);
      elem
        .closest(".wrapper-display-condition-switch")
        .parent()
        .find('input[type="text"], input[type="number"]')
        .not("[data-relation-disabled]")
        .prop("disabled", false);

      elem
        .closest(".wrapper-display-condition-switch")
        .parent()
        .find(".wrapper-display-condition-value")
        .show()
        .addClass("active");
    } else {
      elem
        .closest(".wrapper-display-condition-switch")
        .parent()
        .find("select")
        .not("[data-relation-disabled]")
        .prop("disabled", true);
      elem
        .closest(".wrapper-display-condition-switch")
        .parent()
        .find('input[type="text"], input[type="number"]')
        .not("[data-relation-disabled]")
        .prop("disabled", true);

      elem
        .closest(".wrapper-display-condition-switch")
        .parent()
        .find(".wrapper-display-condition-value")
        .hide()
        .removeClass("active");
    }
  }

  const hideFroAllUsers = $('input[name="switch_hide_logged_users"]');
  function updateHideForAllUsers() {
    const isChecked = hideFroAllUsers.is(":checked");

    const userRoles = $('[data-checkbox-group="hide-user"]');

    userRoles.not(hideFroAllUsers).each(function () {
      const elem = $(this);
      if (isChecked) {
        $(this).prop("checked", false);
        elem.closest(".trigger.element").css("display", "none");
      } else {
        elem.closest(".trigger.element").css("display", "");
      }
    });
  }
  hideFroAllUsers.on("change", updateHideForAllUsers);
  updateHideForAllUsers();

  function getRecurringValueFor(type) {
    const elem = $(`[data-row="recurring"][data-recurring-type="${type}"]`);

    return {
      when: elem.find('select[name="recurring-when"]').val(),
      delay: elem.find('input[name="recurring-delay"]').val(),
      unit: elem.find('select[name="recurring-unit"]').val(),
    };
  }

  function getPayload() {
    const promoNameElem = $('input[name="promo-name"]');
    const payload = {
      triggers: {},
      display_conditions: {},
      general: {},
    };
    if (promoNameElem.val()) {
      payload.general.name = promoNameElem.val();
    }
    payload.display_conditions["start-time"] = {
      checkbox: $('input[name="switch_when_start"]').is(":checked"),
      0: startTimeElem.val(),
    };

    payload.display_conditions["end-time"] = {
      checkbox: $('input[name="switch_when_end"]').is(":checked"),
      0: endTimeElem.val(),
    };

    const devices = [];
    if ($('input[name="switch_device_desktop"]').is(":checked")) {
      devices.push("desktop");
    }
    if ($('input[name="switch_device_tablet"]').is(":checked")) {
      devices.push("tablet");
    }
    if ($('input[name="switch_device_mobile"]').is(":checked")) {
      devices.push("mobile");
    }
    payload.display_conditions["devices"] = devices;

    payload.triggers["location"] = {
      checkbox: $('input[name="switch_location"]').is(":checked"),
      0: selectCountriesElem.val(),
      1: selectCitiesElem.val(),
      2: selectLocationService.val(),
    };

    const specificId = {
      specific_pages: whichSpecificPagesElem.val(),
      specific_posts: whichSpecificPostsElem.val(),
      specific_products: whichSpecificProductsElem.val(),
    };

    payload.display_conditions["pages"] = {
      0: whichPageTypeElem.val(),
      1: specificId[whichPageTypeElem.val()],
    };

    const csHideRoles = [];

    const checkedItems = $('input[data-checkbox-group="hide-user"]:checked');
    if (checkedItems.length > 0) {
      checkedItems.each(function () {
        const role = $(this).val();
        csHideRoles.push(role);
      });
    }

    payload.display_conditions["cs-roles"] = csHideRoles;

    payload.display_conditions["recurring"] = {
      converted: getRecurringValueFor("converted"),
      closed: getRecurringValueFor("closed"),
    };

    payload.triggers["manually-open"] = {
      checkbox: $('input[name="switch_manually_open"]').is(":checked"),
    };

    payload.triggers["exit-intent"] = {
      checkbox: $('input[name="switch_page_exit"]').is(":checked"),
    };
    payload.triggers["after-inactivity"] = {
      checkbox: switchAfterInactivityElem.is(":checked"),
      0: valueAfterInactivityElem.val(),
    };
    payload.triggers["time-spent-on-page"] = {
      checkbox: $('input[name="switch_time_spend_single_page"]').is(":checked"),
      0: $('input[name="time_spend_single_page"]').val(),
    };
    payload.triggers["time-spent-on-site"] = {
      checkbox: $('input[name="switch_time_spend_on_site"]').is(":checked"),
      0: $('input[name="time_spend_on_site"]').val(),
    };
    payload.triggers["total-view-products"] = {
      checkbox: $('input[name="switch_total_view_products"]').is(":checked"),
      0: $('input[name="total_view_products"]').val(),
    };
    payload.triggers["product-in-cart"] = {
      checkbox: $('input[name="switch_product_in_cart"]').is(":checked"),
      0: selectProductInCart.val(),
      1: valueProductInCart.val(),
    };
    payload.triggers["product-not-in-cart"] = {
      checkbox: $('input[name="switch_product_not_in_cart"]').is(":checked"),
      0: selectProductNotInCart.val(),
      1: valueProductNotInCart.val(),
    };
    payload.triggers["total-number-in-cart"] = {
      checkbox: $('input[name="switch_total_number_in_cart"]').is(":checked"),
      0: selectItemsInCart.val(),
      1: $('input[name="total_number_in_cart"]').val(),
    };
    payload.triggers["total-amount-cart"] = {
      checkbox: $('input[name="switch_total_amount_cart"]').is(":checked"),
      0: selectTotalAmountCart.val(),
      1: $('input[name="total_amount_cart"]').val(),
    };
    payload.triggers["on-click"] = {
      checkbox: switchOnClickElem.is(":checked"),
      0: selectOnClickElem.val(),
      1: valueOnClickElem.val(),
    };
    payload.triggers["scroll-percent"] = {
      checkbox: $('input[name="switch_scroll_percent"]').is(":checked"),
      0: $('input[name="scroll_percent"]').val(),
    };
    payload.triggers["scroll-to-element"] = {
      checkbox: $('input[name="switch_scroll_to_element"]').is(":checked"),
      0: scrollToElem.val(),
      1: valueScrollToElem.val(),
    };
    payload.triggers["page-load"] = {
      checkbox: switchOnPageLoadElem.is(":checked"),
      0: valueOnPageLoadElem.val(),
    };
    payload.triggers["same-page-views"] = {
      checkbox: $('input[name="switch_same_page_views"]').is(":checked"),
      0: $('input[name="same_page_views"]').val(),
    };
    payload.triggers["page-views"] = {
      checkbox: $('input[name="switch_page_views"]').is(":checked"),
      0: $('input[name="page_views"]').val(),
    };

    payload.triggers["new-returning"] = {
      checkbox: true,
      0: $('select[name="new-returning"]').val(),
    };

    payload.triggers["x-sessions"] = {
      checkbox: $('input[name="switch_after_sessions"]').is(":checked"),
      0: $('input[name="after_sessions"]').val(),
    };
    payload.triggers["x-products"] = {
      checkbox: $('input[name="switch_after_products"]').is(":checked"),
      0: $('input[name="after_products"]').val(),
    };

    payload.display_conditions["specific-traffic-source"] = {
      checkbox: $('input[name="switch_arriving_from_source"]').is(":checked"),
      0: arrivingFromSourceElem.val(),
      1:
        arrivingFromSourceElem.val() === "referrer"
          ? referrerValueElem.val()
          : undefined,
    };
    payload.display_conditions["specific-utm"] = {
      checkbox: $('input[name="switch_arriving_from_utm"]').is(":checked"),
      0: $('input[name="arriving_from_utm_source"]').val(),
      1: $('input[name="arriving_from_utm_medium"]').val(),
      2: $('input[name="arriving_from_utm_campaign"]').val(),
      3: $('input[name="arriving_from_utm_term"]').val(),
      4: $('input[name="arriving_from_utm_content"]').val(),
    };

    return payload;
  }

  // prompt user about existing changes when navigating away from the page
  function onBeforeUnload(event) {
    event.preventDefault();
    event.returnValue = "";

    return false;
  }

  // remove the title attribute from the select2 dropdown
  $(".select2-selection__rendered").hover(function () {
    $(this).removeAttr("title");
  });

  $("body").on(
    "change keypress",
    "#promo-edit-form :input:not([readonly])",
    function (e) {
      if (eventIsFromUIUpdate(e)) {
        return;
      }

      if (e.target.closest(".cs-list-popup-switch")) {
        return;
      }

      setSaveButtonsState("enabled");
      window.addEventListener("beforeunload", onBeforeUnload);
    }
  );

  $(".icp-integer-only").on("change", (e) => {
    const elem = $(e.currentTarget);
    elem.val(Math.abs(parseInt(Math.ceil(elem.val()))));
  });

  function initToggleCounter() {
    var countActiveSelector = $(".js-count-active");

    $.each(countActiveSelector, function () {
      countActiveToggles($(this));
    });
  }

  function countActiveToggles(aSelector) {
    var activeToggles = aSelector
      .parents(".accordion")
      .find(".switch-input:checked");
    var activeFields = aSelector.parents(".accordion").find(".js-active-field");
    var countActiveToggles = activeToggles.length;

    const isEmpty = (fieldVal) => {
      if (typeof fieldVal === "object") {
        return fieldVal.length === 0;
      } else if (typeof fieldVal === "string") {
        return !fieldVal.trim().length;
      } else {
        return false;
      }
    };

    $.each(activeFields, function () {
      if (!isEmpty($(this).val())) {
        countActiveToggles++;
      }
    });

    if (countActiveToggles > 0) {
      aSelector.html(`${countActiveToggles}&nbsp;active`);
      showToggleCounter(aSelector);
    } else {
      aSelector.html("");
      hideToggleCounter(aSelector);
    }
  }

  function showToggleCounter(aSelector) {
    if (aSelector.hasClass("hidden")) {
      aSelector.removeClass("hidden");
    }
  }

  function hideToggleCounter(aSelector) {
    if (!aSelector.hasClass("hidden")) {
      aSelector.addClass("hidden");
    }
  }

  initToggleCounter();

  $(function () {
    $(".switch-input, .js-active-field").change(function () {
      var countActiveSelector = $(this)
        .parents(".accordion")
        .find(".js-count-active");
      countActiveToggles(countActiveSelector);
    });
  });
});

;// CONCATENATED MODULE: ./admin/assets/js/src/integrations/index.js


function callEndpoint(endpoint, data = null, method = "GET") {
  endpoint = new URL(endpoint);
  endpoint.searchParams.append("noheader", "true");

  return new Promise((resolve, reject) => {
    jQuery.ajax({
      url: endpoint.toString(),
      method: method,
      data: data,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      },
      error: function (response) {
        reject(response.data);
      },
    });
  });
}

async function callFormEndpoint(form, extras = {}) {
  const endpoint = new URL(form.getAttribute("action"), window.location.origin);
  const method = (form.getAttribute("method") || "GET").toUpperCase();
  const formData = new FormData(form);

  Object.entries(extras).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return callEndpoint(endpoint, formData, method);
}

jQuery(function ($) {
  $(`[data-name="integration-form"]`).on("submit", async function (e) {
    e.preventDefault();
    e.stopPropagation();

    const $form = $(this);

    try {
      const response = await callFormEndpoint(this);

      SnackBarAlert.alertMessage(response.message, "success");

      if (response.next_data) {
        Object.keys(response.next_data).forEach((key) => {
          $(this).find(`[name="fields[${key}]"]`).val(response.next_data[key]);
        });

        $form.find(`[data-action="test-connection"]`).removeAttr("disabled");
        $form.find(`[type=reset]`).removeAttr("disabled");
      }
    } catch (error) {
      SnackBarAlert.alertMessage(error[0].message, "error");
    }
  });

  $(`[data-name="integration-form"]`).on("reset", async function (e) {
    try {
      const response = await callFormEndpoint(this, { reset: true });

      const $form = $(this);

      SnackBarAlert.alertMessage(response.message, "success");

      if (response.next_data) {
        Object.keys(response.next_data).forEach((key) => {
          $form.find(`[name="fields[${key}]"]`).val(response.next_data[key]);
        });

        $form
          .find(`[data-action="test-connection"]`)
          .attr("disabled", "disabled");
        $form.find(`[type=reset]`).attr("disabled", "disabled");
      }
    } catch (error) {
      SnackBarAlert.alertMessage(error[0].message, "error");
    }
  });

  $(`[data-action="test-connection"]`).on("click", async function (e) {
    e.preventDefault();
    e.stopPropagation();

    const url = $(this).data("action-url");
    const $form = $(this).closest("form");

    try {
      $(this).addClass("spin");

      const response = await callEndpoint(url);

      $(this).removeClass("spin");

      SnackBarAlert.alertMessage(response.message, "success");
    } catch (error) {
      $(this).removeClass("spin");
      SnackBarAlert.alertMessage(error[0].message, "error");
    }
    $form.find(`[type=reset]`).removeAttr("disabled");
  });
});

// EXTERNAL MODULE: ./admin/assets/js/src/promo-popups/pro-required-popup.js
var pro_required_popup = __webpack_require__(247);
;// CONCATENATED MODULE: ./admin/assets/js/src/index.js












})();

/******/ })()
;
