import { useEffect, useRef } from "react";
import { isPrerenderedRoute } from "./prerender.js";
import { applyHead, headTags } from "./seo.js";

export default function usePageHead(page) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current && isPrerenderedRoute()) {
      first.current = false;
      return;
    }
    first.current = false;
    applyHead(headTags(page));
  }, [page]);
}
