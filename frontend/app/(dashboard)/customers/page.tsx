"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useCustomers } from "@/hooks/use-customers";
import { useSearch, usePagination } from "@/hooks/use-pagination";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { PageLoading } from "@/components/shared/page-loading";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";

export default function CustomersPage() {
  const { search, setSearch, debouncedSearch } = useSearch();
  const { page, setPage, resetPage } = usePagination();
  const { data, isLoading, error, refetch } = useCustomers({ page, limit: 12, q: debouncedSearch || undefined });

  if (isLoading) return <PageLoading />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        <Link href="/customers/new"><Button><Plus className="h-4 w-4" />Add Customer</Button></Link>
      </div>

      <SearchBar value={search} onChange={(v) => { setSearch(v); resetPage(); }} placeholder="Search customers..." />

      {data && data.items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((customer) => (
            <Link key={customer.customer_id} href={`/customers/${customer.customer_id}`}>
              <Card className="transition-all hover:shadow-md hover:border-primary/30">
                <CardContent className="flex items-center gap-4 p-6">
                  <Avatar name={customer.full_name} size="lg" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{customer.full_name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{customer.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">Joined {formatDate(customer.created_at)}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No customers found" />
      )}

      {data && <Pagination pagination={data.pagination} onPageChange={setPage} />}
    </div>
  );
}
