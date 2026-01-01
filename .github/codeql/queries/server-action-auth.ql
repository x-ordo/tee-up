/**
 * @name Server Action missing authentication check
 * @description Server Actions should verify user authentication before performing operations
 * @kind problem
 * @problem.severity warning
 * @security-severity 7.5
 * @precision medium
 * @id js/teeup/server-action-missing-auth
 * @tags security
 *       nextjs
 *       server-actions
 */

import javascript

/**
 * Identifies functions marked with 'use server' directive
 */
class ServerActionFunction extends Function {
  ServerActionFunction() {
    exists(ExprStmt stmt |
      stmt.getExpr().(StringLiteral).getValue() = "use server" and
      stmt.getParent+() = this.getBody()
    )
    or
    exists(ExprStmt stmt |
      stmt.getExpr().(StringLiteral).getValue() = "use server" and
      stmt.getFile() = this.getFile() and
      stmt.getLocation().getStartLine() < this.getLocation().getStartLine()
    )
  }
}

/**
 * Checks if function contains authentication verification
 */
predicate hasAuthCheck(Function f) {
  exists(CallExpr call |
    call.getEnclosingFunction() = f and
    (
      // Common auth check patterns
      call.getCalleeName() = "getUser" or
      call.getCalleeName() = "getSession" or
      call.getCalleeName() = "auth" or
      call.getCalleeName().matches("%authenticate%") or
      call.getCalleeName().matches("%checkAuth%") or
      call.getCalleeName().matches("%verifyAuth%") or
      call.getCalleeName().matches("%requireAuth%")
    )
  )
  or
  exists(PropAccess prop |
    prop.getEnclosingFunction() = f and
    prop.getPropertyName() = "auth"
  )
}

/**
 * Checks if function performs data mutations
 */
predicate performsDataMutation(Function f) {
  exists(CallExpr call |
    call.getEnclosingFunction() = f and
    (
      // Supabase mutations
      call.getCalleeName() = "insert" or
      call.getCalleeName() = "update" or
      call.getCalleeName() = "delete" or
      call.getCalleeName() = "upsert" or
      // Database operations
      call.getCalleeName().matches("%create%") or
      call.getCalleeName().matches("%save%") or
      call.getCalleeName().matches("%remove%")
    )
  )
}

from ServerActionFunction f
where
  performsDataMutation(f) and
  not hasAuthCheck(f)
select f,
  "Server Action '" + f.getName() +
    "' performs data mutation but may be missing authentication check"
