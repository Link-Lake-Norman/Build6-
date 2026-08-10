import { studentProfiles } from "@/content/student-profiles";
import { employerOpportunities } from "@/content/employer-opportunities";


export default function TalentMarketplacePage() {


return (

<main className="p-8 space-y-8">


<section>

<h1 className="text-4xl font-bold">
Future Ready™ Talent Marketplace
</h1>


<p className="mt-3 text-lg">
Employer connection to Future Ready students.
</p>


</section>




<section className="border rounded-xl p-6">


<h2 className="text-2xl font-bold">
Available Student Talent
</h2>



{studentProfiles.map((student)=>(

<div
key={student.studentId}
className="border rounded-lg p-5 mt-4"
>


<h3 className="text-xl font-bold">
{student.name}
</h3>


<p className="mt-2">
Career Interest:
{" "}
{student.careerInterests}
</p>


<p>
Strengths:
{" "}
{student.strengths}
</p>


<p>
Readiness:
{" "}
{student.readinessScore}%
</p>



</div>


))}



</section>






<section className="border rounded-xl p-6">


<h2 className="text-2xl font-bold">
Employer Opportunities
</h2>


{employerOpportunities.map((opportunity)=>(


<div
key={opportunity.id}
className="border rounded-lg p-5 mt-4"
>


<h3 className="text-xl font-bold">
{opportunity.title}
</h3>


<p>
Company:
{" "}
{opportunity.company}
</p>


<p>
Industry:
{" "}
{opportunity.industry}
</p>


<p>
Type:
{" "}
{opportunity.type}
</p>


<p>
Skills:
{" "}
{opportunity.skills.join(", ")}
</p>


</div>


))}



</section>



</main>

);

}
