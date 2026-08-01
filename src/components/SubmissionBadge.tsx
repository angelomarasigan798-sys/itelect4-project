type Submission = {
  id: number;
  status: string;
};

type SubmissionBadgeProps = {
  submission: Submission;
};

export default function SubmissionBadge({
  submission,
}: SubmissionBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        submission.status === 'Submitted'
          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
      }`}
    >
      {submission.status}
    </span>
  );
}