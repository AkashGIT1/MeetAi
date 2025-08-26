import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useMeetingsFilter } from "../../hooks/use-meetings-filters";


export const MeetingsSearchFilter = () => {
  const [filter, setFilter] = useMeetingsFilter();

  return (
    <div className="relative">
      <Input
        placeholder="Filter By Name"
        className="h-9 bg-white w-[200px] pl-7"
        value={filter.search}
        onChange={(e) => setFilter({search: e.target.value})}
      />
      <SearchIcon className="size-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
    </div>
  );
};
