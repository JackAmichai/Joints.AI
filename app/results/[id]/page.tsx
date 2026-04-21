import { ResultsClient } from "./ResultsClient";

export default function ResultsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { halted?: string };
}) {
  return (
    <main className="min-h-screen bg-white">
      <ResultsClient
        submissionId={params.id}
        halted={searchParams.halted === "1"}
      />
    </main>
  );
}