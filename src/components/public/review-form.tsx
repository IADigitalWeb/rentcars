"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarRating } from "@/components/ui/star-rating";
import { submitReview } from "@/app/actions/reviews";

interface ReviewFormProps {
  vehicleId: string;
  onReviewAdded: (review: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: { firstName: string; lastName: string };
  }) => void;
}

export function ReviewForm({ vehicleId, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Veuillez sélectionner une note");
      return;
    }

    const form = new FormData();
    form.set("vehicleId", vehicleId);
    form.set("rating", rating.toString());
    form.set("comment", comment);

    startTransition(async () => {
      const result = await submitReview(form);
      if (result.error) {
        if (typeof result.error === "string") {
          setError(result.error);
        } else {
          setError(Object.values(result.error).flat().join(", "));
        }
        return;
      }
      if (result.success && result.review) {
        onReviewAdded(result.review);
        setRating(0);
        setComment("");
        setError("");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-sm p-md bg-surface-container-lowest rounded-xl border border-outline-variant/20">
      <h3 className="font-label-bold text-label-bold text-on-surface mb-xs">Laisser un avis</h3>

      <div className="flex items-center gap-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant">Note :</span>
        <div className="flex gap-xs">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => { setRating(star); setError(""); }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0 bg-transparent border-none cursor-pointer"
            >
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill={(hoverRating || rating) >= star ? "#F59E0B" : "none"}
                stroke="#F59E0B"
                strokeWidth={2}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Partagez votre expérience (optionnel)"
        maxLength={1000}
        rows={3}
        className="w-full bg-surface-container px-md py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary resize-none"
      />

      {error && (
        <span className="text-error font-label-sm text-label-sm">{error}</span>
      )}

      <Button type="submit" size="sm" loading={isPending}>
        Publier l&apos;avis
      </Button>
    </form>
  );
}
