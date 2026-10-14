import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import PublicFooter from "../components/PublicFooter";

export default function AICoachPage() {
  return (
    <main className="min-h-screen bg-[#F5F8FC] text-[#0D1B3D]">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-[#0D1B3D] p-8 md:p-14">
          <p className="font-bold uppercase tracking-widest text-[#FFCB45]">
            BUILD6™ · In Development
          </p>

          <h1 className="mt-5 text-4xl font-black text-white md:text-6xl">
            AI Career Coach
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-9 text-white">
            Explore your strengths, interests and potential career
            pathways through the BUILD6™ learning experience.
          </p>

          <div className="mt-8 rounded-xl border border-white/30
                          bg-white/10 p-6 text-lg text-white">
            Our personalized AI Career Coach is in development.
            It does not yet generate recommendations or access
            student assessment records.
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/assessment"
              className="rounded-xl bg-[#FFCB45] px-6 py-4
                         font-black text-[#0D1B3D]"
            >
              Take the Free Assessment →
            </Link>

            <Link
              href="/connect"
              className="rounded-xl border border-white px-6 py-4
                         font-black !text-white"
              style={{ color: "#ffffff" }}
            >
              Ask About BUILD6 →
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ["DISCOVER", "Identify strengths and interests."],
            ["EXPLORE", "Investigate careers and opportunities."],
            ["LAUNCH", "Develop practical next steps."]
          ].map(([title, description]) => (
            <article
              key={title}
              className="rounded-2xl border bg-white p-7 shadow-sm"
            >
              <h2 className="text-xl font-black">{title}</h2>
              <p className="mt-3 text-lg">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
