import "../approved-public-pages.css";
import SiteHeader from "../components/SiteHeader";
import PublicFooter from "../components/PublicFooter";
import PublicAssessmentForm from "./PublicAssessmentForm";

export default function AssessmentPage() {
  return <main className="assessment-page"><SiteHeader /><PublicAssessmentForm /><PublicFooter /></main>;
}
