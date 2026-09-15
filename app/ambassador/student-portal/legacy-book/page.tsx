import Link from "next/link";

const chapters = [
  {
    number: 1,
    title: "My Beginning",
    subtitle: "Who I Was When I Started",
    evidence: [
      "Who I am today",
      "My athletic journey",
      "My strengths",
      "My goals",
      "What I hope to discover",
    ],
  },
  {
    number: 2,
    title: "Beyond the Game",
    subtitle: "Lessons My Sport Taught Me",
    evidence: [
      "Challenges overcome",
      "People who influenced me",
      "Lessons I will carry forward",
      "Skills athletics helped me develop",
      "Identity beyond athletics",
    ],
  },
  {
    number: 3,
    title: "Discovering Myself",
    subtitle: "Understanding Who I Am",
    evidence: [
      "Strengths",
      "Values",
      "Interests",
      "Communication style",
      "Leadership qualities",
    ],
  },
  {
    number: 4,
    title: "Developing My Skills",
    subtitle: "Becoming Future Ready",
    evidence: [
      "Communication",
      "Collaboration",
      "Problem solving",
      "Adaptability",
      "Professionalism",
    ],
  },
  {
    number: 5,
    title: "My Real-World Experience",
    subtitle: "Applying What I Learned",
    evidence: [
      "Organization",
      "Responsibilities",
      "Lessons learned",
      "People who influenced me",
      "Contributions made",
    ],
  },
  {
    number: 6,
    title: "My Impact",
    subtitle: "What I Created, Improved, or Changed",
    evidence: [
      "I noticed...",
      "I contributed...",
      "I learned...",
    ],
  },
  {
    number: 7,
    title: "My Next Chapter",
    subtitle: "The Future Beyond Sports",
    evidence: [
      "I now know...",
      "I want to continue developing...",
      "My next step is...",
    ],
  },
];

const signatureComponents = [
  {
    title: "Wins & Losses Log",
    description:
      "A living record of meaningful wins and losses — on the field and off.",
  },
  {
    title: "Voices That Shaped Me",
    description:
      "A real conversation with a coach, teammate or mentor who influenced your journey.",
  },
  {
    title: "Game Film Reflection",
    description:
      "Revisit a meaningful athletic moment and notice what you understand differently now.",
  },
  {
    title: "Sealed Letter to My Future Self",
    description:
      "Capture who you are today so you can later compare who you were with who you became.",
  },
  {
    title: "Career-Field Interview",
    description:
      "Learn directly from a professional working in a field you are exploring.",
  },
  {
    title: "Underclassman Pairing",
    description:
      "Turn what you learn into something useful for a younger athlete coming behind you.",
  },
];

export default function LegacyBookPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FB] px-5 py-10 text-[#0D1B3D]">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2rem] bg-[#0D1B3D] px-7 py-10 text-white shadow-xl md:px-12 md:py-14">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F2B705]">
            Future Ready™ Legacy Book Project
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            BEYOND THE GAME
          </h1>

          <p className="mt-3 text-xl font-bold italic text-slate-200 md:text-2xl">
            My Story, My Growth, My Future
          </p>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200">
            This year, your Future Ready™ work becomes more than a collection
            of assignments. You are collecting evidence of who you were, what
            you experienced, what challenged you, what you learned and who you
            are becoming.
          </p>

          <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
              The Legacy Question
            </p>
            <p className="mt-3 text-2xl font-black md:text-3xl">
              Who am I becoming beyond the game?
            </p>
          </div>

          <p className="mt-8 text-xl font-bold italic">
            “The uniform may change. The lessons remain.”
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] border border-[#F2B705]/40 bg-[#FFF9E5] p-7 md:p-9">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
            Start Here
          </p>

          <h2 className="mt-2 text-3xl font-black">
            You are already writing your book.
          </h2>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-700">
            Your weekly reflections, experiences, conversations, challenges,
            skills, career discoveries and relationships are evidence. You do
            not have to sit down at the end of the year and remember everything.
            Future Ready™ helps you capture it while it is happening.
          </p>
        </section>

        <section className="mt-10">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            Your Story
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Seven Chapters. One Year of Growth.
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {chapters.map((chapter) => (
              <article
                key={chapter.number}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <p className="text-xs font-black uppercase tracking-wider text-[#725500]">
                  Chapter {chapter.number}
                </p>

                <h3 className="mt-2 text-2xl font-black">{chapter.title}</h3>

                <p className="mt-1 font-bold text-[#4B2265]">
                  {chapter.subtitle}
                </p>

                <ul className="mt-5 space-y-2 text-slate-700">
                  {chapter.evidence.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="font-black text-[#F2B705]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] bg-white p-7 shadow-sm md:p-9">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            Signature Components
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Moments Worth Keeping
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {signatureComponents.map((component) => (
              <div
                key={component.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="font-black">{component.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">
                  {component.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] bg-[#4B2265] p-7 text-white md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
            Week 5 · From Possibility to Opportunity
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Today becomes part of your story.
          </h2>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-purple-50">
            As you listen to former athletes talk about life before, during and
            after athletics, listen for more than their accomplishments. Listen
            for decisions, identity, relationships, setbacks, transferable
            skills and what they wish they had started building sooner.
          </p>

          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {[
              "What am I already building through athletics?",
              "What do I still need to build?",
              "Who am I becoming beyond the game?",
              "What should I begin now that future me will be grateful I built?",
            ].map((question) => (
              <div
                key={question}
                className="rounded-2xl bg-white/10 p-5 font-black leading-7"
              >
                {question}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-7 text-center shadow-sm md:p-10">
          <p className="text-2xl font-black">
            You are not writing this book all at once.
          </p>

          <p className="mt-2 text-xl font-bold text-[#4B2265]">
            You are building it while you build yourself.
          </p>

          <Link
            href="/ambassador/student-portal"
            className="mt-7 inline-flex rounded-xl bg-[#0D1B3D] px-6 py-3 font-black text-white"
          >
            Return to Student Portal →
          </Link>
        </section>
      </div>
    </main>
  );
}
