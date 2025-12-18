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

export function RecruiterSignupForm({ className, ...props }) {
  return (
    <form className={cn("flex flex-col  gap-6 border p-5", className)} {...props}>
      <FieldGroup>
        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the form below to create your account
          </p>
        </div>

        {/* Company Name */}
        <div>
            
        </div>
        <Field>
          <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
          <Input id="companyName" type="text" placeholder="XYZ Technologies" required />
        </Field>

        {/* Company Email */}
        <Field>
          <FieldLabel htmlFor="companyEmail">Company Email</FieldLabel>
          <Input id="companyEmail" type="email" placeholder="company@example.com" required />
          <FieldDescription>
            We'll use this to contact you. We will not share your email with anyone else.
          </FieldDescription>
        </Field>

        {/* Recruiter Name */}
        <Field>
          <FieldLabel htmlFor="recruiterName">Recruiter Name</FieldLabel>
          <Input id="recruiterName" type="text" placeholder="Akash" required />
        </Field>

        {/* Recruiter Phone Number */}
        <Field>
          <FieldLabel htmlFor="recruiterPhone">Phone Number</FieldLabel>
          <Input id="recruiterPhone" type="tel" placeholder="+91 8979786869" required />
          <FieldDescription>
            You'll receive an OTP on this number. We will not share your number with anyone else.
          </FieldDescription>
        </Field>

        {/* Submit Button */}
        <Field>
          <Button type="submit">Create Account</Button>
        </Field>

        {/* Separator */}
        <FieldSeparator>Or continue with</FieldSeparator>

        {/* Already have account */}
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="/login">Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
