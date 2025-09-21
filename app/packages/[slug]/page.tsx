"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Calendar,
  Clock,
  Coffee,
  MapPin,
  Star,
  Users,
  Utensils,
  Wifi,
  Bed,
  Bus,
  Plane,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/navbar";
import packagesData from "@/data/packages.json";
import { InquiryForm } from "@/components/inquiry-form";
import React from "react";

// Get package data by slug
const getPackageData = (slug: string) => {
  return packagesData.find((pkg) => pkg.slug === slug) || packagesData[0]; // Fallback to first package if not found
};

// Pagination component
const GalleryPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-blue-500 text-blue-500 hover:bg-blue-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-blue-500 text-blue-500 hover:bg-blue-100"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const runtime = 'edge';


export default function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const packageData = getPackageData(slug);

  // Pagination state
  const [destinationPage, setDestinationPage] = useState(1);
  const [stayPage, setStayPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);

  // Items per page
  const itemsPerPage = 6;

  // Calculate total pages for each category
  const destinationTotalPages = Math.ceil(
    (packageData.gallery?.destination?.length || 0) / itemsPerPage
  );

  // Get current page items
  const getCurrentPageItems = (items: string[] = [], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const currentDestinationImages = getCurrentPageItems(
    packageData.gallery?.destination,
    destinationPage
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-blue-50 py-2">
          <div className="container">
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link href="/packages" className="hover:text-blue-600">
                Packages
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-blue-600 font-medium">
                {packageData.title}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative">
          <div className="h-[50vh] md:h-[60vh] relative">
            <Image
              src={packageData.image || "/placeholder.svg"}
              alt={packageData.title}
              fill
              className="object-cover brightness-[0.8]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
              <div className="container">
                <Badge className="mb-3 bg-orange-500 hover:bg-orange-600 text-white">
                  Featured Package
                </Badge>
                <h1 className="text-3xl md:text-5xl font-bold mb-2">
                  {packageData.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{packageData.nation.join(", ")}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{packageData.duration} days</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">
                    ₹{packageData.price.toLocaleString()}
                  </span>
                  <span className="text-lg">/ person</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Package Content */}
        <section className="container py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                {/* Fixed: Made tabs scrollable on small screens */}
                <div className="relative">
                  <TabsList className="w-full flex-nowrap overflow-x-auto justify-start mb-6 bg-blue-50 pb-px">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-shrink-0"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="itinerary"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-shrink-0"
                    >
                      Itinerary
                    </TabsTrigger>
                    <TabsTrigger
                      value="inclusions"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-shrink-0"
                    >
                      Inclusions
                    </TabsTrigger>
                    {packageData.gallery && (
                      <TabsTrigger
                        value="gallery"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-shrink-0"
                      >
                        Gallery
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">
                      Package Overview
                    </h2>
                    <p className="text-gray-600">{packageData.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 text-blue-600">
                      Package Highlights
                    </h3>
                    <ul className="grid gap-2">
                      {packageData.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 text-blue-600">
                      Destinations Covered
                    </h3>
                    <div className="grid gap-2">
                      {packageData.location.map((location, index) => (
                        <div key={index} className="flex items-start">
                          <MapPin className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{location}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Itinerary Tab */}
                <TabsContent value="itinerary" className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4 text-blue-600">
                    Day-by-Day Itinerary
                  </h2>

                  <div className="space-y-6">
                    {packageData.itinerary.map((day, index) => (
                      <div
                        key={index}
                        className="border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div className="flex items-center mb-2 md:mb-0">
                            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                              <span className="font-bold">{day.day}</span>
                            </div>
                            <h3 className="text-xl font-bold text-blue-600">
                              {day.title}
                            </h3>
                          </div>
                          {day.meals && day.meals.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              {day.meals.includes("Breakfast") && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Coffee className="h-4 w-4 mr-1" />
                                  <span>Breakfast</span>
                                </div>
                              )}
                              {day.meals.includes("Lunch") && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Utensils className="h-4 w-4 mr-1" />
                                  <span>Lunch</span>
                                </div>
                              )}
                              {day.meals.includes("Dinner") && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Utensils className="h-4 w-4 mr-1" />
                                  <span>Dinner</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 mb-4">{day.description}</p>

                        {day.accommodation && day.accommodation !== "N/A" && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Bed className="h-4 w-4 mr-1" />
                            <span>Accommodation: {day.accommodation}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Inclusions & Exclusions Tab */}
                <TabsContent value="inclusions" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">
                      What's Included
                    </h2>
                    <ul className="grid gap-2">
                      {packageData.inclusions.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">
                      What's Not Included
                    </h2>
                    <ul className="grid gap-2">
                      {packageData.exclusions.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* Gallery Tab */}
                {packageData.gallery && (
                  <TabsContent value="gallery" className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">
                      Package Gallery
                    </h2>

                    {packageData.gallery.destination &&
                      packageData.gallery.destination.length > 0 && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {currentDestinationImages.map((image, index) => (
                              <div
                                key={index}
                                className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-blue-200"
                              >
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`${
                                    packageData.title
                                  } - Destination image ${index + 1}`}
                                  fill
                                  className="object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            ))}
                          </div>
                          {destinationTotalPages > 1 && (
                            <GalleryPagination
                              currentPage={destinationPage}
                              totalPages={destinationTotalPages}
                              onPageChange={setDestinationPage}
                            />
                          )}
                        </div>
                      )}
                  </TabsContent>
                )}
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <Card className="border-blue-200 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-600">
                    Book This Package
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price</span>
                      <span className="font-medium">
                        ₹{packageData.price.toLocaleString()} per person
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">
                        {packageData.duration} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Group Size</span>
                      <span className="font-medium">2-12 people</span>
                    </div>

                    <Separator className="bg-blue-100" />

                    <div className="flex justify-between font-bold">
                      <span>Total From</span>
                      <span className="text-xl text-blue-600">
                        ₹{packageData.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <InquiryForm
                    packageTitle={packageData.title}
                    packagePrice={packageData.price}
                    packageDuration={packageData.duration}
                  >
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      Inquire Now
                    </Button>
                  </InquiryForm>
                </CardContent>
              </Card>

              {/* Package Features */}
              <Card className="border-blue-200 shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-600">
                    Package Features
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-teal-500 mr-2" />
                      <span className="text-sm">
                        {packageData.duration} days
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-teal-500 mr-2" />
                      <span className="text-sm">2-12 people</span>
                    </div>
                    <div className="flex items-center">
                      <Bed className="h-5 w-5 text-teal-500 mr-2" />
                      <span className="text-sm">Hotels included</span>
                    </div>
                    <div className="flex items-center">
                      <Utensils className="h-5 w-5 text-teal-500 mr-2" />
                      <span className="text-sm">Meals included</span>
                    </div>
                    <div className="flex items-center">
                      <Bus className="h-5 w-5 text-teal-500 mr-2" />
                      <span className="text-sm">Private transport</span>
                    </div>
                    <div className="flex items-center">
                      <Plane className="h-5 w-5 text-teal-500 mr-2" />
                      <span className="text-sm">Airport transfers</span>
                    </div>
                    <div className="flex items-center">
                      <Wifi className="h-5 w-5 text-teal-500 mr-2" />
                      <span className="text-sm">Free WiFi</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-teal-500 mr-2" />
                      <span className="text-sm">Tour guide</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Need Help */}
              <Card className="border-blue-200 shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-600">
                    Need Help?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Have questions about this package? Our travel experts are
                    ready to assist you.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
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
                        className="h-5 w-5 text-blue-600 mr-2"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span>+1 (234) 567-8900</span>
                    </div>
                    <div className="flex items-center">
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
                        className="h-5 w-5 text-blue-600 mr-2"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Related Packages */}
        {packageData.relatedPackages &&
          packageData.relatedPackages.length > 0 && (
            <section className="bg-blue-50 py-12">
              <div className="container">
                <h2 className="text-2xl font-bold mb-6 text-blue-600">
                  You May Also Like
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packageData.relatedPackages.map((pkg, index) => (
                    <Card
                      key={index}
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
                        </div>
                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="text-sm truncate">
                            {pkg.nation.join(", ")} •{" "}
                            {pkg.location.slice(0, 2).join(", ")}
                            {pkg.location.length > 2 &&
                              ` +${pkg.location.length - 2} more`}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm mb-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{pkg.duration} days</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
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
              </div>
            </section>
          )}
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
