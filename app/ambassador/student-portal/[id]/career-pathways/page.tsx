import {
  generateCareerPathways,
} from "@/content/career-intelligence";


export default function CareerPathwaysPage() {


  const profile = {

    studentId: "ambassador-student-001",

    strengths: [
      "Leadership",
      "Communication",
      "Teamwork",
    ],

    interests: [
      "Sports",
      "Healthcare",
      "Business",
    ],

    industries: [
      "Sports",
      "Healthcare",
      "Business Management",
    ],

  };


  const pathways = generateCareerPathways(profile);



  return (

    <main className="space-y-8 p-8">


      <section className="rounded-3xl bg-[#0D1B3D] p-8 text-white">

        <p className="text-sm font-bold uppercase text-[#F2B705]">
          Future Ready™ Career Intelligence
        </p>


        <h1 className="mt-3 text-4xl font-black">
          Your Opportunity Map
        </h1>


        <p className="mt-4 max-w-3xl text-slate-200">

          These pathways are generated from your strengths,
          interests, experiences, and skills. They are
          opportunities to explore, not limits on your future.

        </p>

      </section>



      <section className="rounded-3xl border bg-white p-6">

        <h2 className="text-2xl font-black text-[#0D1B3D]">
          Your Strength Profile
        </h2>


        <div className="mt-4 flex flex-wrap gap-3">

          {profile.strengths.map((strength) => (

            <span
              key={strength}
              className="rounded-full bg-slate-100 px-4 py-2 font-bold"
            >
              {strength}
            </span>

          ))}

        </div>

      </section>



      <section className="space-y-6">

        {pathways.map((pathway) => (

          <article
            key={pathway.title}
            className="rounded-3xl border bg-white p-7 shadow-sm"
          >

            <p className="text-sm font-bold uppercase text-[#F2B705]">
              {pathway.industry}
            </p>


            <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
              {pathway.title}
            </h2>


            <h3 className="mt-5 font-bold">
              Why This Fits You
            </h3>


            <ul className="mt-2 list-disc pl-5">

              {pathway.whyItFits.map((item) => (

                <li key={item}>
                  {item}
                </li>

              ))}

            </ul>



            <h3 className="mt-5 font-bold">
              Skills To Develop
            </h3>


            <ul className="mt-2 list-disc pl-5">

              {pathway.skillsToDevelop.map((item) => (

                <li key={item}>
                  {item}
                </li>

              ))}

            </ul>



            <h3 className="mt-5 font-bold">
              Experiences To Try
            </h3>


            <ul className="mt-2 list-disc pl-5">

              {pathway.experiencesToTry.map((item) => (

                <li key={item}>
                  {item}
                </li>

              ))}

            </ul>


          </article>

        ))}

      </section>


    </main>

  );

}
