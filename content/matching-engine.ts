import { studentProfiles } from "./student-profiles";
import { employerOpportunities } from "./employer-opportunities";


export function generateMatches() {


return employerOpportunities.map((opportunity)=>{


const matches = studentProfiles.map((student)=>{


let score = 0;


// Career alignment
if (
student.careerInterests
.toLowerCase()
.includes(
opportunity.industry.toLowerCase()
)
) {
score += 40;
}


// Readiness contribution
score += Math.round(
student.readinessScore * .4
);


// Skill alignment
const matchedSkills =
opportunity.skills.filter(skill =>
student.strengths
.toLowerCase()
.includes(
skill.toLowerCase()
)
);


score += matchedSkills.length * 5;



return {

student,
score,
matchedSkills,

};


})
.sort(
(a,b)=>b.score-a.score
);



return {

opportunity,

matches,

};


});


}
