import type {LinkItem, LinkType} from "@/model/link/type";
import {LinkCard} from "./card/LinkCard";
import {NewsLinkCard} from "./card/NewsLinkCard";
import {YouTubeLinkCard} from "./card/YouTubeLinkCard";
import React from "react";

interface LinkCardComponentProps {
  link: LinkItem;
}

export const getLinkCardComponent = (linkType: LinkType): React.FC<LinkCardComponentProps> => {
  switch (linkType) {
    case "News":
      return NewsLinkCard;
    case "Video":
      return YouTubeLinkCard;
    case "Blog":
    case "Default":
    default:
      return LinkCard;
  }
};
