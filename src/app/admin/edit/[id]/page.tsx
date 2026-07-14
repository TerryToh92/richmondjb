import Link from "next/link";
import { notFound } from "next/navigation";
import ListingForm from "@/components/admin/ListingForm";
import { getListingById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditListing({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-10">
      <Link href="/admin" className="text-sm text-muted hover:text-ink">
        ← 返回房源列表
      </Link>
      <h1 className="font-display mt-3 mb-6 text-2xl font-extrabold text-ink">
        编辑：{listing.title}
      </h1>
      <ListingForm initial={listing} />
    </main>
  );
}
