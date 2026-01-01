/**
 * @name Hardcoded secrets or API keys
 * @description Detects hardcoded secrets, API keys, and credentials in source code
 * @kind problem
 * @problem.severity error
 * @security-severity 9.0
 * @precision high
 * @id js/teeup/hardcoded-secrets
 * @tags security
 *       secrets
 *       credentials
 */

import javascript

/**
 * Patterns that indicate secret values
 */
predicate isSecretPattern(string value) {
  // Supabase keys (start with specific prefixes)
  value.regexpMatch("(?i)^(eyJ|sbp_|sk_live_|sk_test_|pk_live_|pk_test_).*") or
  // API keys with common formats
  value.regexpMatch("(?i)^(api[_-]?key|apikey|secret[_-]?key)[_-]?[=:]?\\s*.{20,}") or
  // JWT tokens
  value.regexpMatch("^eyJ[a-zA-Z0-9_-]*\\.[a-zA-Z0-9_-]*\\.[a-zA-Z0-9_-]*$") or
  // AWS keys
  value.regexpMatch("(?i)^(AKIA|ABIA|ACCA|ASIA)[A-Z0-9]{16}$") or
  // Generic long secrets
  (value.length() > 30 and value.regexpMatch("^[a-zA-Z0-9+/=_-]+$") and not value.regexpMatch("^(https?://|data:|/|\\.).*"))
}

/**
 * Variable names that suggest secrets
 */
predicate isSecretVariableName(string name) {
  name.regexpMatch("(?i).*(secret|password|api[_-]?key|auth[_-]?token|private[_-]?key|access[_-]?token|credentials?).*")
}

from VarDef def, string value
where
  exists(StringLiteral lit |
    lit = def.getSource() and
    value = lit.getValue() and
    (isSecretPattern(value) or
     (isSecretVariableName(def.getName()) and value.length() > 10))
  ) and
  // Exclude test files
  not def.getFile().getRelativePath().matches("%test%") and
  not def.getFile().getRelativePath().matches("%mock%") and
  // Exclude example/placeholder values
  not value.regexpMatch("(?i).*(example|placeholder|your[_-]?|xxx|test|dummy|fake).*")
select def, "Potential hardcoded secret in variable '" + def.getName() + "'"
