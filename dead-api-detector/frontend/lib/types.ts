export interface ApiRecord {
  id:               string;
  name:             string;
  url:              string;
  category:         string;
  status:           "up" | "down" | "unknown";
  response_time_ms: number;
  last_checked:     string | null;
  created_at:       string;
}

export interface CheckAllResponse {
  total:            number;
  up:               number;
  down:             number;
  duration_seconds: number;
  results:          CheckResult[];
}

export interface CheckResult {
  api_id:           string;
  name:             string;
  status:           string;
  response_time_ms: number;
  status_code:      number | null;
  error:            string | null;
}
