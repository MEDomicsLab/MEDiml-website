import { forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { isExternal, resolveHref } from "../../../lib/links.js";
import { scrollToId } from "../../../lib/scroll.js";

const SmartLink = forwardRef(function SmartLink(
  {
    link,
    to = link?.to,
    href = link?.href,
    newTab = link?.newTab,
    disabled = link?.disabled,
    children,
    onClick,
    ...props
  },
  ref
) {
  const { pathname } = useLocation();
  if (disabled)
    return (
      <span aria-disabled="true" {...props}>
        {children}
      </span>
    );
  if (to) {
    const [path, hash] = to.split("#");
    const samePage = hash && (path || "/") === pathname;
    const handle = (event) => {
      onClick?.(event);
      if (
        !samePage ||
        newTab ||
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      event.preventDefault();
      window.history.pushState(null, "", `#${hash}`);
      requestAnimationFrame(() => scrollToId(hash));
    };
    return (
      <Link
        ref={ref}
        to={to}
        onClick={handle}
        {...(newTab ? { target: "_blank", rel: "noreferrer" } : {})}
        {...props}
      >
        {children}
      </Link>
    );
  }
  const url = resolveHref(href);
  const blank = newTab ?? isExternal(url);
  return (
    <a
      ref={ref}
      href={url}
      onClick={onClick}
      {...(blank ? { target: "_blank", rel: "noreferrer" } : {})}
      {...props}
    >
      {children}
    </a>
  );
});

export default SmartLink;
