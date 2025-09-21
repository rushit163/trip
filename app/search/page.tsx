"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Users, Calendar, Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/navbar";
import packagesData from "@/data/packages.json";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchReferences, setSearchReferences] = useState<string[]>([]);

  // Filter state
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [durationRange, setDurationRange] = useState([1, 20]);
  const [selectedRating, setSelectedRating] = useState(0);

  // Results state
  const [filteredPackages, setFilteredPackages] = useState(packagesData);

  // Use refs to track previous values to prevent infinite loops
  const prevSearchParamsRef = useRef<string>("");

  // Initialize from URL parameters only when they actually change
  useEffect(() => {
    const currentSearchParams = searchParams.toString();
    // Only update if search params actually changed
    if (currentSearchParams !== prevSearchParamsRef.current) {
      const query = searchParams.get("q") || "";
      const refs = searchParams.get("refs") || "";
      setSearchQuery(query);

      // Reset filters when search params change (new search)
      setSortBy("relevance");
      setPriceRange([0, 200000]);
      setDurationRange([1, 20]);
      setSelectedRating(0);

      setIsInitialized(true);
      prevSearchParamsRef.current = currentSearchParams;
    }
  }, [searchParams]);

  // Perform search function
  const performSearch = useCallback(
    async (query: string, references: string[], filters: any) => {
      setIsLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      let results = packagesData;

      // Filter by search terms
      if (query || references.length > 0) {
        const searchTerms = [query, ...references].filter(Boolean);
        results = packagesData.filter((pkg) =>
          searchTerms.some(
            (term) =>
              pkg.title.toLowerCase().includes(term.toLowerCase()) ||
              pkg.location.some((loc) =>
                loc.toLowerCase().includes(term.toLowerCase())
              ) ||
              pkg.nation.some((nation) =>
                nation.toLowerCase().includes(term.toLowerCase())
              ) ||
              pkg.continent.toLowerCase().includes(term.toLowerCase()) ||
              pkg.region.toLowerCase().includes(term.toLowerCase())
          )
        );
      }

      // Apply filters
      results = results.filter((pkg) => {
        const matchesPrice =
          pkg.price >= filters.priceRange[0] &&
          pkg.price <= filters.priceRange[1];
        const matchesDuration =
          pkg.duration >= filters.durationRange[0] &&
          pkg.duration <= filters.durationRange[1];

        return matchesPrice && matchesDuration;
      });

      // Apply sorting
      if (filters.sortBy === "price-low") {
        results.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === "price-high") {
        results.sort((a, b) => b.price - a.price);
      } else if (filters.sortBy === "duration") {
        results.sort((a, b) => a.duration - b.duration);
      }

      setFilteredPackages(results);
      setIsLoading(false);
    },
    []
  );

  // Trigger search when dependencies change
  useEffect(() => {
    if (isInitialized) {
      performSearch(searchQuery, searchReferences, {
        sortBy,
        priceRange,
        durationRange,
        selectedRating,
      });
    }
  }, [
    searchQuery,
    searchReferences,
    sortBy,
    priceRange,
    durationRange,
    selectedRating,
    isInitialized,
    performSearch,
  ]);

  // Show loading screen until initialized
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar currentPage="search" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading search...</p>
          </div>
        </div>
      </div>
    );
  }

  const removeReference = (ref: string) => {
    setSearchReferences((prev) => prev.filter((r) => r !== ref));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar currentPage="search" />

      <main className="flex-1">
        <div className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Filter className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-blue-600">
                      Filters
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Sort By */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Sort By
                      </Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="price-low">
                            Price: Low to High
                          </SelectItem>
                          <SelectItem value="price-high">
                            Price: High to Low
                          </SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                          <SelectItem value="duration">Duration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Price Range: ₹{priceRange[0].toLocaleString()} - ₹
                        {priceRange[1].toLocaleString()}
                      </Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={50000}
                        min={0}
                        step={1000}
                        className="w-full"
                      />
                    </div>

                    {/* Duration Range */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Duration: {durationRange[0]} - {durationRange[1]} days
                      </Label>
                      <Slider
                        value={durationRange}
                        onValueChange={setDurationRange}
                        max={20}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Minimum Rating
                      </Label>
                      <Select
                        value={selectedRating.toString()}
                        onValueChange={(value) =>
                          setSelectedRating(Number(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Any Rating</SelectItem>
                          <SelectItem value="4">4+ Stars</SelectItem>
                          <SelectItem value="4.5">4.5+ Stars</SelectItem>
                          <SelectItem value="4.8">4.8+ Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Search References */}
              {searchReferences.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {searchReferences.map((ref, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                        onClick={() => removeReference(ref)}
                      >
                        {ref}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-blue-600">
                    {searchQuery || searchReferences.length > 0
                      ? "Search Results"
                      : "All Packages"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {isLoading
                      ? "Searching..."
                      : `${filteredPackages.length} packages found`}
                  </p>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* Results Grid */}
              {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPackages.map((pkg) => (
                    <Card
                      key={pkg.id}
                      className="overflow-hidden border-blue-200 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="relative">
                        <Image
                          src={pkg.image || "/placeholder.svg"}
                          alt={pkg.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-blue-600">
                            {pkg.title}
                          </h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1">{pkg.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {pkg.nation.join(", ")} •{" "}
                            {pkg.location.slice(0, 2).join(", ")}
                            {pkg.location.length > 2 &&
                              ` +${pkg.location.length - 2} more`}
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
                            <span className="text-gray-600 text-sm">
                              {" "}
                              / person
                            </span>
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
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isLoading && filteredPackages.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No packages found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
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
      </main>
    </div>
  );
}
