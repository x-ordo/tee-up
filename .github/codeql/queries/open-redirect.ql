/**
 * @name Open redirect vulnerability
 * @description Redirecting to user-controlled URLs can lead to phishing attacks
 * @kind problem
 * @problem.severity warning
 * @security-severity 6.5
 * @precision medium
 * @id js/teeup/open-redirect
 * @tags security
 *       redirect
 *       phishing
 */

import javascript

/**
 * Identifies redirect function calls in Next.js
 */
class RedirectCall extends CallExpr {
  RedirectCall() {
    this.getCalleeName() = "redirect" or
    this.getCalleeName() = "permanentRedirect" or
    exists(PropAccess pa |
      pa = this.getCallee() and
      (pa.getPropertyName() = "push" or pa.getPropertyName() = "replace") and
      exists(PropAccess router |
        router.getAChildExpr*() = pa.getBase() and
        router.getPropertyName() = "router"
      )
    )
  }
}

/**
 * Checks if URL comes from user-controlled sources
 */
predicate isUserControlledUrl(Expr e) {
  // Search params
  exists(CallExpr call |
    call.getAChildExpr*() = e and
    (
      call.getCalleeName() = "get" or
      call.getCalleeName() = "useSearchParams"
    )
  )
  or
  // Request parameters
  exists(PropAccess pa |
    pa.getAChildExpr*() = e and
    (
      pa.getPropertyName() = "query" or
      pa.getPropertyName() = "params" or
      pa.getPropertyName() = "searchParams"
    )
  )
  or
  // URL from request
  exists(PropAccess pa |
    pa.getAChildExpr*() = e and
    pa.getPropertyName() = "url"
  )
}

/**
 * Checks if URL is validated against allowed domains
 */
predicate hasUrlValidation(RedirectCall call) {
  exists(IfStmt ifStmt |
    ifStmt.getAChildStmt*().getAChildExpr*() = call and
    exists(CallExpr validation |
      validation.getAChildExpr*() = ifStmt.getCondition() and
      (
        validation.getCalleeName() = "startsWith" or
        validation.getCalleeName() = "includes" or
        validation.getCalleeName().matches("%validate%") or
        validation.getCalleeName().matches("%isAllowed%")
      )
    )
  )
}

from RedirectCall call, Expr urlArg
where
  urlArg = call.getArgument(0) and
  isUserControlledUrl(urlArg) and
  not hasUrlValidation(call)
select call,
  "Redirect to user-controlled URL without validation may allow open redirect attacks. Validate against allowed domains."
