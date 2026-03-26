"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createDashboardProject } from "@/lib/api";

interface AddProjectInputProps {
  placeholder?: string;
  className?: string;
  onSuccess?: () => void;
}

export default function AddProjectInput({
  placeholder = "Your Website URL",
  className,
  onSuccess,
}: AddProjectInputProps) {
  const router = useRouter();
  const [project, setProject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const value = project.trim();

    if (!value) {
      setError("Please enter a valid project URL.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await createDashboardProject(value);
      if (!response.success) {
        throw new Error("Project creation failed");
      }
      setProject("");
      onSuccess?.();
      router.refresh();
    } catch {
      setError("Unable to add project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-[361px] ${className ?? ""}`}>
      <div className="flex h-[42px] items-center justify-between rounded-pill border-[1.5px] border-brand-indigo bg-brand-white px-4 py-1 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <input
          value={project}
          onChange={(event) => setProject(event.target.value)}
          placeholder={placeholder}
          className="w-full border-none bg-transparent text-sm font-normal text-brand-navy placeholder:text-brand-gray-400 outline-none"
          aria-label="Project URL"
        />
        <button type="submit" disabled={isSubmitting} className="ml-2 shrink-0 disabled:cursor-not-allowed sm:ml-3" aria-label="Add project">
          {isSubmitting ? (
            <span className="block h-[18px] w-[18px] animate-spin rounded-full border-2 border-brand-indigo border-t-transparent" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="8" stroke="#3E4FEA" strokeWidth="1.5" />
              <path d="M9 5.4V12.6M5.4 9H12.6" stroke="#3E4FEA" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </form>
  );
}
