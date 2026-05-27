import { redirect } from "next/navigation";

// No protected dashboard needed for this tool — redirect to home.
export default function ProtectedPage() {
  redirect("/");
}
