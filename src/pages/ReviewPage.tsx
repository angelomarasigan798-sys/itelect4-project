import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { askAi } from "../api/client";
import {
  reviewFormSchema,
  type ReviewFormValues,
} from "../schemas/reviewFormSchema";

const READINESS_STYLE = {
  ready: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  almost: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "not-yet": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function ReviewPage() {
  const review = useMutation({ mutationFn: askAi });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { prompt: "" },
  });

  const onSubmit = (values: ReviewFormValues) => review.mutate(values);

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/appointments">
          <span className="brand-mark">+</span>
          <span>Careline</span>
        </Link>
        <Link className="edit-button" to="/appointments">
          Back to appointments
        </Link>
      </header>
      <main className="page-content">
        <section className="page-heading">
          <div>
            <p className="eyebrow">ITELECT4 project feedback</p>
            <h1>AI Review</h1>
            <p>Describe your project and get feedback before you submit it.</p>
          </div>
        </section>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-w-2xl gap-4"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="prompt">Project description</Label>
            <textarea
              id="prompt"
              rows={6}
              {...register("prompt")}
              aria-invalid={errors.prompt ? true : undefined}
              placeholder="What it does, how it is built, where it runs..."
              className="rounded-lg border border-input bg-background p-2.5 text-sm text-foreground"
            />
            {errors.prompt && (
              <p className="text-sm text-red-600">{errors.prompt.message}</p>
            )}
          </div>

          <Button type="submit" disabled={review.isPending}>
            {review.isPending ? "Reviewing..." : "Review my project"}
          </Button>
        </form>

        {review.isError && (
          <p className="mt-4 text-sm text-red-700">{review.error.message}</p>
        )}

        {review.data && (
          <section className="mt-6 grid max-w-2xl gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <span
              className={`justify-self-start rounded px-2 py-0.5 text-sm font-semibold ${READINESS_STYLE[review.data.readiness]}`}
            >
              {review.data.readiness}
            </span>
            <p className="text-gray-900 dark:text-white">{review.data.summary}</p>

            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Strengths
              </h2>
              <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                {review.data.strengths.map((strength) => (
                  <li key={strength}>{strength}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Before you submit
              </h2>
              <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                {review.data.improvements.map((improvement) => (
                  <li key={improvement}>{improvement}</li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ReviewPage;
