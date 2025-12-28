/**
 * Validation Module
 *
 * Zod 기반 입력 검증 및 에러 처리 통합
 *
 * @example
 * ```ts
 * import { validateInput, quickProfileInputSchema } from '@/lib/validations';
 *
 * export async function createQuickProfile(input: unknown) {
 *   const validation = validateInput(quickProfileInputSchema, input);
 *   if (!validation.success) {
 *     return { success: false, error: validation.error };
 *   }
 *   const data = validation.data;
 *   // ... proceed with validated data
 * }
 * ```
 */

import { z, ZodError, ZodSchema } from 'zod';
import { VALIDATION_FAILED, type ErrorCode } from '@/lib/errors/codes';
import { logError, addActionBreadcrumb } from '@/lib/errors/logger';

// Re-export all schemas
export * from './schemas';

/**
 * 검증 결과 타입
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: ErrorCode; details?: string[] };

/**
 * Zod 에러를 사용자 친화적인 메시지 배열로 변환
 */
export function formatZodErrors(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.join('.');
    const message = issue.message;
    return path ? `${path}: ${message}` : message;
  });
}

/**
 * 입력값 검증
 *
 * @param schema - Zod 스키마
 * @param data - 검증할 데이터
 * @param actionName - 액션 이름 (로깅용, 선택사항)
 * @returns 검증 결과
 *
 * @example
 * ```ts
 * const result = validateInput(quickProfileInputSchema, input, 'createQuickProfile');
 * if (!result.success) {
 *   console.log(result.details); // ['name: 이름은 최소 2자 이상이어야 합니다']
 *   return { success: false, error: result.error };
 * }
 * const validData = result.data;
 * ```
 */
export function validateInput<T>(
  schema: ZodSchema<T>,
  data: unknown,
  actionName?: string
): ValidationResult<T> {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (err) {
    if (err instanceof ZodError) {
      const details = formatZodErrors(err);

      // 로깅 (actionName이 제공된 경우)
      if (actionName) {
        addActionBreadcrumb(`${actionName}:validation_failed`, {
          errors: details,
        });
        logError(err, {
          action: actionName,
          metadata: { validationErrors: details },
        });
      }

      return {
        success: false,
        error: VALIDATION_FAILED,
        details,
      };
    }

    // 예상치 못한 에러
    const errorCode = logError(err, { action: actionName || 'validateInput' });
    return { success: false, error: errorCode };
  }
}

/**
 * 안전한 입력값 검증 (에러를 던지지 않음)
 *
 * @param schema - Zod 스키마
 * @param data - 검증할 데이터
 * @returns 검증 결과 또는 undefined
 */
export function safeValidate<T>(
  schema: ZodSchema<T>,
  data: unknown
): T | undefined {
  const result = schema.safeParse(data);
  return result.success ? result.data : undefined;
}

/**
 * 부분 검증 (일부 필드만 검증)
 *
 * @param schema - Zod 스키마
 * @param data - 검증할 데이터
 * @param fields - 검증할 필드 목록
 * @returns 검증 결과
 */
export function validatePartial<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  data: unknown,
  fields: (keyof T)[]
): ValidationResult<Partial<z.infer<z.ZodObject<T>>>> {
  const partialSchema = schema.pick(
    fields.reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      {} as { [K in keyof T]?: true }
    )
  );

  return validateInput(partialSchema, data);
}

/**
 * 배열 요소 검증
 *
 * @param schema - 단일 요소 Zod 스키마
 * @param data - 검증할 배열
 * @param maxItems - 최대 항목 수 (선택사항)
 * @returns 검증 결과
 */
export function validateArray<T>(
  schema: ZodSchema<T>,
  data: unknown,
  maxItems?: number
): ValidationResult<T[]> {
  let arraySchema = z.array(schema);

  if (maxItems) {
    arraySchema = arraySchema.max(maxItems, `최대 ${maxItems}개까지 가능합니다`);
  }

  return validateInput(arraySchema, data);
}

/**
 * ID 검증 헬퍼
 *
 * @param id - 검증할 ID
 * @param fieldName - 필드 이름 (에러 메시지용)
 * @returns 검증 결과
 */
export function validateId(
  id: unknown,
  fieldName: string = 'ID'
): ValidationResult<string> {
  const schema = z.string().uuid(`유효한 ${fieldName} 형식이 아닙니다`);
  return validateInput(schema, id);
}

/**
 * Slug 검증 헬퍼
 *
 * @param slug - 검증할 slug
 * @returns 검증 결과
 */
export function validateSlug(slug: unknown): ValidationResult<string> {
  const schema = z
    .string()
    .min(2, '슬러그는 최소 2자 이상이어야 합니다')
    .max(50, '슬러그는 최대 50자까지 가능합니다')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      '슬러그는 소문자, 숫자, 하이픈만 사용할 수 있습니다'
    );
  return validateInput(schema, slug);
}

/**
 * 이메일 검증 헬퍼
 */
export function validateEmail(email: unknown): ValidationResult<string> {
  const schema = z.string().email('올바른 이메일 형식이 아닙니다');
  return validateInput(schema, email);
}

/**
 * 전화번호 검증 헬퍼 (한국 형식)
 */
export function validatePhone(phone: unknown): ValidationResult<string> {
  const schema = z
    .string()
    .regex(
      /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/,
      '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)'
    );
  return validateInput(schema, phone);
}

/**
 * URL 검증 헬퍼
 */
export function validateUrl(url: unknown): ValidationResult<string> {
  const schema = z.string().url('올바른 URL 형식이 아닙니다');
  return validateInput(schema, url);
}
