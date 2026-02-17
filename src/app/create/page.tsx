"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const FOOD_EXAMPLES = [
  "초밥", "라면", "떡볶이", "삼겹살", "피자", "치킨", "파스타", "김치찌개",
  "햄버거", "냉면", "갈비", "불고기", "제육볶음", "돈까스", "카레", "짜장면",
  "짬뽕", "탕수육", "만두", "순대", "족발", "보쌈", "닭갈비", "곱창", "막창",
  "회", "찜닭", "비빔밥", "불닭", "떡국", "칼국수", "수제비", "국밥", "된장찌개",
  "부대찌개", "순두부", "감자탕", "닭발", "오뎅", "튀김", "샌드위치", "토스트",
  "빙수", "아이스크림", "케이크", "마라탕", "훠궈", "쌀국수", "팟타이", "분짜",
  "타코", "부리또", "나초", "김밥", "호떡", "붕어빵", "와플", "팬케이크", "크로아상", "베이글",
];

function getRandomFive(fullList: string[]): string[] {
  const shuffled = [...fullList].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
}

function SortableItem({
  id,
  value,
  rank,
  onUpdate,
  onRemove,
}: {
  id: string;
  value: string;
  rank: number;
  onUpdate: (v: string) => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 py-2 px-3 rounded-[var(--rounded-sm)] bg-[var(--color-gray-700)] min-w-0 ${
        isDragging ? "opacity-80 z-10 shadow-lg" : ""
      }`}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing p-1 text-[var(--color-gray-400)] hover:text-white touch-none shrink-0"
        {...attributes}
        {...listeners}
        aria-label="드래그하여 순서 변경"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </button>
      <span className="w-6 text-[var(--color-gray-500)] font-medium shrink-0">
        {rank}위
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder={`${rank}위 음식 입력`}
        className="flex-1 min-w-0 py-2 px-3 rounded bg-[var(--color-gray-800)] border border-[var(--color-gray-600)] text-white placeholder:text-[var(--color-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-400)]"
        maxLength={50}
      />
      <button
        type="button"
        onClick={onRemove}
        className="p-1 text-[var(--color-gray-500)] hover:text-[var(--color-red-400)] shrink-0"
        aria-label="삭제"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<string[]>(Array(10).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exampleFoods, setExampleFoods] = useState<string[]>(() =>
    getRandomFive(FOOD_EXAMPLES)
  );

  const refreshExamples = useCallback(() => {
    setExampleFoods(getRandomFive(FOOD_EXAMPLES));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((_, i) => `item-${i}` === active.id);
        const newIndex = prev.findIndex((_, i) => `item-${i}` === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const updateItem = (index: number, value: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = "";
      return next;
    });
  };

  const addFromExample = (food: string) => {
    const firstEmpty = items.findIndex((i) => !i.trim());
    if (firstEmpty >= 0) {
      updateItem(firstEmpty, food);
    } else {
      setItems((prev) => [...prev.slice(0, -1), food]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    const trimmed = items.map((i) => i.trim()).filter(Boolean);
    if (trimmed.length !== 10) {
      setError("음식 10개를 모두 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), items: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "생성 실패");
      sessionStorage.setItem(`editToken_${data.slug}`, data.editToken);
      router.push(`/q/${data.slug}?created=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const filledCount = items.filter((i) => i.trim()).length;

  return (
    <div className="min-h-screen bg-[var(--color-gray-800)]">
      <header className="p-4 flex items-center gap-2">
        <Link
          href="/"
          className="text-[var(--color-gray-400)] hover:text-white transition-colors"
        >
          ←
        </Link>
        <h1 className="text-lg font-bold text-white">문제지 만들기</h1>
      </header>

      <main className="px-6 pb-12 overflow-x-hidden w-full max-w-full box-border">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-full">
          <div>
            <label className="block text-[var(--color-gray-400)] text-sm mb-2">
              퀴즈 제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 태욱의 최애 음식 TOP10"
              className="w-full py-3 px-4 rounded-[var(--rounded-sm)] bg-[var(--color-gray-700)] border border-[var(--color-gray-600)] text-white placeholder:text-[var(--color-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-400)]"
              maxLength={100}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[var(--color-gray-400)] text-sm">
                음식 10개 (드래그로 순서 변경)
              </label>
              <span className="text-[var(--color-gray-500)] text-sm">
                {filledCount}/10
              </span>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((_, i) => `item-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 w-full min-w-0">
                  {items.map((item, i) => (
                    <SortableItem
                      key={`item-${i}`}
                      id={`item-${i}`}
                      value={item}
                      rank={i + 1}
                      onUpdate={(v) => updateItem(i, v)}
                      onRemove={() => removeItem(i)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[var(--color-gray-400)] text-sm">
                💡 음식 예시 (클릭하면 추가)
              </label>
              <button
                type="button"
                onClick={refreshExamples}
                className="text-[var(--color-blue-400)] text-sm font-medium hover:underline"
              >
                🔄 다른 예시 보기
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {exampleFoods.map((food) => (
                <button
                  key={food}
                  type="button"
                  onClick={() => addFromExample(food)}
                  className="py-2 px-3 rounded-[var(--rounded-xs)] bg-[var(--color-gray-700)] text-[var(--color-gray-300)] text-sm hover:bg-[var(--color-blue-400)] hover:text-white transition-colors border border-[var(--color-gray-600)]"
                >
                  {food}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-[var(--color-red-400)] text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-[var(--rounded-md)] bg-[var(--color-blue-400)] text-white font-bold text-lg disabled:opacity-60 hover:bg-[var(--color-blue-500)] transition-colors"
          >
            {loading ? "생성 중..." : "문제지 만들기"}
          </button>
        </form>
      </main>
    </div>
  );
}
