import Link from "next/link";

import PrintCapstoneButton from "@/components/ambassador/delivery/PrintCapstoneButton";

export default function CapstoneGuidePage() {
  const pieces = [
    [
      "MY STORY",
      "Where I've been, experiences that shaped me, and people and places that matter.",
    ],
    [
      "WHO I AM",
      "Strengths, interests, values, personality, identity, and discoveries about myself.",
    ],
    [
      "MY SKILLS",
      "Evidence of communication, teamwork, leadership, problem-solving, adaptability, and professional growth.",
    ],
    [
      "MY EXPERIENCES",
      "Speakers, field trips, projects, career conversations, workplace experiences, internships, and meaningful moments.",
    ],
    [
      "MY FUTURE",
      "Careers, possibilities, goals, and what I am learning about the life I want.",
    ],
    [
      "MY VOICE",
      "My reflections, writing, thoughts, poems, phrases, ideas, and things I want to remember.",
    ],
    [
      "MY GROWTH",
      "What changes from the person who started BUILD6™ to the person who finishes it.",
    ],
  ];

  const brainMap = [
    ["FEELING", "What should someone feel when they first see your book?"],
    ["COLORS", "What colors feel like you right now? Why?"],
    ["WORDS", "What words, phrases, or ideas belong in your story?"],
    ["IMAGES", "What photographs, objects, visuals, or scenes represent you?"],
    ["PEOPLE", "Who has influenced, challenged, supported, or shaped you?"],
    [
      "PLACES",
      "Where have you been, where do you belong, or where do you want to go?",
    ],
    [
      "SYMBOLS",
      "What objects or symbols represent something important to you?",
    ],
    [
      "STYLE + TEXTURE",
      "Bold? Clean? Layered? Athletic? Minimal? Magazine? Handwritten? Photography? Something else?",
    ],
    [
      "MY WRITING",
      "Thoughts, poems, possible titles, sentences, phrases, or words you want to remember.",
    ],
    [
      "MY FUTURE",
      "What might represent where you are headed, even if you are not sure yet?",
    ],
  ];

  return (
    <main
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "32px 20px 80px",
        color: "#1F2937",
      }}
    >
      <div
        className="print:hidden"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/ambassador"
          style={{
            color: "#0D1B3D",
            fontWeight: 900,
            textDecoration: "none",
          }}
        >
          ← Back to BUILD6™
        </Link>

        <PrintCapstoneButton />
      </div>

      <section
        style={{
          border: "1px solid #DDE3EC",
          borderRadius: 24,
          padding: 30,
          background: "white",
        }}
      >
        <div
          style={{
            color: "#4B2265",
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: 1.6,
          }}
        >
          FUTURE READY™ CAPSTONE
        </div>

        <h1
          style={{
            margin: "8px 0",
            color: "#0D1B3D",
            fontSize: 40,
          }}
        >
          My Story. My Skills. My Future.
        </h1>

        <p
          style={{
            fontSize: 20,
            fontWeight: 800,
            lineHeight: 1.5,
          }}
        >
          You are creating a book about the person you are becoming.
        </p>

        <p style={{ lineHeight: 1.75 }}>
          Throughout BUILD6™, you will collect pieces of your story:
          experiences, strengths, interests, values, ideas, writing, skills,
          accomplishments, challenges, people, places, career possibilities, and
          moments that change how you think about your future.
        </p>

        <p
          style={{
            color: "#0D1B3D",
            fontWeight: 900,
            fontSize: 18,
          }}
        >
          You will not create your book all at once. You will build it as you
          build yourself.
        </p>

        <h2 style={{ color: "#0D1B3D", marginTop: 32 }}>
          What Goes Into My Book?
        </h2>

        <div style={{ display: "grid", gap: 10 }}>
          {pieces.map(([title, text]) => (
            <div
              key={title}
              style={{
                display: "grid",
                gridTemplateColumns: "150px 1fr",
                gap: 12,
                borderBottom: "1px solid #E5E7EB",
                padding: "10px 0",
              }}
            >
              <strong style={{ color: "#4B2265" }}>{title}</strong>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 34,
            borderTop: "4px solid #F2B705",
            paddingTop: 24,
          }}
        >
          <div
            style={{
              color: "#725500",
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: 1.5,
            }}
          >
            MONDAY · START IT
          </div>

          <h2 style={{ color: "#0D1B3D", fontSize: 30 }}>My Story Brain Map</h2>

          <p
            style={{
              fontSize: 19,
              fontWeight: 800,
              lineHeight: 1.55,
            }}
          >
            If your life and future were a book, what should someone FEEL when
            they see the cover before they read a single word?
          </p>

          <p>
            Today is not about designing the final cover. You are collecting
            possibilities.
          </p>

          <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
            {brainMap.map(([title, text]) => (
              <div
                key={title}
                style={{
                  display: "grid",
                  gridTemplateColumns: "150px 1fr",
                  gap: 12,
                  background: "#F8FAFC",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <strong style={{ color: "#0D1B3D" }}>{title}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <h3 style={{ color: "#0D1B3D", marginTop: 28 }}>
            My First Three Decisions
          </h3>

          <p>
            1. I want someone to feel:
            ______________________________________________________
          </p>

          <p>
            2. Three words that belong in my story:
            ____________________________________________
          </p>

          <p>
            3. Colors / images / styles I want to explore:
            ____________________________________
          </p>

          <div
            style={{
              marginTop: 28,
              padding: 18,
              borderRadius: 14,
              background: "#FFF9DF",
              border: "1px solid #F2B705",
            }}
          >
            <strong>REMEMBER:</strong> There are no wrong choices today. You are
            not trying to make a polished design. You are beginning to notice
            what feels like YOUR story.
          </div>
        </div>
      </section>
    </main>
  );
}
