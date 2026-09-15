import { redirect } from "next/navigation";

export default function FacilitatorAttendancePage() {
  redirect("/ambassador/facilitator/students?attendance=1");
}
