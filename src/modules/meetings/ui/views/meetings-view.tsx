"use client"

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {  useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { useMeetingsFilter } from "../../hooks/use-meetings-filters";
import { DataPagination } from "@/components/data-pagination";

export const MeetingsView = () => {
    const router = useRouter();
    const [filters, setFilters] = useMeetingsFilter();

    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
      ...filters,
    }));
  return (
    <div className="overflow-x-auto p-4 mx-4 sm:mx-0">
      <DataTable 
      data={data.items} 
      columns={columns}
      onRowClick={(row) => router.push(`/meetings/${row.id}`)}
      />
      <DataPagination 
      page={filters.page}
      totalPages={data.totalPages}
      onPageChange={(page) => setFilters({page})}
      />
      {data.items.length === 0 && (
                <EmptyState
                  title="No Meetings Found"
                  description="Try creating a new meeting. Each meeting will follow your instructions and can interact with users."
                />
              )}
    </div>
  );
};

export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meetings"
      description="Please wait while we load the meetings."
    />
  );
};

export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="Error Loading Meetings"
      description="There was an error loading the meetings. Please try again later."
    />
  );
};





