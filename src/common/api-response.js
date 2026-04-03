/**
 * Standardized API Response Wrapper
 */
export class ApiResponse {
  constructor(success, statusCode, message, data = null, meta = null) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }

  static success(data, message = 'Success', statusCode = 200, meta = null) {
    return new ApiResponse(true, statusCode, message, data, meta);
  }

  static error(message = 'Error', statusCode = 500, errors = null) {
    const response = new ApiResponse(false, statusCode, message);
    if (errors) {
      response.errors = errors;
    }
    return response;
  }

  /**
   * Helper for pagination success responses
   */
  static pagination(data, message, total, limit, page, additionalMeta = {}) {
    const records = data || [];
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    const meta = {
      total,
      limit,
      page,
      total_pages: totalPages,
      has_next: hasNext,
      has_previous: hasPrevious,
      ...additionalMeta,
    };

    return ApiResponse.success(records, message, 200, meta);
  }
}

export default ApiResponse;
