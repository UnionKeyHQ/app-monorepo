// sync storage does not support extension background, don't use it in production, but only for development
export enum EAppSyncStorageKeys {
  rrt = 'rrt',
  perf_switch = 'perf_switch',
  unionkey_webembed_config = 'unionkey_webembed_config',
  unionkey_disable_bg_api_serializable_checking = 'unionkey_disable_bg_api_serializable_checking',
  unionkey_perf_timer_log_config = 'unionkey_perf_timer_log_config',
  unionkey_debug_render_tracker = 'unionkey_debug_render_tracker',
  unionkey_db_perf_monitor = 'unionkey_db_perf_monitor',
  unionkey_developer_mode_enabled = 'unionkey_developer_mode_enabled',
  last_unionkey_id_login_email = 'last_unionkey_id_login_email',
  last_scan_qr_code_text = 'last_scan_qr_code_text',
  last_valid_server_time = 'last_valid_server_time',
  last_valid_local_time = 'last_valid_local_time',
}
