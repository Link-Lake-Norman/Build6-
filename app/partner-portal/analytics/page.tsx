import { partners } from "@/content/partners";

export default function PartnerAnalyticsPage() {
  const totalPartners = partners.length;

  const activePartners = partners.filter(
    (partner) => partner.status === "Active"
  ).length;

  const organizations = new Set(
    partners.map((partner) => partner.name)
  ).size;

  const programs = new Set(
    partners.map((partner) => partner.program)
  ).size;

  return (
    <main className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="rounded-3xl bg-[#0D1B3D] p-10 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
          BUILD6™
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Partner Analytics
        </h1>

        <p className="mt-4 text-lg text-slate-200">
          Monitor partner organizations participating in the BUILD6™
          workforce ecosystem.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          title="Partner Organizations"
          value={totalPartners}
        />

        <Metric
          title="Active Partners"
          value={activePartners}
        />

        <Metric
          title="Programs"
          value={programs}
        />

        <Metric
          title="Organizations"
          value={organizations}
        />
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Partner</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Program</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {partners.map((partner) => (
              <tr
                key={partner.id}
                className="border-t"
              >
                <td className="p-4 font-semibold">
                  {partner.name}
                </td>

                <td className="p-4">
                  {partner.type}
                </td>

                <td className="p-4">
                  {partner.program}
                </td>

                <td className="p-4">
                  {partner.location}
                </td>

                <td className="p-4">
                  {partner.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-4xl font-black text-[#0D1B3D]">
        {value}
      </p>
    </div>
  );
}

