"use client";

import { useEffect, useRef, useState } from "react";

type Country = {
  code: string;
  dial: string;
  label: string;
  placeholder: string;
  maxDigits: number;
};

export const PHONE_COUNTRIES: Country[] = [
  { code: "TR", dial: "+90", label: "Türkiye", placeholder: "5XX XXX XX XX", maxDigits: 10 },
  { code: "DE", dial: "+49", label: "Deutschland", placeholder: "1512 3456789", maxDigits: 12 },
  { code: "FR", dial: "+33", label: "France", placeholder: "6 12 34 56 78", maxDigits: 9 },
  { code: "GB", dial: "+44", label: "United Kingdom", placeholder: "7400 123456", maxDigits: 10 },
  { code: "US", dial: "+1", label: "United States / Canada", placeholder: "555 123 4567", maxDigits: 10 },
  { code: "IT", dial: "+39", label: "Italia", placeholder: "312 345 6789", maxDigits: 11 },
  { code: "ES", dial: "+34", label: "España", placeholder: "612 345 678", maxDigits: 9 },
  { code: "NL", dial: "+31", label: "Nederland", placeholder: "6 12345678", maxDigits: 9 },
  { code: "BE", dial: "+32", label: "Belgique / België", placeholder: "470 12 34 56", maxDigits: 9 },
  { code: "AT", dial: "+43", label: "Österreich", placeholder: "660 1234567", maxDigits: 11 },
  { code: "CH", dial: "+41", label: "Schweiz", placeholder: "78 123 45 67", maxDigits: 9 },
  { code: "PL", dial: "+48", label: "Polska", placeholder: "512 345 678", maxDigits: 9 },
  { code: "RO", dial: "+40", label: "România", placeholder: "712 345 678", maxDigits: 9 },
  { code: "GR", dial: "+30", label: "Ελλάδα", placeholder: "691 234 5678", maxDigits: 10 },
  { code: "BG", dial: "+359", label: "България", placeholder: "87 123 4567", maxDigits: 9 },
  { code: "RU", dial: "+7", label: "Россия", placeholder: "912 345 67 89", maxDigits: 10 },
  { code: "UA", dial: "+380", label: "Україна", placeholder: "50 123 4567", maxDigits: 9 },
  { code: "AZ", dial: "+994", label: "Azərbaycan", placeholder: "50 123 45 67", maxDigits: 9 },
  { code: "SA", dial: "+966", label: "السعودية", placeholder: "51 234 5678", maxDigits: 9 },
  { code: "AE", dial: "+971", label: "الإمارات", placeholder: "50 123 4567", maxDigits: 9 },
  { code: "IL", dial: "+972", label: "ישראל", placeholder: "50 123 4567", maxDigits: 9 },
  { code: "EG", dial: "+20", label: "مصر", placeholder: "100 123 4567", maxDigits: 10 },
];

const DEFAULT_COUNTRY = PHONE_COUNTRIES[0];

function parseE164(value: string | undefined): { country: Country; local: string } {
  if (!value) return { country: DEFAULT_COUNTRY, local: "" };
  const sorted = [...PHONE_COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
  const match = sorted.find((c) => value.startsWith(c.dial));
  if (!match) return { country: DEFAULT_COUNTRY, local: "" };
  return { country: match, local: value.slice(match.dial.length).replace(/\D/g, "") };
}

type Props = {
  value?: string;
  onChange: (e164: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  id?: string;
};

export function PhoneField({ value, onChange, onBlur, invalid, id }: Props) {
  const initial = useRef(parseE164(value));
  const [country, setCountry] = useState<Country>(initial.current.country);
  const [local, setLocal] = useState<string>(initial.current.local);

  useEffect(() => {
    const parsed = parseE164(value);
    if (parsed.country.code !== country.code) setCountry(parsed.country);
    if (parsed.local !== local) setLocal(parsed.local);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const emit = (next: Country, nextLocal: string) => {
    onChange(nextLocal ? `${next.dial}${nextLocal}` : "");
  };

  const handleCountry = (code: string) => {
    const next = PHONE_COUNTRIES.find((c) => c.code === code) ?? DEFAULT_COUNTRY;
    const trimmed = local.slice(0, next.maxDigits);
    setCountry(next);
    setLocal(trimmed);
    emit(next, trimmed);
  };

  const handleLocal = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, country.maxDigits);
    setLocal(digits);
    emit(country, digits);
  };

  const borderClass = invalid
    ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-500/20"
    : "border-brand-200 focus-within:border-accent-500 focus-within:ring-accent-500/20";

  return (
    <div
      className={`flex items-stretch rounded-lg border bg-white overflow-hidden transition focus-within:ring-2 ${borderClass}`}
    >
      <select
        aria-label="Country code"
        value={country.code}
        onChange={(e) => handleCountry(e.target.value)}
        className="border-r border-brand-200 bg-brand-50 px-2.5 py-2.5 text-sm text-brand-900 outline-none cursor-pointer"
      >
        {PHONE_COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} {c.dial}
          </option>
        ))}
      </select>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={local}
        onChange={(e) => handleLocal(e.target.value)}
        onBlur={onBlur}
        placeholder={country.placeholder}
        className="flex-1 min-w-0 px-3.5 py-2.5 text-sm text-brand-950 outline-none bg-transparent"
      />
    </div>
  );
}

export const PHONE_REGEX = /^\+\d{7,15}$/;
