import Link from "next/link";
import ListingForm from "@/components/admin/ListingForm";

export default function NewListing() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-10">
      <Link href="/admin" className="text-sm text-muted hover:text-ink">
        ← 返回房源列表
      </Link>
      <h1 className="font-display mt-3 mb-6 text-2xl font-extrabold text-ink">
        加新房源 New Listing
      </h1>
      <ListingForm />
    </main>
  );
}
