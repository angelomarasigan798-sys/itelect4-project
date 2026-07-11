interface Submission {
  id: number;
  status: string;
}

interface SubmissionBadgeProps {
  submission: Submission;
}

function SubmissionBadge({ submission }: SubmissionBadgeProps) {
  return (
    <div>
      <h2>Submission</h2>
      <p>Status: {submission.status}</p>
    </div>
  );
}

export default SubmissionBadge;