"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SlidePlan } from "@/lib/types";

export default function PlanPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [plan, setPlan] = useState<SlidePlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`/api/plans/${id}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error?.message || "データの取得に失敗しました");
        }

        setPlan(data.data.plan);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "エラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const handleCopy = async () => {
    if (!plan) return;

    try {
      await navigator.clipboard.writeText(plan.outlineMarkdown);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    if (!plan) return;

    const blob = new Blob([plan.outlineMarkdown], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${plan.title.replace(/[^\w\s-]/g, "")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              エラー
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "スライドプランが見つかりません"}
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors"
            >
              トップページに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            新しいスライドを生成
          </button>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 text-white">
            <h1 className="text-3xl font-bold mb-3">{plan.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>対象: {plan.audience}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{plan.durationMinutes}分</span>
              </div>
              {plan.keywords && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span>{plan.keywords}</span>
                </div>
              )}
            </div>
          </div>

          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                {copySuccess ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    コピー完了
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    クリップボードにコピー
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Markdownをダウンロード
              </button>
            </div>
          </div>

          <div className="px-8 py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              スライド構成案
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
                {plan.outlineMarkdown}
              </pre>
            </div>
          </div>

          <div className="px-8 py-6 bg-blue-50 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              次のステップ
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>
                上記のMarkdownをクリップボードにコピーまたはダウンロード
              </li>
              <li>
                Keynote、PowerPoint、Google
                Slidesなどのツールで新規プレゼンテーションを作成
              </li>
              <li>各スライドの見出しとポイントを転記</li>
              <li>デザインやビジュアルを追加してプレゼンを完成</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
