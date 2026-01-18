import { ComingSoon } from '@/app/(main)/store/components/coming-soon';
import { createClient } from '@/lib/supabase/server';

interface Props {
  searchParams: Promise<{
    search: string;
  }>;
}

export default async function StorePage({ searchParams }: Props) {
  return <ComingSoon />;
}
