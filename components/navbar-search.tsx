"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Star, Calendar, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import packagesData from "@/data/packages.json"

interface NavbarSearchProps {
  onClose?: () => void
}

export function NavbarSearch({ onClose }: NavbarSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof packagesData>([])
  const [isSearchActive, setIsSearchActive] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Search function
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsSearchActive(false)
      return
    }

    const lowercaseQuery = query.toLowerCase()
    const results = packagesData.filter((pkg) => {
      // Search in package title
      const titleMatch = pkg.title.toLowerCase().includes(lowercaseQuery)

      // Search in nations
      const nationMatch = pkg.nation.some((nation) => nation.toLowerCase().includes(lowercaseQuery))

      // Search in locations
      const locationMatch = pkg.location.some((location) => location.toLowerCase().includes(lowercaseQuery))

      console.log(locationMatch)
      // Search in continent and region
      const continentMatch = pkg.continent.toLowerCase().includes(lowercaseQuery)
      const regionMatch = pkg.region.toLowerCase().includes(lowercaseQuery)

      return titleMatch || nationMatch || locationMatch || continentMatch || regionMatch
    })

    setSearchResults(results.slice(0, 5)) // Limit to 5 results in dropdown
    setIsSearchActive(true)
  }

  // Handle search input change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery)
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchActive(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle form submission (Enter key)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchActive(false)
      onClose?.()

      const searchUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}`

      // If we're already on the search page, force a refresh
      if (window.location.pathname === "/search") {
        window.location.href = searchUrl
      } else {
        router.push(searchUrl)
      }
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setIsSearchActive(false)
    onClose?.()
  }

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Form */}
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search destinations, packages, or countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-white border-blue-200 focus-visible:ring-blue-500 w-full"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isSearchActive && (
        <div className="absolute top-full left-0 right-0 bg-white border border-blue-200 rounded-lg shadow-lg mt-2 max-h-96 overflow-y-auto z-50">
          {searchResults.length > 0 ? (
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-3">
                Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                {searchResults.length === 5 && " (showing top 5)"}
              </div>
              <div className="space-y-3">
                {searchResults.map((pkg) => (
                  <Link key={pkg.id} href={`/packages/${pkg.slug}`} onClick={clearSearch} className="block">
                    <Card className="hover:shadow-md transition-shadow border-blue-100">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative w-20 h-16 flex-shrink-0">
                            <Image
                              src={pkg.image || "/placeholder.svg"}
                              alt={pkg.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-blue-600 text-sm mb-1 truncate">{pkg.title}</h3>
                            <div className="flex items-center text-xs text-gray-600 mb-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate">
                                {pkg.nation.join(", ")} • {pkg.location.slice(0, 2).join(", ")}
                                {pkg.location.length > 2 && ` +${pkg.location.length - 2} more`}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  <span>{pkg.rating}</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1 text-teal-500" />
                                  <span>{pkg.duration} days</span>
                                </div>
                              </div>
                              <div className="text-sm font-bold text-blue-600">₹{pkg.price.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              {searchQuery.trim() && (
                <div className="mt-4 pt-3 border-t border-blue-100">
                  <button
                    onClick={() => {
                      const searchUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}`
                      clearSearch()

                      // If we're already on the search page, force a refresh
                      if (window.location.pathname === "/search") {
                        window.location.href = searchUrl
                      } else {
                        router.push(searchUrl)
                      }
                    }}
                    className="block text-center w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 bg-white"
                    >
                      View all results for "{searchQuery}"
                    </Button>
                  </button>
                </div>
              )}
            </div>
          ) : searchQuery.trim() ? (
            <div className="p-6 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No packages found for "{searchQuery}"</p>
              <p className="text-xs mt-1">Try searching for destinations, countries, or package names</p>
              <div className="mt-4">
                <Link href={`/search?q=${encodeURIComponent(searchQuery.trim())}`} onClick={clearSearch}>
                  <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-white">
                    Search all packages
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
