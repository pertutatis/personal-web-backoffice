export interface Serie {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface SerieListResponse {
  data: Serie[];
  total: number;
  page: number;
  limit: number;
}

export interface SerieCreatePayload {
  title: string;
  description: string;
}

export interface SerieUpdatePayload {
  title?: string;
  description?: string;
}
