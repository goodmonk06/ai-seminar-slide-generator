import { SlidePlan } from "./types";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

// データディレクトリの初期化
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// スライドプランを保存
export async function saveSlidePlan(plan: SlidePlan): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, `${plan.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(plan, null, 2), "utf-8");
}

// スライドプランを取得
export async function getSlidePlan(id: string): Promise<SlidePlan | null> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(content);
    // DateオブジェクトをDate型に変換
    return {
      ...data,
      createdAt: new Date(data.createdAt),
    };
  } catch {
    return null;
  }
}

// 全てのスライドプランを取得
export async function getAllSlidePlans(): Promise<SlidePlan[]> {
  try {
    await ensureDataDir();
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const plans = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(
          path.join(DATA_DIR, file),
          "utf-8"
        );
        const data = JSON.parse(content);
        return {
          ...data,
          createdAt: new Date(data.createdAt),
        };
      })
    );

    // 作成日時の降順でソート
    return plans.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  } catch {
    return [];
  }
}

// IDを生成
export function generateId(): string {
  return `plan_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
