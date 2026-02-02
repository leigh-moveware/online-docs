# OD-6: Build client-facing Online Quote page (UI with mock data)

## Notes

I'll analyze the repository structure and create the Online Quote page with the specified requirements.

<read_file>
<path>.</path>
</read_file>

<read_file>
<path>src</path>
</read_file>

<read_file>
<path>src/app</path>
</read_file>

<read_file>
<path>src/components</path>
</read_file>

<read_file>
<path>package.json</path>
</read_file>

<read_file>
<path>src/app/layout.tsx</path>
</read_file>

<read_file>
<path>src/app/page.tsx</path>
</read_file>

<read_file>
<path>tailwind.config.ts</path>
</read_file>

<read_file>
<path>src/app/globals.css</path>
</read_file>

Now let me check if there are any existing components or utilities I should be aware of:

<read_file>
<path>src/lib</path>
</read_file>

<read_file>
<path>public</path>
</read_file>

Let me create the Online Quote page with all the required components:

<write_file>
<path>src/app/quote/page.tsx</path>
<content>'use client';

import { useState } from 'react';
import { QuoteForm } from '@/components/quote/QuoteForm';
import { QuoteHero } from '@/components/quote/QuoteHero';

// Mock data for the quote page
const mockQuoteData = {
  hero: {
    title: 'Get Your Online Quote',
    subtitle: 'Fast, easy, and transparent pricing for your insurance needs',
    backgroundImage: '/images/quote-hero-bg.jpg',
  },
  branding: {
    companyName: 'SecureLife Insurance',
    logo: '/images/logo.png',
    tagline: 'Protecting what matters most',
  },
  copy: {
    introText: 'Complete the form below to receive your personalized insurance quote. Our team will review your information and get back to you within 24 hours.',
    privacyNote: 'Your information is secure and will never be shared with third parties.',
  },
  insuranceOptions: [
    { id: 'auto', label: 'Auto Insurance', description: 'Comprehensive coverage for your vehicle' },
    { id: 'home', label: 'Home Insurance', description: 'Protect your home and belongings' },
    { id: 'life', label: 'Life Insurance', description: 'Financial security for your loved ones' },
    { id: 'health', label: 'Health Insurance', description: 'Medical coverage for you and your family' },
    { id: 'business', label: 'Business Insurance', description: 'Coverage for your business operations' },
  ],
};

export default function QuotePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    selectedInsurance: [] as string[],
    comments: '',
    signature: '',
  });

  const handleSubmit = (data: typeof formData) => {
    console.log('Quote form submitted:', data);
    // TODO: Replace with actual API call
    alert('Quote request submitted successfully! (Mock data)');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <QuoteHero
        title={mockQuoteData.hero.title}
        subtitle={mockQuoteData.hero.subtitle}
        branding={mockQuoteData.branding}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Intro Text */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Request Your Quote
          </h2>
          <p className="text-gray-600 mb-4">{mockQuoteData.copy.introText}</p>
          <p className="text-sm text-gray-500 italic">
            {mockQuoteData.copy.privacyNote}
          </p>
        </div>

        {/* Quote Form */}
        <QuoteForm
          insuranceOptions={mockQuoteData.insuranceOptions}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
</content>
</write_file>

<write_file>
<path>src/components/quote/QuoteHero.tsx</path>
<content>interface QuoteHeroProps {
  title: string;
  subtitle: string;
  branding: {
    companyName: string;
    logo: string;
    tagline: string;
  };
}

export function QuoteHero({ title, subtitle, branding }: QuoteHeroProps) {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        {/* Branding */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">SL</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">{branding.companyName}</h3>
              <p className="text-blue-100 text-sm">{branding.tagline}</p>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-blue-100">{subtitle}</p>
        </div>
      </div>

      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 text-gray-50"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
</content>
</write_file>

<write_file>
<path>src/components/quote/QuoteForm.tsx</path>
<content>'use client';

import { useState } from 'react';

interface InsuranceOption {
  id: string;
  label: string;
  description: string;
}

interface QuoteFormProps {
  insuranceOptions: InsuranceOption[];
  onSubmit: (data: FormData) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  selectedInsurance: string[];
  comments: string;
  signature: string;
}

export function QuoteForm({ insuranceOptions, onSubmit }: QuoteFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    selectedInsurance: [],
    comments: '',
    signature: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleInsuranceToggle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedInsurance: prev.selectedInsurance.includes(id)
        ? prev.selectedInsurance.filter((item) => item !== id)
        : [...prev.selectedInsurance, id],
    }));
    if (errors.selectedInsurance) {
      setErrors((prev) => ({ ...prev, selectedInsurance: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (formData.selectedInsurance.length === 0) {
      newErrors.selectedInsurance = 'Please select at least one insurance type';
    }
    if (!formData.signature.trim()) {
      newErrors.signature = 'Signature is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
      {/* Personal Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Insurance Options */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Insurance Type *
        </h3>
        <div className="space-y-3">
          {insuranceOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.selectedInsurance.includes(option.id)}
                onChange={() => handleInsuranceToggle(option.id)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
        {errors.selectedInsurance && (
          <p className="mt-2 text-sm text-red-600">{errors.selectedInsurance}</p>
        )}
      </div>

      {/* Comments */}
      <div className="mb-8">
        <label
          htmlFor="comments"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Additional Comments
        </label>
        <textarea
          id="comments"
          name="comments"
          rows={4}
          value={formData.comments}
          onChange={handleInputChange}
          placeholder="Tell us more about your insurance needs..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
