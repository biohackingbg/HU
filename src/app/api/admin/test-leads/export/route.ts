import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { quizCategories, type QuizCategoryId } from "@/lib/quiz";

function isCategoryId(value: string | null): value is QuizCategoryId {
  return !!value && value in quizCategories;
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const category = new URL(req.url).searchParams.get("category");
  const leads = await prisma.quizLead.findMany({
    where: isCategoryId(category) ? { category } : {},
    orderBy: { createdAt: "desc" },
  });

  const rows = [
    ["email", "category", "category_label", "created_at"],
    ...leads.map((l) => [
      l.email,
      l.category,
      isCategoryId(l.category) ? quizCategories[l.category].label : l.category,
      l.createdAt.toISOString(),
    ]),
  ];
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="quiz-leads-${Date.now()}.csv"`,
    },
  });
}
