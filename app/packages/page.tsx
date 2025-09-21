"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Star,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";
import packagesData from "@/data/packages.json";

const PACKAGES_PER_PAGE = 6;

// Pagination component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-blue-500 text-blue-500 hover:bg-blue-100 disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getVisiblePages().map((page, index) => (
        <div key={index}>
          {page === "..." ? (
            <span className="px-3 py-2 text-gray-500">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page as number)}
              className={
                currentPage === page
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border-blue-500 text-blue-500 hover:bg-blue-100"
              }
            >
              {page}
            </Button>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-blue-500 text-blue-500 hover:bg-blue-100 disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Package card component for reusability
const PackageCard = ({ pkg }: { pkg: (typeof packagesData)[0] }) => (
  <Card className="overflow-hidden border-blue-200 shadow-md hover:shadow-lg transition-shadow">
    <div className="relative">
      <Image
        src={pkg.image || "/placeholder.svg"}
        alt={pkg.title}
        width={400}
        height={300}
        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600 text-white">
        {pkg.region === "Southeast Asia" ? "Popular" : "Heritage"}
      </Badge>
    </div>
    <CardContent className="p-5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-blue-600 line-clamp-2">
          {pkg.title}
        </h3>
      </div>
      <div className="flex items-center text-gray-600 mb-3">
        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
        <span className="text-sm truncate">
          {pkg.nation.join(", ")} • {pkg.location.slice(0, 2).join(", ")}
          {pkg.location.length > 2 && ` +${pkg.location.length - 2} more`}
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm mb-4">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-teal-500" />
          <span>{pkg.duration} days</span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1 text-teal-500" />
          <span>2-4 people</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xl font-bold text-blue-600">
            ₹{pkg.price.toLocaleString()}
          </span>
          <span className="text-gray-600 text-sm"> / person</span>
        </div>
        <Link href={`/packages/${pkg.slug}`}>
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            View Details
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);

export default function PackagesPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Group packages by region
  const packagesByRegion = {
    "Southeast Asia": packagesData.filter(
      (pkg) => pkg.region === "Southeast Asia"
    ),
    "Middle East": packagesData.filter((pkg) => pkg.region === "Middle East"),
    India: packagesData.filter((pkg) => pkg.region === "India"),
    Europe: packagesData.filter((pkg) => pkg.region === "Europe"),
  };

  // Get current packages based on active tab
  const getCurrentPackages = () => {
    switch (activeTab) {
      case "southeast-asia":
        return packagesByRegion["Southeast Asia"];
      case "middle-east":
        return packagesByRegion["Middle East"];
      case "india":
        return packagesByRegion["India"];
      case "europe":
        return packagesByRegion["Europe"];
      default:
        return packagesData;
    }
  };

  const currentPackages = getCurrentPackages();
  const totalPages = Math.ceil(currentPackages.length / PACKAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * PACKAGES_PER_PAGE;
  const paginatedPackages = currentPackages.slice(
    startIndex,
    startIndex + PACKAGES_PER_PAGE
  );

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    const region = searchParams.get("region");
    if (region === "southeast-asia") {
      setActiveTab("southeast-asia");
    } else if (region === "south-asia") {
      setActiveTab("south-asia");
    }
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of packages section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar currentPage="packages" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="h-[40vh] relative">
            <Image
              src="/packagesbg1.jpg"
              alt="Travel packages"
              fill
              className="object-cover brightness-[0.7]"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-3xl px-4">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  Discover Our Travel Packages
                </h1>
                <p className="text-lg md:text-xl mb-6">
                  Explore our carefully curated travel experiences for your next
                  adventure
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="container py-12">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center mb-8">
              <TabsList
                className="
    w-full
    bg-blue-50
    grid grid-cols-2
    md:flex md:justify-center
    p-1
  "
              >
                <TabsTrigger
                  value="all"
                  className="
      flex-1
      bg-blue-50
      data-[state=active]:bg-blue-600
      data-[state=active]:text-white
      transition
    "
                >
                  All Packages ({packagesData.length})
                </TabsTrigger>
                <TabsTrigger
                  value="southeast-asia"
                  className="
      flex-1
      bg-blue-50
      data-[state=active]:bg-blue-600
      data-[state=active]:text-white
      transition
    "
                >
                  Southeast Asia ({packagesByRegion["Southeast Asia"].length})
                </TabsTrigger>
                <TabsTrigger
                  value="middle-east"
                  className="
      flex-1
      bg-blue-50
      data-[state=active]:bg-blue-600
      data-[state=active]:text-white
      transition
    "
                >
                  Middle East ({packagesByRegion["Middle East"].length})
                </TabsTrigger>
                <TabsTrigger
                  value="india"
                  className="
      flex-1
      bg-blue-50
      data-[state=active]:bg-blue-600
      data-[state=active]:text-white
      transition
    "
                >
                  India ({packagesByRegion["India"].length})
                </TabsTrigger>
                <TabsTrigger
                  value="europe"
                  className="
      flex-1
      bg-blue-50
      data-[state=active]:bg-blue-600
      data-[state=active]:text-white
      transition
    "
                >
                  Europe ({packagesByRegion["Europe"].length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Results Summary */}
            <div className="mt-20">
              <p className="text-gray-600 text-center mt-5">
                Showing {startIndex + 1}-
                {Math.min(
                  startIndex + PACKAGES_PER_PAGE,
                  currentPackages.length
                )}{" "}
                of {currentPackages.length} packages
              </p>
            </div>

            <TabsContent value="all" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </TabsContent>

            <TabsContent value="southeast-asia" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </TabsContent>

            <TabsContent value="middle-east" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </TabsContent>
            <TabsContent value="india" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </TabsContent>
            <TabsContent value="europe" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <footer className="bg-blue-600 text-white" id="contact-footer">
        <div className="container py-12 md:py-16">
          <div className="flex flex-col lg:flex-row justify-between gap-8 items-start">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <span className="text-white">Circle</span>
                <span className="text-white">Trip</span>
              </div>
              <p className="text-white/80 mb-4">
                Your trusted partner for unforgettable travel experiences around
                the world.
              </p>
              <div className="flex gap-4">
                {/* <Link href="#" className="text-white/80 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Link> */}
                <Link href="https://www.instagram.com/circletrip_holidays/" className="text-white/80 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </Link>
                {/* <Link href="#" className="text-white/80 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Link> */}
              </div>
            </div>

            {/* <div>
              <h3 className="font-bold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Special Offers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div> */}

            {/* <div>
              <h3 className="font-bold mb-4 text-white">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Cancellation Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white">
                    Customer Support
                  </Link>
                </li>
              </ul>
            </div> */}

            <div>
              <h3 className="font-bold mb-4 text-white">Contact Info</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mt-0.5"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="text-white/80">
                    1572,sector 24, Panipat, Haryana, India, 132103
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mt-0.5"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span className="text-white/80">+91 9518812344</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mt-0.5"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                <span className="text-white/80">holidays.circletrip@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/80">
              &copy; {new Date().getFullYear()} Circle Trip Travel. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
