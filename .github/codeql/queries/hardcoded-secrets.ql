/**
 * @name Hardcoded secrets or API keys
 * @description Detects hardcoded secrets, API keys, and credentials in source code
 * @kind problem
 * @problem.severity error
 * @security-severity 9.0
 * @precision medium
 * @id js/teeup/hardcoded-secrets
 * @tags security
 *       secrets
 *       credentials
 */

import javascript

/**
 * Identifies string literals that look like secrets
 */
class SecretLiteral extends StringLiteral {
  SecretLiteral() {
    exists(string value | value = this.getValue() |
      // Supabase/Stripe keys
      value.regexpMatch("(?i)^(eyJ|sbp_|sk_live_|sk_test_|pk_live_|pk_test_).*") or
      // JWT tokens
      value.regexpMatch("^eyJ[a-zA-Z0-9_-]*\\.[a-zA-Z0-9_-]*\\.[a-zA-Z0-9_-]*$") or
      // AWS keys
      value.regexpMatch("^(AKIA|ABIA|ACCA|ASIA)[A-Z0-9]{16}$")
    ) and
    // Exclude test/example files
    not this.getFile().getRelativePath().matches("%test%") and
    not this.getFile().getRelativePath().matches("%mock%") and
    not this.getFile().getRelativePath().matches("%example%")
  }
}

/**
 * Variable assignments with secret-like names containing literal values
 */
class SecretVariableAssignment extends VarDef {
  SecretVariableAssignment() {
    exists(string varName | varName = this.getName().toLowerCase() |
      varName.matches("%secret%") or
      varName.matches("%password%") or
      varName.matches("%apikey%") or
      varName.matches("%api_key%") or
      varName.matches("%private_key%") or
      varName.matches("%access_token%")
    ) and
    exists(StringLiteral lit |
      lit = this.getSource() and
      lit.getValue().length() > 10 and
      not lit.getValue().regexpMatch("(?i).*(example|placeholder|your|xxx|test|dummy|fake).*")
    ) and
    not this.getFile().getRelativePath().matches("%test%") and
    not this.getFile().getRelativePath().matches("%mock%")
  }
}

from AstNode node, string message
where
  (node instanceof SecretLiteral and message = "Potential hardcoded secret detected") or
  (node instanceof SecretVariableAssignment and message = "Variable with secret-like name contains hardcoded value")
select node, message
