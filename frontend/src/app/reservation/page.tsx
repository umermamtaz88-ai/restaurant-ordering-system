import { redirect } from "next/navigation";

/** Legacy /reservation URL → Contact booking section. */
export default function ReservationPage() {
  redirect("/contact?book=1");
}
