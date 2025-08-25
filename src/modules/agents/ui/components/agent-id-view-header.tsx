"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    

} from "@/components/ui/breadcrumb";
import { ChevronRightIcon, TrashIcon, PencilIcon,  MoreVerticalIcon,  } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Props{
    agentId: string;
    agentName: string;
    onEdit: () => void;
    onRemove: () => void;
}

export const AgentIdViewHeader = ({
    agentId, 
    agentName, 
    onEdit, 
    onRemove}: Props) => {
        return (
            <div className="flex items-center justify-between">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="font-medium text-xl" href={`/agents/${agentId}`}>
                                <Link href={`/agents`}>
                                   My Agents
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRightIcon className="text-foreground text-xl font-medium [&>svg]"/>
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="font-medium text-xl text-foreground" href={`/agents/${agentId}`}>
                                <Link href={`/agents/${agentId}`}>
                                   {agentName}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                    </BreadcrumbList>
                </Breadcrumb>
                {/* Without modal={false},  the dialog that will be opened cause the website to get unclickable */}
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" >
                            <MoreVerticalIcon  />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent  align="end">
                        <DropdownMenuItem onClick={onEdit}>
                            <PencilIcon className="size-4 text-black" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onRemove}>
                            <TrashIcon className="size-4 text-black" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }