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
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the form below to create your account
          </p>
        </div>

        {/* Full Name */}
        <Field>
          <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
          <Input id="fullName" type="text" placeholder="Akash Gupta" required />
        </Field>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="example@email.com" required />
          <FieldDescription>
            We'll use this to contact you. We will not share your email with anyone else.
          </FieldDescription>
        </Field>

        {/* Phone Number */}
        <Field>
          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
          <Input id="phone" type="tel" placeholder="+91 9876543210" required />
          <FieldDescription>
            You'll receive an OTP on this number. We will not share your number with anyone else.
          </FieldDescription>
        </Field>

        {/* Date of Birth */}
        <Field>
          <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
          <Input id="dob" type="date" required />
        </Field>

        {/* Gender */}
        <Field>
          <FieldLabel htmlFor="gender">Gender</FieldLabel>
          <select id="gender" className="border rounded-md p-2 w-full" required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>

        {/* Skill Category */}
        <Field>
          <FieldLabel htmlFor="skillCategory">Skill Category</FieldLabel>
          <select id="skillCategory" className="border rounded-md p-2 w-full" required>
            <option value="">Select Skill</option>
            <option value="softwareDevelopment">Software Development</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
          </select>
        </Field>

        {/* Experience */}
        <Field>
          <FieldLabel htmlFor="experience">Experience (Years)</FieldLabel>
          <select id="experience" className="border rounded-md p-2 w-full" required>
            <option value="">Select Experience</option>
            <option value="0-2">0-2</option>
            <option value="2-5">2-5</option>
            <option value="5+">5+</option>
          </select>
        </Field>

        {/* Expected Salary */}
        <Field>
          <FieldLabel htmlFor="salary">Expected Salary (₹)</FieldLabel>
          <Input id="salary" type="number" placeholder="500000" required />
        </Field>

        {/* Introduction Video */}
        <Field>
          <FieldLabel htmlFor="videoProfile">Introduction Video</FieldLabel>
          <Input id="videoProfile" type="file" accept="video/*" required />
          <FieldDescription>Upload a 30–60 sec self-introduction video.</FieldDescription>
        </Field>

        {/* ID Upload */}
        <Field>
          <FieldLabel htmlFor="idUpload">ID Proof (Optional)</FieldLabel>
          <Input id="idUpload" type="file" accept=".pdf,.jpg,.png" />
        </Field>

        {/* Submit Button */}
        <Field>
          <Button type="submit">Create Account</Button>
        </Field>

        {/* Separator */}
        <FieldSeparator>Or continue with</FieldSeparator>

        {/* Already have an account */}
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="/login">Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
