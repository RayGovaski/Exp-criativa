import {
  require_prop_types
} from "./chunk-X3MDYGI3.js";
import {
  Link,
  NavLink
} from "./chunk-56ELRILT.js";
import "./chunk-BVONTIK6.js";
import {
  require_react
} from "./chunk-2GK3IQSO.js";
import {
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/react-router-hash-link/dist/react-router-hash-link.esm.js
var import_react = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
var hashFragment = "";
var observer = null;
var asyncTimerId = null;
var scrollFunction = null;
function reset() {
  hashFragment = "";
  if (observer !== null)
    observer.disconnect();
  if (asyncTimerId !== null) {
    window.clearTimeout(asyncTimerId);
    asyncTimerId = null;
  }
}
function isInteractiveElement(element) {
  var formTags = ["BUTTON", "INPUT", "SELECT", "TEXTAREA"];
  var linkTags = ["A", "AREA"];
  return formTags.includes(element.tagName) && !element.hasAttribute("disabled") || linkTags.includes(element.tagName) && element.hasAttribute("href");
}
function getElAndScroll() {
  var element = null;
  if (hashFragment === "#") {
    element = document.body;
  } else {
    var id = hashFragment.replace("#", "");
    element = document.getElementById(id);
    if (element === null && hashFragment === "#top") {
      element = document.body;
    }
  }
  if (element !== null) {
    scrollFunction(element);
    var originalTabIndex = element.getAttribute("tabindex");
    if (originalTabIndex === null && !isInteractiveElement(element)) {
      element.setAttribute("tabindex", -1);
    }
    element.focus({ preventScroll: true });
    if (originalTabIndex === null && !isInteractiveElement(element)) {
      element.blur();
      element.removeAttribute("tabindex");
    }
    reset();
    return true;
  }
  return false;
}
function hashLinkScroll(timeout) {
  window.setTimeout(function() {
    if (getElAndScroll() === false) {
      if (observer === null) {
        observer = new MutationObserver(getElAndScroll);
      }
      observer.observe(document, {
        attributes: true,
        childList: true,
        subtree: true
      });
      asyncTimerId = window.setTimeout(function() {
        reset();
      }, timeout || 1e4);
    }
  }, 0);
}
function genericHashLink(As) {
  return import_react.default.forwardRef(function(props, ref) {
    var linkHash = "";
    if (typeof props.to === "string" && props.to.includes("#")) {
      linkHash = "#" + props.to.split("#").slice(1).join("#");
    } else if (typeof props.to === "object" && typeof props.to.hash === "string") {
      linkHash = props.to.hash;
    }
    var passDownProps = {};
    if (As === NavLink) {
      passDownProps.isActive = function(match, location) {
        return match && match.isExact && location.hash === linkHash;
      };
    }
    function handleClick(e) {
      reset();
      hashFragment = props.elementId ? "#" + props.elementId : linkHash;
      if (props.onClick)
        props.onClick(e);
      if (hashFragment !== "" && // ignore non-vanilla click events, same as react-router
      // below logic adapted from react-router: https://github.com/ReactTraining/react-router/blob/fc91700e08df8147bd2bb1be19a299cbb14dbcaa/packages/react-router-dom/modules/Link.js#L43-L48
      !e.defaultPrevented && // onClick prevented default
      e.button === 0 && // ignore everything but left clicks
      (!props.target || props.target === "_self") && // let browser handle "target=_blank" etc
      !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)) {
        scrollFunction = props.scroll || function(el) {
          return props.smooth ? el.scrollIntoView({ behavior: "smooth" }) : el.scrollIntoView();
        };
        hashLinkScroll(props.timeout);
      }
    }
    var filteredProps = __rest(props, ["scroll", "smooth", "timeout", "elementId"]);
    return import_react.default.createElement(As, __assign({}, passDownProps, filteredProps, { onClick: handleClick, ref }), props.children);
  });
}
var HashLink = genericHashLink(Link);
var NavHashLink = genericHashLink(NavLink);
if (true) {
  HashLink.displayName = "HashLink";
  NavHashLink.displayName = "NavHashLink";
  propTypes = {
    onClick: import_prop_types.default.func,
    children: import_prop_types.default.node,
    scroll: import_prop_types.default.func,
    timeout: import_prop_types.default.number,
    elementId: import_prop_types.default.string,
    to: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.object])
  };
  HashLink.propTypes = propTypes;
  NavHashLink.propTypes = propTypes;
}
var propTypes;
export {
  HashLink,
  NavHashLink,
  genericHashLink
};
/*! Bundled license information:

react-router-hash-link/dist/react-router-hash-link.esm.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
//# sourceMappingURL=react-router-hash-link.js.map
