/** 注入 JSON-LD 结构化数据（GEO 关键：让 Google + AI 搜索精准读懂） */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
