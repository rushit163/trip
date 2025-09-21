"use client";

import type React from "react";
import axios from "axios";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ca } from "date-fns/locale";

interface InquiryFormProps {
  packageTitle: string;
  packagePrice: number;
  packageDuration: number;
  children: React.ReactNode;
}

export function InquiryForm({
  packageTitle,
  packagePrice,
  packageDuration,
  children,
}: InquiryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    title: packageTitle,
    price: packagePrice,
    duration: packageDuration,
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   const handleSubmit =  async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   // Prepare the complete inquiry data
  //   const inquiryData = {
  //     ...formData,
  //     packageDetails: {
  //       title: packageTitle,
  //       price: packagePrice,
  //       duration: packageDuration,
  //     },
  //     submittedAt: new Date().toISOString(),
  //   };

  //   console.log("Submitting to Google Apps Script...");
  //   console.log("Inquiry Form Submission:", inquiryData);

  //   const res = await fetch("https://script.google.com/macros/s/AKfycby6lKTzLBmcZxdmBCiP-InRk_BbfPMogeg56ezR5egvswburlMQMID1edGHwUiEeG_a/exec", {
  //       method: "POST",
  //       body: JSON.stringify(inquiryData),
  //     })
  //       .then(res => res.text())
  //       .then(data => {
  //         alert("Form submitted successfully!");
  //       })
  //       .catch(err => {
  //         console.error(err);
  //         alert("Something went wrong.");
  //       });
  //   console.log("Response from Google Apps Script:", res);
  //   // Close the dialog
  //   setIsOpen(false);

  //   // Reset form
  //   setFormData({
  //     name: "",
  //     email: "",
  //     phone: "",
  //   });

  //   setIsSubmitting(false);

  //   // Redirect to home page
  //   router.push("/");
  // };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    const GSHEET_URL: string = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL || "https://your-default-url.com";
    fetch(
      GSHEET_URL,
      {
        method: "POST",
        body: JSON.stringify(formData),
      }
    )
      .then((res) => res.text())
      .then((data) => {
        alert("Form submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          title: packageTitle,
          price: packagePrice,
          duration: packageDuration,
        });
        setIsSubmitting(false);
        setIsOpen(false);
        router.push("/");
        return;
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
        alert("Something went wrong. Please try again later.");
        setIsSubmitting(false);
        setIsOpen(false);
        return;
      });


  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-blue-600">Package Inquiry</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Package Details (Read-only) */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Package Details
            </Label>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <Input
                value={packageTitle}
                readOnly
                className="mb-2 bg-white border-blue-200 text-gray-600 cursor-not-allowed"
              />
              <div className="flex gap-2">
                <Input
                  value={`₹${packagePrice.toLocaleString()}`}
                  readOnly
                  className="bg-white border-blue-200 text-gray-600 cursor-not-allowed"
                />
                <Input
                  value={`${packageDuration} days`}
                  readOnly
                  className="bg-white border-blue-200 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-blue-100" />

          {/* Personal Information */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Your Information
            </Label>

            <div>
              <Label htmlFor="name" className="text-sm text-gray-600">
                Full Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
                className="border-blue-200 focus-visible:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm text-gray-600">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
                className="border-blue-200 focus-visible:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm text-gray-600">
                Phone Number *
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
                className="border-blue-200 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <Separator className="bg-blue-100" />

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </div>
        </form>

        <div className="text-xs text-gray-500 text-center mt-4">
          Our travel experts will contact you within 24 hours to discuss your
          requirements.
        </div>
      </DialogContent>
    </Dialog>
  );
}
