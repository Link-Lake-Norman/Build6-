"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { studentAccounts } from "@/content/student-accounts";

export default function StudentLoginPage() {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function login() {

    const student = studentAccounts.find(
      (account) =>
        account.username === username &&
        account.temporaryPassword === password
    );

    if (!student) {
      setError("Incorrect username or password");
      return;
    }

    router.push(
      `/student-portal/${student.id}`
    );
  }


  return (
    <main className="p-8">

      <section className="max-w-md border rounded-xl p-8">

        <h1 className="text-3xl font-bold">
          Future Ready™ Student Login
        </h1>

        <p className="mt-3">
          Enter the credentials provided by your facilitator.
        </p>

        <input
          className="border rounded-lg p-3 w-full mt-6"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          className="border rounded-lg p-3 w-full mt-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-600 mt-4">
            {error}
          </p>
        )}

        <button
          onClick={login}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          Login
        </button>

      </section>

    </main>
  );
}
