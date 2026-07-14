import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  type Listing,
  type ListingStatus,
  type ImageMeta,
  LISTINGS as SEED,
} from "@/lib/listings";
import { orderListings } from "@/lib/ordering";

/**
 * 数据访问层。优先读 Supabase；若未配置 / 出错 / 表为空，回退到本地种子数据，
 * 保证站点在后台还没建好前也不会空白或挂掉。
 */

type Row = Record<string, unknown>;

function s(v: unknown, d = ""): string {
  return typeof v === "string" ? v : d;
}
function arr(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]) : [];
}
function imageMetaArr(v: unknown): ImageMeta[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((m) => {
      const o = (m ?? {}) as Record<string, unknown>;
      return {
        url: s(o.url),
        kind: s(o.kind, "other") as ImageMeta["kind"],
        altEn: s(o.alt_en),
        altZh: s(o.alt_zh),
        captionEn: s(o.caption_en),
        captionZh: s(o.caption_zh),
      };
    })
    .filter((m) => m.url);
}

export function rowToListing(r: Row): Listing {
  return {
    id: s(r.id) || undefined,
    slug: s(r.slug),
    title: s(r.title),
    titleEn: s(r.title_en),
    developer: s(r.developer, "Richmond Asia"),
    projectType: (s(r.project_type, "new_launch") as Listing["projectType"]),
    category: (s(r.category, "high_rise") as Listing["category"]),
    area: s(r.area),
    city: s(r.city, "Johor Bahru"),
    priceFrom: typeof r.price_from === "number" ? r.price_from : 0,
    bedrooms: s(r.bedrooms),
    bathrooms: s(r.bathrooms),
    sizeSqft: s(r.size_sqft),
    landSize: s(r.land_size),
    tenure: s(r.tenure),
    highlights: arr(r.highlights),
    highlightsEn: arr(r.highlights_en),
    description: s(r.description),
    descriptionEn: s(r.description_en),
    images: arr(r.images),
    imageMeta: imageMetaArr(r.image_meta),
    lat: typeof r.lat === "number" ? r.lat : 0,
    lng: typeof r.lng === "number" ? r.lng : 0,
    builtYear: s(r.built_year),
    parking: s(r.parking),
    furnishing: s(r.furnishing),
    facing: s(r.facing),
    amenities: arr(r.amenities),
    amenitiesEn: arr(r.amenities_en),
    kpkt: {
      developerLicenseNo: s(r.kpkt_developer_license),
      adPermitNo: s(r.kpkt_ad_permit),
      validUntil: s(r.kpkt_valid_until),
      filled: r.kpkt_filled === true,
    },
    status: (s(r.status, "draft") as ListingStatus),
    approval: {
      approvedBy: (r.approved_by as string) ?? null,
      approvedAt: (r.approved_at as string) ?? null,
    },
    updatedAt: s(r.updated_at),
  };
}

const seedPublic = () =>
  SEED.filter((l) => l.status === "approved" || l.status === "sold");

/** 公开页：已批准 / 已售房源 */
export async function getPublicListings(): Promise<Listing[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .in("status", ["approved", "sold"])
      .order("updated_at", { ascending: false });
    if (error || !data || data.length === 0) return orderListings(seedPublic());
    return orderListings((data as Row[]).map(rowToListing));
  } catch {
    return orderListings(seedPublic());
  }
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (!error && data) return rowToListing(data as Row);
  } catch {
    /* fall through to seed */
  }
  return SEED.find((l) => l.slug === slug) ?? null;
}

/** 后台：按 id 取单个房源（编辑用） */
export async function getListingById(id: string): Promise<Listing | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return rowToListing(data as Row);
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  projectSlug: string | null;
  message: string;
  source: string;
  gclid: string | null;
  createdAt: string;
}

/** 后台：收到的询盘（需登录，RLS 控制） */
export async function getLeads(): Promise<Lead[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as Row[]).map((r) => ({
    id: s(r.id),
    name: s(r.name),
    phone: s(r.phone),
    projectSlug: (r.project_slug as string) ?? null,
    message: s(r.message),
    source: s(r.source, "website"),
    gclid: (r.gclid as string) ?? null,
    createdAt: s(r.created_at),
  }));
}

/** 后台：全部房源（含草稿/待批），需登录，RLS 控制 */
export async function getAllListings(): Promise<Listing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return (data as Row[]).map(rowToListing);
}
