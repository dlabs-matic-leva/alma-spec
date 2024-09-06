"use client";

import React from 'react';
import { Sidebar, SidebarItem } from 'flowbite-react';
import { HiOutlineHome, HiOutlineUserGroup } from 'react-icons/hi';

export default function MySidebar() {
  return (
    <Sidebar aria-label="Main sidebar" className="w-64 bg-white dark:bg-gray-800">
      <SidebarItem href="/dashboard" icon={HiOutlineHome}>
        Dashboard
      </SidebarItem>
      <SidebarItem href="/accounts" icon={HiOutlineUserGroup}>
        Accounts
      </SidebarItem>
    </Sidebar>
  );
}
