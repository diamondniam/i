export type LaboratoryProps = {};

export type LaboratoryItemProps = {
  refs?: Record<string, React.RefObject<HTMLDivElement | null>>;
  title: string;
  description: string;
  children: React.ReactNode;
  classNames?: Record<string, string>;
};
