import GeneratedAvatar from "@/components/generated-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,

} from "@/components/ui/drawer"
import { authClient } from "@/lib/auth-client";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export const DashboardUserButton = () => {

    const isMobile = useIsMobile();

    const { data, isPending } = authClient.useSession();

    const router = useRouter();

    const onLogout =() => {
       authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                }
            }
        });

    };

    if (isPending || !data?.user) {
        return null;
    }

    if(isMobile) {
        return (
        <Drawer>
            <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
                 {data.user.image  ? (
                    <Avatar>
                        <AvatarImage src={data.user.image} />
                    </Avatar>

                ) : (
                    <GeneratedAvatar
                        seed={data.user.name}
                        variant="botttsNeutral"
                        className="size-9 mr-3"
                    />
                )}
                <div className="flex flex-col text-left gap-0.5 overflow-hidden flex-1  min-w-0">
                    <p className="text-sm font-semibold truncate">
                        {data.user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {data.user.email || null}
                    </p>
                </div>
                <ChevronDownIcon className="size-4 shrink-0" />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="text-lg font-semibold">
                        {data.user.name || "User"}
                    </DrawerTitle>
                    <DrawerDescription className="text-sm text-muted-foreground">
                        {data.user.email || "No email provided"}
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <Button variant="outline"
                    onClick={() =>{}}>
                        <CreditCardIcon className="size-4 text-black" />
                        Billing 

                    </Button>
                    <Button variant="outline"
                    onClick={onLogout}>
                        <CreditCardIcon className="size-4 text-black" />
                        Logout
                        
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )}


    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
                
                {data.user.image  ? (
                    <Avatar>
                        <AvatarImage src={data.user.image} />
                    </Avatar>

                ) : (
                    <GeneratedAvatar
                        seed={data.user.name}
                        variant="botttsNeutral"
                        className="size-9 mr-3"
                    />
                )}
                <div className="flex flex-col text-left gap-0.5 overflow-hidden flex-1  min-w-0">
                    <p className="text-sm font-semibold truncate">
                        {data.user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {data.user.email || null}
                    </p>
                </div>
                <ChevronDownIcon className="size-4 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-72">
                <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                        <span className="font-medium truncate">{data.user.name || null}</span>
                        <span className="text-sm text-muted-foreground truncate">{data.user.email || null}</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
                    Billing
                    <CreditCardIcon className="ml-auto size-4" />
                </DropdownMenuItem>
                <DropdownMenuItem 
                onClick={onLogout}
                className="cursor-pointer flex items-center justify-between">
                    Logout
                    <LogOutIcon className="ml-auto size-4" />
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
};