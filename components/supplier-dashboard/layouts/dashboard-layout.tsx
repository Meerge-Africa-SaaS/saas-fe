"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  ChevronDown,
  LayoutDashboard,
  ShoppingCart,
  Package,
  CreditCard,
  Store,
  Settings,
  LogOut,
  Menu,
  Search,
  Bell,
  User2,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LineChart } from "@/components/charts/LineChart";

// Dynamically import the navbar with no SSR
const DashboardNavbar = dynamic(() => import('./navBar'), {
  ssr: false
});

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Extract the slug from the pathname
  const slug = pathname.split('/')[2] || '';

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = sidebarItems.find(item => {
      if (item.children) {
        return item.children.some(child => child.href === pathname);
      }
      return item.href === pathname;
    });
    return currentItem?.label || '';
  };

  const handleItemClick = (item: any) => {
    if (item.children) {
      toggleDropdown(item.label);
      // Navigate to the first child's href when clicking the parent
      router.push(item.href);
    } else {
      router.push(item.href);
    }
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sidebarItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      href: `/supplier/${slug}`,
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      label: "Orders",
      href: `/supplier/${slug}/orders/recent`,
      children: [
        {
          label: "Recent orders",
          href: `/supplier/${slug}/orders/recent`
        },
        {
          label: "Confirmed orders",
          href: `/supplier/${slug}/orders/confirmed`
        },
        {
          label: "Orders history",
          href: `/supplier/${slug}/orders/history`
        }
      ]
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "Inventory",
      href: `/supplier/${slug}/inventory/stores`,
      children: [
        {
          label: "Stores",
          href: `/supplier/${slug}/inventory/stores`
        },
        {
          label: "New stock items",
          href: `/supplier/${slug}/inventory/new`
        },
        {
          label: "All stock items",
          href: `/supplier/${slug}/inventory/all`
        }
      ]
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      label: "Payments",
      href: `/supplier/${slug}/payments/sales`,
      children: [
        {
          label: "Sales processed",
          href: `/supplier/${slug}/payments/sales`
        },
        {
          label: "All Payments",
          href: `/supplier/${slug}/payments/all`
        }
      ]
    },
    {
      icon: <Store className="w-5 h-5" />,
      label: "Quick market",
      href: `/supplier/${slug}/quick-market/price-prediction`,
      children: [
        {
          label: "Price prediction",
          href: `/supplier/${slug}/quick-market/price-prediction`
        },
        {
          label: "Farm products",
          href: `/supplier/${slug}/quick-market/farm-products`
        },
        {
          label: "Non-farm products",
          href: `/supplier/${slug}/quick-market/non-farm-products`
        },
        {
          label: "Items in cart",
          href: `/supplier/${slug}/quick-market/cart`
        }
      ]
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      href: `/supplier/${slug}/settings`,
    },
    {
      icon: <LogOut className="w-5 h-5" />,
      label: "Sign out",
      href: "/supplier/auth/login",
    },
  ];

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-[324px] h-screen bg-[#0E2254] text-white py-8 z-10">
        {/* Logo */}
        <div className="p-8 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-[200px]">
            <Image src="/images/logo.png" alt="Meerge Logo" width={150} height={60} className="w-full" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-8 px-6 space-y-4">
          {sidebarItems.map((item, index) => (
            <div key={index}>
              <div
                onClick={() => handleItemClick(item)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer",
                  pathname === item.href && "bg-[#1a3166] text-white"
                )}
              >
                {item.icon}
                <span className="text-[16px]">{item.label}</span>
                {item.children && (
                  <ChevronDown 
                    className={cn(
                      "ml-auto h-5 w-5 transition-transform duration-200",
                      openDropdowns[item.label] ? "rotate-180" : ""
                    )}
                  />
                )}
              </div>
              
              {item.children && openDropdowns[item.label] && (
                <div className="ml-8 mt-2 space-y-2">
                  {item.children.map((child, childIndex) => (
                    <div
                      key={childIndex}
                      onClick={() => router.push(child.href)}
                      className={cn(
                        "block px-4 py-3 text-[14px] text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer",
                        pathname === child.href && "bg-[#1a3166] text-white"
                      )}
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[324px]">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between px-8 py-4">
            {pathname === `/supplier/${slug}` ? (
              <div className="relative w-[400px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] rounded-lg outline-none"
                />
              </div>
            ) : (
              <h1 className="text-xl font-medium">{getCurrentPageTitle()}</h1>
            )}

            <div className="flex items-center gap-6">
              <div className="relative">
                <button
                  className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <Bell className="w-5 h-5" />
                </button>
              </div>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center">
                    <User2 className="w-5 h-5" />
                  </div>
                  <span>KaddAgro</span>
                  <ChevronDown className="w-5 h-5" />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border py-2">
                    <div className="px-4 py-3 border-b">
                      <div className="font-medium">My Profile</div>
                      <div className="text-sm text-gray-500">Personal Information</div>
                    </div>
                    <div className="px-4 py-3 border-b">
                      <div className="font-medium">Business Profile</div>
                      <div className="text-sm text-gray-500">Business Information</div>
                    </div>
                    <button className="w-full px-4 py-3 text-left text-red-600 hover:bg-gray-50">
                      SIGN OUT
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="h-[calc(100vh-73px)] overflow-y-auto">
          <div className="p-8 max-w-[1600px] mx-auto">
            {pathname === `/supplier/${slug}` ? (
              <>
                <h1 className="text-2xl font-medium mb-6">Welcome, Kadd Agro,</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-8 mb-8">
                  <div className="bg-gradient-to-r from-[#0E2254] to-blue-600 rounded-2xl p-6 text-white">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg">Total number of Orders</h3>
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <p className="text-4xl font-bold mb-2">1,500</p>
                    <span className="text-sm bg-white/20 px-2 py-1 rounded">+2.1%</span>
                  </div>
                  <div className="bg-white rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg">Confirmed Orders</h3>
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <p className="text-4xl font-bold mb-2">1,450</p>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">+1.8%</span>
                  </div>
                  <div className="bg-white rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg">Total Sales</h3>
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <p className="text-4xl font-bold mb-2">1,400</p>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">+8.0%</span>
                  </div>
                </div>

                {/* Sales Chart */}
                <div className="bg-white rounded-2xl p-6 mb-8">
                  <h2 className="text-xl font-medium mb-4">Sales Statistics</h2>
                  <div className="h-[300px] overflow-hidden">
                    <LineChart />
                  </div>
                </div>

                {/* Bottom Grid */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-[#FF6B00] mb-6">My Top-selling products</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image src="/images/yam.jpg" alt="Yam" width={40} height={40} className="rounded" />
                        </div>
                        <span className="text-lg">Yam</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image src="/images/flour.jpg" alt="Flour" width={40} height={40} className="rounded" />
                        </div>
                        <span className="text-lg">Flour</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image src="/images/semovita.jpg" alt="Semovita" width={40} height={40} className="rounded" />
                        </div>
                        <span className="text-lg">Semovita</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image src="/images/groundnut-oil.jpg" alt="Groundnut Oil" width={40} height={40} className="rounded" />
                        </div>
                        <span className="text-lg">Groundnut Oil</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-[#FF6B00] mb-6">Trending products in Quick-markets</h2>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="bg-gray-100 rounded-lg mb-2 aspect-square relative">
                          <Image 
                            src="/images/mamagold.png" 
                            alt="Bag of rice" 
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="rounded-lg object-contain p-2" 
                            priority
                          />
                        </div>
                        <span className="text-sm font-medium">Bag of rice</span>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-100 rounded-lg mb-2 aspect-square relative">
                          <Image 
                            src="/images/spag.png" 
                            alt="Spaghetti" 
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="rounded-lg object-contain p-2" 
                            priority
                          />
                        </div>
                        <span className="text-sm font-medium">Spaghetti</span>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-100 rounded-lg mb-2 aspect-square relative">
                          <Image 
                            src="/images/peak.png" 
                            alt="Peak Milk" 
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="rounded-lg object-contain p-2" 
                            priority
                          />
                        </div>
                        <span className="text-sm font-medium">Peak Milk</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              children
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
