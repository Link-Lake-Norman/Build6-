import { studentProfiles } from "./student-profiles";
import { progress } from "./progress";


export const analytics = {

  totalStudents:
    studentProfiles.length,


  completedProfiles:
    studentProfiles.filter(
      (student) => student.profileComplete
    ).length,


  averageReadiness:
    Math.round(
      studentProfiles.reduce(
        (total, student) =>
          total + student.readinessScore,
        0
      ) / studentProfiles.length
    ),


  careerInterests:
    studentProfiles.map(
      (student) =>
        student.careerInterests
    ),


  skillsTracked:
    [
      "Communication",
      "Teamwork",
      "Leadership",
      "Problem Solving",
    ],


  progressTracked:
    progress.length,

};
