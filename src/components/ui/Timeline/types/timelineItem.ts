export interface TimelineItem {
  id: string;
  header: TimelineItemHeader;
  body: TimelineItemBody;
  isCurrent?: boolean;
}

export interface TimelineItemProps extends TimelineItem {
  index: number;
  children?: React.ReactNode;
}

type TimelineItemHeader = {
  title: string;
  url?: string;
  position: string;
  dateRange: string[];
  tags: TimelineItemHeaderTags;
};

export type TimelineItemHeaderTags = {
  other: TimelineItemHeaderTag[];
  main: TimelineItemHeaderTag[];
};

type TimelineItemHeaderTag = {
  id: string;
  title: string;
  styles: {
    color: string;
    background: string;
  };
};

type TimelineItemBody = {
  description: Record<string, string>;
  post?: React.ReactNode;
};

export type TimelineItemHeaderProps = {
  id: string;
  index: number;
  title: string;
  position: string;
  dateRange: string[];
  tags: TimelineItemHeaderTags;
  url?: string;
  isCurrent?: boolean;
};

export type TimelineItemDescriptionHightlightedProps = {
  children: React.ReactNode;
  color: string;
  id: string;
};
