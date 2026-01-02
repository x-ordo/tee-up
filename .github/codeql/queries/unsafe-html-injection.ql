/**
 * @name Unsafe HTML injection via dangerouslySetInnerHTML
 * @description Using dangerouslySetInnerHTML with user input can lead to XSS
 * @kind problem
 * @problem.severity error
 * @security-severity 8.5
 * @precision medium
 * @id js/teeup/unsafe-html-injection
 * @tags security
 *       xss
 *       react
 */

import javascript
import semmle.javascript.JSX

from JSXAttribute attr
where
  attr.getName() = "dangerouslySetInnerHTML" and
  not attr.getFile().getRelativePath().matches("%test%") and
  not attr.getFile().getRelativePath().matches("%mock%")
select attr, "Usage of dangerouslySetInnerHTML detected. Ensure the content is properly sanitized to prevent XSS."
