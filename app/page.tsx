import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin, Star, Users, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import packagesData from "@/data/packages.json";

export default function HomePage() {
  // Get only 3 featured packages for better performance
  const featuredPackages = {
    "Southeast Asia": packagesData
      .filter((pkg) => pkg.region === "Southeast Asia")
      .slice(0, 3), // 2 from Southeast Asia
    India: packagesData.filter((pkg) => pkg.region === "India").slice(0, 3), // 1 from South Asia
  };

  // Popular destinations based on our 4 countries
  const popularDestinations = [
    {
      name: "Bali",
      country: "Indonesia",
      image: "/balibg1.jpg",
      searchQuery: "bali",
    },
    {
      name: "Singapore",
      country: "Singapore",
      image: "/singaporebg1.jpg",
      searchQuery: "singapore",
    },
    {
      name: "Bangkok",
      country: "Thailand",
      image: "/bangkokbg1.jpg",
      searchQuery: "bangkok",
    },
    {
      name: "Delhi",
      country: "India",
      image: "/delhibg1.jpg",
      searchQuery: "india",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar currentPage="home" />

      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/bg1.jpg"
              alt="Beautiful travel destination"
              fill
              className="object-cover brightness-[0.6]"
              priority
            />
          </div>
          <div className="container relative z-10 py-24 md:py-32 lg:py-40">
            <div className="max-w-3xl space-y-5 text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Discover the World's Most Amazing Places
              </h1>
              <p className="text-lg md:text-xl">
                Find and book your perfect travel experience with our curated
                packages to destinations worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/packages">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Explore Packages
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-blue-600">
                Popular Destinations
              </h2>
              <p className="text-gray-600 mt-2">
                Explore our most sought-after travel locations
              </p>
            </div>
            <Link href="/packages">
              <Button
                variant="link"
                className="hidden md:flex items-center text-blue-600"
              >
                View all destinations <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <Link
                href={`/search?q=${encodeURIComponent(
                  destination.searchQuery
                )}`}
                key={index}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg shadow-md border border-blue-100">
                  <div className="aspect-[3/4]">
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-4 text-white">
                    <h3 className="text-xl font-bold">{destination.name}</h3>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{destination.country}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-8 md:hidden">
            <Link href="/packages">
              <Button
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                View All Destinations
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-blue-50 py-12 md:py-16">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-blue-600">
                Featured Travel Packages
              </h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                Discover our carefully curated travel experiences for your next
                adventure
              </p>
            </div>

            <Tabs defaultValue="southeast-asia" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white">
                  <TabsTrigger
                    value="southeast-asia"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Southeast Asia
                  </TabsTrigger>
                  <TabsTrigger
                    value="india"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    India
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="southeast-asia" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6  mx-auto">
                  {featuredPackages["Southeast Asia"].map((pkg) => (
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
                          loading="lazy"
                        />
                        <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600 text-white">
                          Popular
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-blue-600">
                            {pkg.title}
                          </h3>
                        </div>
                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {pkg.nation.join(", ")}
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
                <div className="flex justify-center">
                  <Link href="/packages?region=southeast-asia">
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      View All Southeast Asia Packages
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="india" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6  mx-auto">
                  {featuredPackages["India"].map((pkg) => (
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
                          loading="lazy"
                        />
                        <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600 text-white">
                          Heritage
                        </Badge>
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
                            {pkg.nation.join(", ")}
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
                <div className="flex justify-center">
                  <Link href="/packages?region=India">
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      View All India's Packages
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Rest of the homepage sections remain the same but optimized... */}
        {/* <section className="container py-12 md:py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-blue-600">Special Offers</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Limited-time deals and exclusive packages for your next adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-xl shadow-md border border-blue-100">
              <Image
                src="/bg.jpeg"
                alt="Summer special offer"
                width={600}
                height={400}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                <div className="p-6 text-white max-w-md">
                  <Badge className="mb-3 bg-orange-500 hover:bg-orange-600 text-white">Limited Time</Badge>
                  <h3 className="text-2xl font-bold mb-2">Summer Special: 20% Off</h3>
                  <p className="mb-4">Book any summer package before June 30th and get 20% off your entire booking.</p>
                  <Button
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white"
                  >
                    View Offer
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl shadow-md border border-blue-100">
              <Image
                src="/bg.jpeg"
                alt="Family package deal"
                width={600}
                height={400}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                <div className="p-6 text-white max-w-md">
                  <Badge className="mb-3 bg-orange-500 hover:bg-orange-600 text-white">Family Deal</Badge>
                  <h3 className="text-2xl font-bold mb-2">Kids Stay Free</h3>
                  <p className="mb-4">Book a family package and kids under 12 stay and eat free at selected resorts.</p>
                  <Button
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white"
                  >
                    View Offer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* <section className="bg-blue-50 py-12 md:py-16">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-blue-600">What Our Travelers Say</h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Read testimonials from our satisfied customers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Sarah Johnson",
                  location: "New York, USA",
                  image: "/bg.jpeg",
                  text: "The Bali Paradise Escape exceeded all my expectations. The accommodations were luxurious, the guides were knowledgeable, and the itinerary was perfectly balanced between activities and relaxation.",
                  rating: 5,
                },
                {
                  name: "David Chen",
                  location: "Toronto, Canada",
                  image: "/bg.jpeg",
                  text: "Our family had an amazing time on the Thailand Island Hopping tour. The kids loved the beaches and boat trips, while we appreciated the seamless organization and attention to detail.",
                  rating: 4.8,
                },
                {
                  name: "Emma Wilson",
                  location: "London, UK",
                  image: "/bg.jpeg",
                  text: "The Golden Triangle tour was a dream come true. Every city had its own charm, and our guide made the history come alive. I'll definitely be booking with Circle Trip again!",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card key={index} className="p-6 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="font-medium text-blue-600">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(testimonial.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                  </div>
                  <p className="text-sm text-gray-600">{testimonial.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section> */}

        {/* <section className="container py-12 md:py-16">
          <div className="rounded-xl bg-blue-50 p-8 md:p-10 border border-blue-100">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4 text-blue-600">Subscribe to Our Newsletter</h2>
                <p className="mb-6 text-gray-600">
                  Stay updated with our latest travel deals, new destinations, and travel tips. Subscribe to our
                  newsletter and get exclusive offers directly to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Enter your email"
                    className="bg-white border-blue-200 focus-visible:ring-blue-500"
                  />
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Subscribe</Button>
                </div>
                <p className="text-xs mt-3 text-gray-500">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                </p>
              </div>
              <div className="hidden md:block">
                <Image
                  src="/bg.jpeg"
                  alt="Newsletter subscription"
                  width={400}
                  height={300}
                  className="rounded-lg shadow-md border border-blue-100"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section> */}
      </main>

      <footer className="bg-blue-600 text-white">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <Link href="#" className="text-white/80 hover:text-white">
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
                </Link>
                <Link href="#" className="text-white/80 hover:text-white">
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
                <Link href="#" className="text-white/80 hover:text-white">
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
                </Link>
              </div>
            </div>

            <div>
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
            </div>

            <div>
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
            </div>

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
                    123 Travel Street, City, Country
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
                  <span className="text-white/80">+1 (234) 567-8900</span>
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
