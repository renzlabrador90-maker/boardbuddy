import { Inbox } from "lucide-react";

export default function EmptyState({ message = "No records found." }) {
  return (
    <div className="flex flex-col items-center py-12 text-gray-400">
      <Inbox size={36} />
      <p className="mt-2 text-sm">{message}</p>
    </div>
  );
}