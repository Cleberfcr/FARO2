-- Migration aditiva. Tabelas limitadas ao fluxo OAuth do conector FARO.
CREATE TABLE IF NOT EXISTS faro_oauth_states (
  state_hash CHAR(64) NOT NULL PRIMARY KEY,
  redirect_uri VARCHAR(2048) NOT NULL,
  return_origin VARCHAR(512) NOT NULL,
  expires_at_ms BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY idx_faro_oauth_states_expiry (expires_at_ms)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS faro_marketplace_connections (
  provider VARCHAR(32) NOT NULL PRIMARY KEY,
  account_id VARCHAR(64) NULL,
  token_bundle_ciphertext MEDIUMTEXT NOT NULL,
  token_bundle_iv CHAR(24) NOT NULL,
  token_bundle_tag CHAR(24) NOT NULL,
  expires_at_ms BIGINT UNSIGNED NOT NULL,
  scope VARCHAR(1024) NULL,
  search_verified TINYINT(1) NOT NULL DEFAULT 0,
  search_tested_at TIMESTAMP(3) NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
