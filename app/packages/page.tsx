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

      <footer className="bg-blue-600 text-white border-t">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-xl mb-4 md:mb-0">
              <span className="text-white">Circle</span>
              <span className="text-white">Trip</span>
            </div>
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
