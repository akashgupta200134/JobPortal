"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function CandidateSignupForm({ className, ...props }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    skillCategory: "",
    experience: "",
    expectedSalary: "",
    videoProfile: "",
    idUpload: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = {
      ...formData,
      role: "candidate",
      expectedSalary: parseInt(formData.expectedSalary) || 0,
    };

    console.log("Submitting signup data:", submitData);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(submitData),
      });

      const data = await response.json();
      console.log("Signup response:", data);

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Account created successfully!");
        router.push("/JobSeeker/dashboard");
      } else {
        alert(data.message || "Signup failed");
        console.error("Signup failed:", data);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the form below to create your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
          <Input
            id="fullName"
            type="text"
            placeholder="Akash Gupta"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FieldDescription>
            We'll use this to contact you. We will not share your email with
            anyone else.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 9876543210"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <FieldDescription>
            You'll receive an OTP on this number. We will not share your number
            with anyone else.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
          <Input
            id="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="gender">Gender</FieldLabel>
          <select
            id="gender"
            className="border rounded-md p-2 w-full"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>

        <Field>
          <FieldLabel htmlFor="skillCategory">Skill Category</FieldLabel>
          <select
            id="skillCategory"
            className="border rounded-md p-2 w-full"
            value={formData.skillCategory}
            onChange={handleChange}
            required
          >
            <option value="">Select Skill</option>
            <option value="softwareDevelopment">Software Development</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
          </select>
        </Field>

        <Field>
          <FieldLabel htmlFor="experience">Experience (Years)</FieldLabel>
          <select
            id="experience"
            className="border rounded-md p-2 w-full"
            value={formData.experience}
            onChange={handleChange}
            required
          >
            <option value="">Select Experience</option>
            <option value="0-2">0-2</option>
            <option value="2-5">2-5</option>
            <option value="5+">5+</option>
          </select>
        </Field>

        <Field>
          <FieldLabel htmlFor="expectedSalary">Expected Salary (₹)</FieldLabel>
          <Input
            id="expectedSalary"
            type="number"
            placeholder="500000"
            value={formData.expectedSalary}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="videoProfile">
            Introduction Video (URL)
          </FieldLabel>
          <Input
            id="videoProfile"
            type="url"
            placeholder="https://example.com/video.mp4"
            value={formData.videoProfile}
            onChange={handleChange}
          />
          <FieldDescription>
            Provide a URL to your 30–60 sec self-introduction video.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="idUpload">ID Proof URL (Optional)</FieldLabel>
          <Input
            id="idUpload"
            type="url"
            placeholder="https://example.com/id.pdf"
            value={formData.idUpload}
            onChange={handleChange}
          />
        </Field>

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="/login">Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
