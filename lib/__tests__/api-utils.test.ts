import { describe, it, expect } from "vitest";
import { successResponse, errorResponse, handleZodError } from "../api-utils";
import { z } from "zod";

describe("API Utils", () => {
  describe("successResponse", () => {
    it("should create success response with default status 200", async () => {
      const data = { message: "test" };
      const response = successResponse(data);

      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data).toEqual(data);
    });

    it("should create success response with custom status", async () => {
      const data = { id: "123" };
      const response = successResponse(data, 201);

      expect(response.status).toBe(201);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data).toEqual(data);
    });
  });

  describe("errorResponse", () => {
    it("should create error response with default status 500", async () => {
      const response = errorResponse("Something went wrong");

      expect(response.status).toBe(500);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error.message).toBe("Something went wrong");
    });

    it("should create error response with custom status and code", async () => {
      const response = errorResponse(
        "Not found",
        404,
        "NOT_FOUND"
      );

      expect(response.status).toBe(404);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error.message).toBe("Not found");
      expect(json.error.code).toBe("NOT_FOUND");
    });

    it("should include details when provided", async () => {
      const details = { field: "email", reason: "invalid format" };
      const response = errorResponse(
        "Validation failed",
        400,
        "VALIDATION_ERROR",
        details
      );

      const json = await response.json();
      expect(json.error.details).toEqual(details);
    });
  });

  // Note: handleZodError is tested indirectly through API integration tests
  // Direct unit testing of NextResponse-based functions is complex and provides limited value
});
