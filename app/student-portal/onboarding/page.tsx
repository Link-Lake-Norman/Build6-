"use client";

import { useState } from "react";


export default function StudentOnboardingPage() {


  const [submitted, setSubmitted] = useState(false);


  const [name, setName] = useState("");
  const [strengths, setStrengths] = useState("");
  const [interests, setInterests] = useState("");
  const [career, setCareer] = useState("");
  const [goal, setGoal] = useState("");



  function submitProfile(){

    setSubmitted(true);

  }



  return (

    <main className="p-8 space-y-8">


      <section>

        <h1 className="text-4xl font-bold">
          Welcome to BUILD6™
        </h1>

        <p className="mt-3 text-lg">
          Let's build your future profile.
        </p>

      </section>




      {!submitted ? (

      <section className="border rounded-xl p-6 space-y-5">


        <div>

          <label className="font-bold">
            Your Name
          </label>

          <input
            className="border rounded-lg p-3 w-full mt-2"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder="Enter your name"
          />

        </div>




        <div>

          <label className="font-bold">
            What are your strengths?
          </label>

          <textarea
            className="border rounded-lg p-3 w-full mt-2"
            value={strengths}
            onChange={(e)=>setStrengths(e.target.value)}
            placeholder="Example: I enjoy helping people, solving problems, creating things..."
          />

        </div>




        <div>

          <label className="font-bold">
            What are you interested in?
          </label>

          <textarea
            className="border rounded-lg p-3 w-full mt-2"
            value={interests}
            onChange={(e)=>setInterests(e.target.value)}
            placeholder="Sports, technology, healthcare, business, art..."
          />

        </div>




        <div>

          <label className="font-bold">
            What careers interest you?
          </label>

          <textarea
            className="border rounded-lg p-3 w-full mt-2"
            value={career}
            onChange={(e)=>setCareer(e.target.value)}
            placeholder="What jobs or industries sound interesting?"
          />

        </div>




        <div>

          <label className="font-bold">
            What is one future goal?
          </label>

          <textarea
            className="border rounded-lg p-3 w-full mt-2"
            value={goal}
            onChange={(e)=>setGoal(e.target.value)}
            placeholder="Describe something you want to accomplish."
          />

        </div>




        <button
          onClick={submitProfile}
          className="rounded-lg bg-blue-600 text-white px-6 py-3"
        >
          Complete My BUILD6 Profile
        </button>


      </section>


      ) : (


      <section className="border rounded-xl p-6">


        <h2 className="text-2xl font-bold">
          Profile Complete 🎉
        </h2>


        <div className="mt-5 space-y-3">


          <p>
            <strong>Name:</strong> {name}
          </p>


          <p>
            <strong>Strengths:</strong> {strengths}
          </p>


          <p>
            <strong>Interests:</strong> {interests}
          </p>


          <p>
            <strong>Career Interests:</strong> {career}
          </p>


          <p>
            <strong>Future Goal:</strong> {goal}
          </p>


        </div>


      </section>


      )}


    </main>

  );

}
