"use client";

import { useState, useCallback, useEffect } from "react";
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

const STORAGE_KEY = "my-food-test-draft";

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
      className={`flex items-center gap-3 p-3 ios-card transition-all ${
        isDragging ? "opacity-50 z-10 shadow-2xl scale-[1.02]" : ""
      }`}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing p-1 text-[var(--text-tertiary)] hover:text-white touch-none shrink-0"
        {...attributes}
        {...listeners}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="9" cy="5" r="1.5" fill="currentColor" />
          <circle cx="9" cy="12" r="1.5" fill="currentColor" />
          <circle cx="9" cy="19" r="1.5" fill="currentColor" />
          <circle cx="15" cy="5" r="1.5" fill="currentColor" />
          <circle cx="15" cy="12" r="1.5" fill="currentColor" />
          <circle cx="15" cy="19" r="1.5" fill="currentColor" />
        </svg>
      </button>
      <div className="flex flex-col items-center justify-center min-w-[40px] h-10 rounded-full bg-[var(--tertiary-bg)]">
         <span className="text-[var(--color-primary)] font-bold text-sm">{rank}</span>
         <span className="text-[10px] text-[var(--text-tertiary)] uppercase leading-none">위</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder={`${rank}위 음식 입력`}
        className="flex-1 min-w-0 py-2 px-1 bg-transparent text-white font-medium placeholder:text-[var(--text-tertiary)] focus:outline-none"
        maxLength={50}
      />
      <button
        type="button"
        onClick={onRemove}
        className="p-2 mr-1 rounded-full text-[var(--text-tertiary)] hover:bg-[var(--tertiary-bg)] hover:text-[var(--color-error)] transition-colors shrink-0"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
  const [showToast, setShowToast] = useState(false);
  const [exampleFoods, setExampleFoods] = useState<string[]>([]);

  useEffect(() => {
    setExampleFoods(getRandomFive(FOOD_EXAMPLES));
    
    // Load from local storage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { title: sTitle, items: sItems } = JSON.parse(saved);
        if (sTitle || sItems.some((i: string) => i)) {
          setTitle(sTitle || "");
          setItems(sItems || Array(10).fill(""));
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save to local storage
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, items }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, items]);

  const handleReset = () => {
    if (confirm("모든 내용을 지우고 새로 시작할까요?")) {
      setTitle("");
      setItems(Array(10).fill(""));
      localStorage.removeItem(STORAGE_KEY);
    }
  };

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
      
      localStorage.removeItem(STORAGE_KEY);
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
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col items-center">
      <header className="fixed top-0 w-full max-w-lg ios-glass z-50 px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--tertiary-bg)] transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-white">문제지 만들기</h1>
        <button
          onClick={handleReset}
          className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--color-error)] transition-colors"
        >
          초기화
        </button>
      </header>

      <main className="w-full max-w-lg px-6 pt-24 pb-32">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-4">
            <label className="block text-[var(--text-secondary)] text-sm font-semibold px-1">
              테스트 제목
            </label>
            <div className="ios-card p-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 션의 최애 음식 TOP10"
                className="w-full bg-transparent text-xl font-bold text-white placeholder:text-[var(--text-tertiary)] focus:outline-none"
                maxLength={100}
              />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[var(--text-secondary)] text-sm font-semibold">
                음식 10개 나열 (끌어서 순서 조절)
              </label>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                <span className="text-[var(--text-secondary)] text-xs font-mono">
                  {filledCount}/10
                </span>
              </div>
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
                <div className="space-y-3">
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
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[var(--text-secondary)] text-sm font-semibold">
                💡 이런 음식은 어때요?
              </label>
              <button
                type="button"
                onClick={refreshExamples}
                className="text-[var(--color-primary-light)] text-xs font-bold hover:opacity-80 flex items-center gap-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M23 4v6h-6M1 20v-6h6" />
                  <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                </svg>
                새로고침
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {exampleFoods.map((food) => (
                <button
                  key={food}
                  type="button"
                  onClick={() => addFromExample(food)}
                  className="py-2.5 px-4 rounded-full bg-[var(--tertiary-bg)] text-white text-sm font-medium hover:bg-[var(--color-primary)] transition-all border border-[var(--glass-border)] active:scale-95"
                >
                  {food}
                </button>
              ))}
            </div>
          </section>

          <div className="fixed bottom-0 left-0 right-0 p-6 ios-glass z-50 flex flex-col items-center">
             <div className="w-full max-w-lg">
                {error && (
                  <p className="text-[var(--color-error)] text-center text-sm font-medium mb-4 animate-bounce">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-lg ios-button disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      생성 중...
                    </div>
                  ) : (
                    "테스트 만들기 완료"
                  )}
                </button>
             </div>
          </div>
        </form>
      </main>

      {showToast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 ios-glass px-6 py-3 rounded-full shadow-2xl z-[100] border border-[var(--color-primary-light)]/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <p className="text-white text-sm font-medium whitespace-nowrap">
            📝 이전 작성 중인 내용을 불러왔어요
          </p>
        </div>
      )}
    </div>
  );
}
