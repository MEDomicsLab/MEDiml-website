import { fill } from "../../../lib/tokens.js";
import Icon from "../Icon/Icon.jsx";
import SmartLink from "../SmartLink/SmartLink.jsx";

export default function MenuLink({
  link,
  iconSize = 18,
  arrowSize = 16,
  fallbackIcon,
  arrowClassName,
  ...props
}) {
  const icon = link.icon ?? fallbackIcon;
  return (
    <SmartLink link={link} {...props}>
      {icon && <Icon name={icon} size={iconSize} />}
      <span>{fill(link.label)}</span>
      <Icon
        name={link.to ? "arrowRight" : "arrowUpRight"}
        size={arrowSize}
        className={arrowClassName}
      />
    </SmartLink>
  );
}
