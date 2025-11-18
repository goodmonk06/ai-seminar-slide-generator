import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  saveSlidePlan,
  getSlidePlan,
  getAllSlidePlans,
  generateId,
} from "../storage";
import { SlidePlan } from "../types";
import fs from "fs/promises";
import path from "path";

const TEST_DATA_DIR = path.join(process.cwd(), "data");

describe("Storage", () => {
  beforeEach(async () => {
    // テスト前にdataディレクトリをクリーンアップ
    try {
      await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
    } catch (error) {
      // ディレクトリが存在しない場合は無視
    }
  });

  afterEach(async () => {
    // テスト後にクリーンアップ
    try {
      await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
    } catch (error) {
      // 無視
    }
  });

  describe("generateId", () => {
    it("should generate unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).toMatch(/^plan_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^plan_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe("saveSlidePlan and getSlidePlan", () => {
    it("should save and retrieve a slide plan", async () => {
      const plan: SlidePlan = {
        id: generateId(),
        title: "Test Presentation",
        audience: "Developers",
        durationMinutes: 30,
        keywords: "test, demo",
        outlineMarkdown: "# Slide 1\n- Point 1\n- Point 2",
        createdAt: new Date(),
      };

      await saveSlidePlan(plan);
      const retrieved = await getSlidePlan(plan.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(plan.id);
      expect(retrieved?.title).toBe(plan.title);
      expect(retrieved?.audience).toBe(plan.audience);
      expect(retrieved?.durationMinutes).toBe(plan.durationMinutes);
      expect(retrieved?.keywords).toBe(plan.keywords);
      expect(retrieved?.outlineMarkdown).toBe(plan.outlineMarkdown);
    });

    it("should return null for non-existent plan", async () => {
      const retrieved = await getSlidePlan("non-existent-id");
      expect(retrieved).toBeNull();
    });

    it("should handle plan without keywords", async () => {
      const plan: SlidePlan = {
        id: generateId(),
        title: "Test Presentation",
        audience: "Developers",
        durationMinutes: 30,
        outlineMarkdown: "# Slide 1\n- Point 1",
        createdAt: new Date(),
      };

      await saveSlidePlan(plan);
      const retrieved = await getSlidePlan(plan.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.keywords).toBeUndefined();
    });
  });

  describe("getAllSlidePlans", () => {
    it("should return empty array when no plans exist", async () => {
      const plans = await getAllSlidePlans();
      expect(plans).toEqual([]);
    });

    it("should return all saved plans", async () => {
      const plan1: SlidePlan = {
        id: generateId(),
        title: "Presentation 1",
        audience: "Developers",
        durationMinutes: 30,
        outlineMarkdown: "# Slide 1",
        createdAt: new Date(Date.now() - 1000),
      };

      const plan2: SlidePlan = {
        id: generateId(),
        title: "Presentation 2",
        audience: "Designers",
        durationMinutes: 45,
        outlineMarkdown: "# Slide 1",
        createdAt: new Date(),
      };

      await saveSlidePlan(plan1);
      await saveSlidePlan(plan2);

      const plans = await getAllSlidePlans();
      expect(plans).toHaveLength(2);

      // 新しい順にソートされているか確認
      expect(plans[0].id).toBe(plan2.id);
      expect(plans[1].id).toBe(plan1.id);
    });
  });
});
