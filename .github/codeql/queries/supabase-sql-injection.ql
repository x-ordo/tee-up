/**
 * @name Potential SQL injection in Supabase RPC calls
 * @description Raw SQL in Supabase RPC calls with user input may be vulnerable to SQL injection
 * @kind problem
 * @problem.severity error
 * @security-severity 9.0
 * @precision medium
 * @id js/teeup/supabase-sql-injection
 * @tags security
 *       sql-injection
 *       supabase
 */

import javascript

/**
 * Identifies Supabase RPC calls that might execute raw SQL
 */
class SupabaseRpcCall extends CallExpr {
  SupabaseRpcCall() {
    this.getCalleeName() = "rpc" or
    exists(PropAccess pa |
      pa = this.getCallee() and
      pa.getPropertyName() = "rpc"
    )
  }
}

/**
 * Checks if expression contains string concatenation with variables
 */
predicate hasUnsafeStringConcat(Expr e) {
  exists(AddExpr add |
    add.getAChildExpr*() = e and
    exists(VarRef v | v.getAChildExpr*() = add)
  )
  or
  exists(TemplateLiteral tl |
    tl.getAChildExpr*() = e and
    exists(TemplateElement te | te.getParent() = tl)
  )
}

/**
 * Checks if the RPC call has user-controlled parameters
 */
predicate hasUserControlledParam(SupabaseRpcCall call) {
  exists(Expr arg |
    arg = call.getAnArgument() and
    hasUnsafeStringConcat(arg)
  )
}

from SupabaseRpcCall call
where hasUserControlledParam(call)
select call,
  "Supabase RPC call with dynamically constructed parameters may be vulnerable to SQL injection. Use parameterized queries."
