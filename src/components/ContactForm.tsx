
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { SecureInput } from "@/components/security/SecureInput";
import { emailSchema, nameSchema, textSchema, checkRateLimit } from "@/utils/inputValidation";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const ContactForm = () => {
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<ContactFormData>();
  const { toast } = useToast();

  const validateInput = (field: keyof ContactFormData, value: string) => {
    try {
      switch (field) {
        case 'name':
          nameSchema.parse(value);
          break;
        case 'email':
          emailSchema.parse(value);
          break;
        case 'message':
          textSchema.parse(value);
          break;
      }
      return true;
    } catch {
      return false;
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    // Rate limiting
    if (!checkRateLimit(`contact_${data.email}`, 3, 600000)) { // 3 attempts per 10 minutes
      toast({
        title: "Too Many Attempts",
        description: "Please wait before sending another message.",
        variant: "destructive",
      });
      return;
    }

    // Validate all inputs
    if (!validateInput('name', data.name)) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid name.",
        variant: "destructive",
      });
      return;
    }

    if (!validateInput('email', data.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!validateInput('message', data.message)) {
      toast({
        title: "Invalid Message",
        description: "Please enter a valid message.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Note: Web3Forms API key should be moved to environment variables
      // For now, we'll use a placeholder that should be configured in production
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_API_KEY || 'CONFIGURE_WEB3FORMS_KEY',
          ...data,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your message has been sent successfully.",
        });
        reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md mx-auto p-4">
      <div>
        <SecureInput
          placeholder="Your Name"
          onSecureChange={(value) => setValue('name', value)}
          maxLength={100}
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <SecureInput
          type="email"
          placeholder="Your Email"
          onSecureChange={(value) => setValue('email', value)}
          maxLength={254}
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Textarea
          placeholder="Your Message"
          {...register("message", { required: "Message is required" })}
          className="min-h-[150px]"
          maxLength={5000}
        />
        {errors.message && (
          <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  );
};
