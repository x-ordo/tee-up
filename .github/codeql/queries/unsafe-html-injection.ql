/**
 * @name Unsafe HTML injection via React innerHTML property
 * @description Using innerHTML-like properties with user input can lead to XSS
 * @kind problem
 * @problem.severity error
 * @security-severity 8.5
 * @precision high
 * @id js/teeup/unsafe-html-injection
 * @tags security
 *       xss
 *       react
 */

import javascript

/**
 * Finds JSX attributes that set inner HTML content unsafely
 */
class UnsafeHTMLAttribute extends JSXAttribute {
  UnsafeHTMLAttribute() {
    this.getName().matches("%innerHTML%") or
    this.getName().matches("%innerHtml%")
  }
}

/**
 * Checks if the value comes from user input sources
 */
predicate isUserControlled(Expr e) {
  // Props access
  exists(PropAccess pa |
    pa.getAChildExpr*() = e and
    pa.getPropertyName() = "props"
  )
  or
  // URL parameters
  exists(CallExpr call |
    call.getAChildExpr*() = e and
    (
      call.getCalleeName() = "useSearchParams" or
      call.getCalleeName() = "useParams"
    )
  )
  or
  // fetch/API responses without sanitization
  exists(AwaitExpr await |
    await.getAChildExpr*() = e
  )
}

from UnsafeHTMLAttribute attr, Expr valueExpr
where
  valueExpr = attr.getValue().getAChildExpr*() and
  isUserControlled(valueExpr)
select attr,
  "Setting HTML content with potentially user-controlled data may lead to XSS vulnerability. Use a sanitizer like DOMPurify."
