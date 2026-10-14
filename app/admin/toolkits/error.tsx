"use client";
export default function Error({reset}:{reset:()=>void}) { return <main><h1>Toolkit Admin Request Could Not Be Completed</h1><p>Confirm setup is complete and check whether this payment reference or email already has a license before retrying. No email is sent automatically.</p><button onClick={reset}>Try Again</button><a href="/admin">Back to Admin</a></main>; }
