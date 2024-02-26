"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ActivitySquare,
  DumbbellIcon,
  FileText,
  Grid2X2Icon,
  LayoutDashboardIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/user-nav";
import { Settings } from "./ui/icons";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  { name: "Plans", href: "/dashboard/plans", icon: FileText },
  {
    name: "Activities",
    href: "/dashboard/activities",
    icon: ActivitySquare,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative bg-background mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-autopx-6 p-4">
                  <div className="flex h-16 shrink-0 items-center justify-center">
                    <DumbbellIcon className="w-8 h-8" />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="space-y-1 w-full">
                          {navigation.map((item) => (
                            <li
                              key={item.name}
                              className={cn(
                                item.href === pathname
                                  ? "bg-foreground text-background shadow-md"
                                  : "",
                                "p-2 !pl-3 rounded-md"
                              )}
                            >
                              <Link
                                href={item.href}
                                className="flex flex-row gap-2 items-center"
                              >
                                <item.icon
                                  /* className={cn(
                                      item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                                      'h-6 w-6 shrink-0'
                                    )} */
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <aside className="hidden relative lg:flex lg:inset-y-0 lg:w-72 lg:flex-col max-w-[230px] p-4 w-full md:flex justify-center flex-col h-[100svh]">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto">
          <div className="flex h-16 shrink-0 items-center justify-center">
            <DumbbellIcon className="w-8 h-8" />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="space-y-1 w-full">
                  {navigation.map((item) => (
                    <li
                      key={item.name}
                      className={cn(
                        item.href === pathname
                          ? "bg-foreground text-background shadow-md"
                          : "",
                        "p-2 !pl-3 rounded-md"
                      )}
                    >
                      <Link
                        href={item.href}
                        className="flex flex-row gap-2 items-center"
                      >
                        <item.icon
                          /* className={cn(
                                      item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                                      'h-6 w-6 shrink-0'
                                    )} */
                          className="w-5 h-5"
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li
                className={cn(
                  "/dashboard/settings" === pathname
                    ? "bg-foreground text-background shadow-md"
                    : "",
                  "p-2 !pl-3 rounded-md mt-auto"
                )}
              >
                <Link
                  href="/dashboard/settings"
                  className="flex flex-row gap-2 items-center"
                >
                  <Settings
                    className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                    aria-hidden="true"
                  />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <div className="sticky top-0 z-40 flex justify-between items-center gap-x-6 bg-background px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-foreground-200 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <MenuIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        {/* <div className="flex-1 text-sm font-semibold leading-6 text-white">Dashboard</div> */}
        {/* <UserNav /> */}
      </div>
    </div>
  );
}
