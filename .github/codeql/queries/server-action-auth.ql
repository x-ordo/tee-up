/**
 * @name Server Action missing authentication check
 * @description Server Actions should verify user authentication before performing operations
 * @kind problem
 * @problem.severity warning
 * @security-severity 7.5
 * @precision low
 * @id js/teeup/server-action-missing-auth
 * @tags security
 *       nextjs
 *       server-actions
 */

import javascript

/**
 * Finds files with 'use server' directive
 */
class ServerActionFile extends File {
  ServerActionFile() {
    exists(ExprStmt stmt |
      stmt.getExpr().(StringLiteral).getValue() = "use server" and
      stmt.getFile() = this
    )
  }
}

/**
 * Find functions in server action files that perform mutations without auth
 */
from Function f, ServerActionFile file
where
  f.getFile() = file and
  // Has mutation calls
  exists(CallExpr call |
    call.getEnclosingFunction() = f and
    (
      call.getCalleeName() = "insert" or
      call.getCalleeName() = "update" or
      call.getCalleeName() = "delete" or
      call.getCalleeName() = "upsert"
    )
  ) and
  // No auth check
  not exists(CallExpr authCall |
    authCall.getEnclosingFunction() = f and
    (
      authCall.getCalleeName() = "getUser" or
      authCall.getCalleeName() = "getSession" or
      authCall.getCalleeName() = "auth"
    )
  ) and
  not f.getFile().getRelativePath().matches("%test%")
select f, "Server Action function may be missing authentication check before data mutation."
