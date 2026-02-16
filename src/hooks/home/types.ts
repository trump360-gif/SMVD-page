export interface Section {
  id: string;
  pageId: string;
  type: string;
  title: string;
  content: Record<string, unknown> | null;
  order: number;
  exhibitionItems?: ExhibitionItem[];
  workPortfolios?: WorkPortfolio[];
}

export interface ExhibitionItem {
  id: string;
  sectionId: string;
  year: string;
  mediaId: string;
  order: number;
  media?: { id: string; filename: string; filepath: string };
}

export interface WorkPortfolio {
  id: string;
  sectionId: string;
  title: string;
  category: string;
  mediaId: string;
  order: number;
  media?: { id: string; filename: string; filepath: string };
}
