export interface RecordOut {
  id: number;
  record_id_src: number | null;
  import_batch_id: number | null;
  prod_date: string | null;
  work_order_no: string | null;
  work_center_no: string | null;
  work_center_name: string | null;
  station_name: string | null;
  stock_name: string | null;
  shift: number | null;
  availability: number | null;
  performance: number | null;
  quality: number | null;
  oee: number | null;
  run_time: number | null;
  down_time: number | null;
  planned_down: number | null;
  unplanned_down: number | null;
  produced_qty: number | null;
  scrap_qty: number | null;
  oee_recomputed: number | null;
  validation_status: string;
  issue_count: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface PaginatedRecords {
  items: RecordOut[];
  page: number;
  size: number;
  total: number;
  total_pages: number;
}

export interface FilterOptions {
  stations: string[];
  stock_names: string[];
  work_centers: string[];
}
