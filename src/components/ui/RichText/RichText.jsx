import { parse } from "../../../lib/text.js";
import { fill } from "../../../lib/tokens.js";
import SmartLink from "../SmartLink/SmartLink.jsx";

function Segment({ segment }) {
  switch (segment.kind) {
    case "strong":
      return <strong>{segment.text}</strong>;
    case "em":
      return <em>{segment.text}</em>;
    case "code":
      return <code>{segment.text}</code>;
    case "link":
      return segment.href.startsWith("/") ? (
        <SmartLink to={segment.href} className="inline-link">
          {segment.text}
        </SmartLink>
      ) : (
        <SmartLink href={segment.href} className="inline-link">
          {segment.text}
        </SmartLink>
      );
    case "br":
      return <br />;
    default:
      return segment.text;
  }
}

export default function RichText({ text, values }) {
  if (!text) return null;
  return parse(fill(text, values)).map((segment, index) => (
    <Segment key={index} segment={segment} />
  ));
}
