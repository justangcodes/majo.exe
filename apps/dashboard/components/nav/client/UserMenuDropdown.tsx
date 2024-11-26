"use client";

import { signOut } from "next-auth/react";
import Image from "@/components/client/shared/Image";
import { Menu, MenuLink, MenuItem, MenuButton, MenuItems, MenuArrow } from "@/components/client/shared/Menu";
import { Icons, iconVariants } from "@/components/Icons";
import { getSession } from "@/lib/session";
import React from "react";

type UserSession = Awaited<ReturnType<typeof getSession>>;

export const UserMenuDropdown = React.forwardRef<HTMLDivElement, UserSession & { className?: string }>(({ user }, ref) => {
 if (!user) return null;

 return (
  <Menu ref={ref}>
   <MenuButton>
    <Image width="32" height="32" quality={100} className="-ml-1 size-6 shrink-0 rounded-full" src={user.avatar} loading="lazy" alt={`${user.name} Avatar`} />
    <span>{user.global_name || user.name}</span>
    <MenuArrow />
   </MenuButton>
   <MenuItems>
    <div className="mb-2">
     <MenuLink href="/dashboard">
      <Icons.dashboard className={iconVariants({ variant: "button", className: "ml-1" })} /> Dashboard
     </MenuLink>
     <MenuLink href="/user/profile">
      <Icons.User className={iconVariants({ variant: "button", className: "ml-1" })} /> Profile
     </MenuLink>
    </div>

    <div className="pt-1">
     <MenuLink href="/discord">
      <Icons.help className={iconVariants({ variant: "button", className: "ml-1" })} /> Support
     </MenuLink>
     <MenuItem
      onClick={(e) => {
       e.preventDefault();
       signOut({ redirect: true, callbackUrl: "/" });
      }}
      variant={{ variant: "action" }}
     >
      <Icons.logout className={iconVariants({ variant: "button", className: "ml-1" })} /> Logout
     </MenuItem>
    </div>
   </MenuItems>
  </Menu>
 );
});
