import { describe, it, expect } from "vitest";
import { SlidePlanInputSchema } from "../types";

describe("SlidePlanInputSchema", () => {
  it("should validate valid input", () => {
    const validInput = {
      title: "機械学習入門",
      audience: "エンジニア初級〜中級",
      durationMinutes: 30,
      keywords: "Python, TensorFlow",
    };

    const result = SlidePlanInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should accept input without optional keywords", () => {
    const validInput = {
      title: "機械学習入門",
      audience: "エンジニア初級〜中級",
      durationMinutes: 30,
    };

    const result = SlidePlanInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should reject empty title", () => {
    const invalidInput = {
      title: "",
      audience: "エンジニア初級〜中級",
      durationMinutes: 30,
    };

    const result = SlidePlanInputSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("should reject title longer than 200 characters", () => {
    const invalidInput = {
      title: "a".repeat(201),
      audience: "エンジニア初級〜中級",
      durationMinutes: 30,
    };

    const result = SlidePlanInputSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("should reject empty audience", () => {
    const invalidInput = {
      title: "機械学習入門",
      audience: "",
      durationMinutes: 30,
    };

    const result = SlidePlanInputSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("should reject duration less than 1", () => {
    const invalidInput = {
      title: "機械学習入門",
      audience: "エンジニア初級〜中級",
      durationMinutes: 0,
    };

    const result = SlidePlanInputSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("should reject duration greater than 180", () => {
    const invalidInput = {
      title: "機械学習入門",
      audience: "エンジニア初級〜中級",
      durationMinutes: 181,
    };

    const result = SlidePlanInputSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("should reject non-integer duration", () => {
    const invalidInput = {
      title: "機械学習入門",
      audience: "エンジニア初級〜中級",
      durationMinutes: 30.5,
    };

    const result = SlidePlanInputSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("should accept duration at boundary values", () => {
    const input1 = {
      title: "機械学習入門",
      audience: "エンジニア初級〜中級",
      durationMinutes: 1,
    };
    const input180 = {
      title: "機械学習入門",
      audience: "エンジニア初級〜中級",
      durationMinutes: 180,
    };

    expect(SlidePlanInputSchema.safeParse(input1).success).toBe(true);
    expect(SlidePlanInputSchema.safeParse(input180).success).toBe(true);
  });
});
