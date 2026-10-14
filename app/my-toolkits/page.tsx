export const metadata={robots:{index:false,follow:false},referrer:"no-referrer" as const};
import "../toolkits/toolkits.css";
import {buyer} from "@/lib/toolkits/access";
import {TOOLKIT} from "@/lib/toolkits/catalog";
import {logout} from "../toolkits/actions";
import {redirect} from "next/navigation";
export const dynamic="force-dynamic";
export default async function Page(){const l=await buyer();if(!l)redirect("/toolkits/login");return <main className="b6kit"><div className="wrap"><a href="/toolkits"><img className="brand" src="/brand/build6-horizontal-lockup.png" alt="BUILD6"/></a><h1>My Facilitator Toolkit</h1><article><h2>{TOOLKIT.title}</h2><p>Licensed facilitator: <strong>{l.name}</strong></p><p>License: {l.id} · Release {TOOLKIT.version}</p><a className="button" href="/api/toolkits/download">Download Personalized Session Guide</a><a className="button" href={TOOLKIT.freeUrl} target="_blank" rel="noopener noreferrer">Open Bingo & Download Master Cards ↗</a><p>Open your downloaded guide in a browser. Use Print → Save as PDF for a PDF copy, or print the selected activity pages.</p><p>Your groups may use participant handouts. Another independent facilitator needs a separate license.</p><a href="/toolkits/policies">License, policies & support</a></article><form action={logout}><button>Sign Out of Toolkit Account</button></form></div></main>}
