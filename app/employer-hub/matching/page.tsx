import { generateMatches } from "@/content/matching-engine";


export default function MatchingPage(){


const results = generateMatches();



return (

<main className="p-8 space-y-8">


<section>

<h1 className="text-4xl font-bold">
BUILD6™ Talent Matching Engine
</h1>

<p className="mt-3 text-lg">
AI-assisted workforce connections.
</p>

</section>



{results.map((result)=>(


<section
key={result.opportunity.id}
className="border rounded-xl p-6"
>


<h2 className="text-2xl font-bold">
{result.opportunity.title}
</h2>


<p className="mt-2">
Industry:
{" "}
{result.opportunity.industry}
</p>



<h3 className="text-xl font-bold mt-6">
Recommended Students
</h3>



{result.matches.map((match)=>(


<div
key={match.student.studentId}
className="border rounded-lg p-4 mt-4"
>


<h4 className="font-bold text-lg">
{match.student.name}
</h4>


<p>
Match Score:
{" "}
{match.score}%
</p>


<p>
Career Interest:
{" "}
{match.student.careerInterests}
</p>


<p>
Matched Skills:
{" "}
{match.matchedSkills.join(", ") || "Developing"}
</p>


</div>


))}


</section>


))}


</main>

);

}
