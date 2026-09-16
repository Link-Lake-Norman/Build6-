"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./licensing-admin.module.css";

type PaymentStatus = "NOT_STARTED" | "INVOICE_SENT" | "PO_APPROVED" | "PAID";
type AgreementStatus = "NOT_SENT" | "SENT" | "SIGNED";
type LicenseStatus =
  | "DRAFT"
  | "AWAITING_PURCHASE"
  | "AWAITING_SIGNATURE"
  | "READY_TO_ACTIVATE"
  | "ACTIVE"
  | "SUSPENDED"
  | "EXPIRED";

type LicenseRecord = {
  id: string;
  organization: string;
  organizationType: string;
  contactName: string;
  contactEmail: string;
  licensePackage: string;
  sites: number;
  seats: number;
  facilitators: number;
  termStart: string;
  termEnd: string;
  amount: string;
  paymentStatus: PaymentStatus;
  masterAgreement: AgreementStatus;
  supplementalAgreement: AgreementStatus;
  facilitatorAcknowledgments: boolean;
  privacyDataTerms: boolean;
  brandUseTerms: boolean;
  activationConfirmed: boolean;
  status: LicenseStatus;
  notes: string;
  updatedAt: string;
};

const STORAGE_KEY = "build6-admin-license-drafts-v1";

const emptyRecord = (): LicenseRecord => ({
  id: "",
  organization: "",
  organizationType: "School / Education",
  contactName: "",
  contactEmail: "",
  licensePackage: "BUILD6 Organization License",
  sites: 1,
  seats: 20,
  facilitators: 1,
  termStart: "",
  termEnd: "",
  amount: "",
  paymentStatus: "NOT_STARTED",
  masterAgreement: "NOT_SENT",
  supplementalAgreement: "NOT_SENT",
  facilitatorAcknowledgments: false,
  privacyDataTerms: false,
  brandUseTerms: false,
  activationConfirmed: false,
  status: "DRAFT",
  notes: "",
  updatedAt: new Date().toISOString(),
});

function makeId() {
  const year = new Date().getFullYear();
  const token = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `B6-${year}-${token}`;
}

function gateState(record: LicenseRecord) {
  const purchaseComplete =
    record.paymentStatus === "PAID" || record.paymentStatus === "PO_APPROVED";
  const masterSigned = record.masterAgreement === "SIGNED";
  const supplementalSigned = record.supplementalAgreement === "SIGNED";
  const operationalComplete =
    record.facilitatorAcknowledgments &&
    record.privacyDataTerms &&
    record.brandUseTerms;

  return {
    purchaseComplete,
    masterSigned,
    supplementalSigned,
    operationalComplete,
    ready:
      purchaseComplete &&
      masterSigned &&
      supplementalSigned &&
      operationalComplete,
  };
}

function deriveStatus(record: LicenseRecord): LicenseStatus {
  if (
    record.status === "ACTIVE" ||
    record.status === "SUSPENDED" ||
    record.status === "EXPIRED"
  ) {
    return record.status;
  }

  const gate = gateState(record);

  if (gate.ready) return "READY_TO_ACTIVATE";
  if (!gate.purchaseComplete) return "AWAITING_PURCHASE";
  if (!gate.masterSigned || !gate.supplementalSigned) return "AWAITING_SIGNATURE";
  return "DRAFT";
}

const statusLabel: Record<LicenseStatus, string> = {
  DRAFT: "Draft",
  AWAITING_PURCHASE: "Awaiting Purchase / PO",
  AWAITING_SIGNATURE: "Awaiting Signature",
  READY_TO_ACTIVATE: "Ready to Activate",
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  EXPIRED: "Expired",
};

export default function LicenseControlCenter() {
  const [records, setRecords] = useState<LicenseRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState<LicenseRecord>(emptyRecord());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? (JSON.parse(stored) as LicenseRecord[]) : [];
      setRecords(Array.isArray(parsed) ? parsed : []);
    } catch {
      setRecords([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records, loaded]);

  const gate = useMemo(() => gateState(draft), [draft]);

  const counts = useMemo(() => {
    const total = records.length;
    const active = records.filter((record) => record.status === "ACTIVE").length;
    const ready = records.filter(
      (record) =>
        deriveStatus(record) === "READY_TO_ACTIVATE" && record.status !== "ACTIVE",
    ).length;
    const waiting = records.filter((record) =>
      ["AWAITING_PURCHASE", "AWAITING_SIGNATURE"].includes(deriveStatus(record)),
    ).length;

    return { total, active, ready, waiting };
  }, [records]);

  function selectRecord(record: LicenseRecord) {
    setSelectedId(record.id);
    setDraft({ ...record });
  }

  function newRecord() {
    setSelectedId("");
    setDraft(emptyRecord());
  }

  function saveRecord(event?: FormEvent) {
    event?.preventDefault();

    if (!draft.organization.trim()) {
      window.alert("Organization name is required for the draft record.");
      return;
    }

    const next: LicenseRecord = {
      ...draft,
      id: draft.id || makeId(),
      status: deriveStatus(draft),
      updatedAt: new Date().toISOString(),
    };

    setDraft(next);
    setSelectedId(next.id);
    setRecords((current) => {
      const exists = current.some((record) => record.id === next.id);
      return exists
        ? current.map((record) => (record.id === next.id ? next : record))
        : [next, ...current];
    });
  }

  function simulateActivation() {
    if (!gate.ready || !draft.id) return;

    const next: LicenseRecord = {
      ...draft,
      activationConfirmed: true,
      status: "ACTIVE",
      updatedAt: new Date().toISOString(),
    };

    setDraft(next);
    setSelectedId(next.id);
    setRecords((current) =>
      current.map((record) => (record.id === next.id ? next : record)),
    );
  }

  function markSuspended() {
    if (!draft.id) return;
    const next: LicenseRecord = {
      ...draft,
      status: "SUSPENDED",
      activationConfirmed: false,
      updatedAt: new Date().toISOString(),
    };
    setDraft(next);
    setRecords((current) =>
      current.map((record) => (record.id === next.id ? next : record)),
    );
  }

  function removeDraft() {
    if (!draft.id) return;
    if (!window.confirm("Delete this local admin draft record?")) return;

    setRecords((current) => current.filter((record) => record.id !== draft.id));
    newRecord();
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.badge}>ADMIN BUILD • LOCAL ONLY • NOT LIVE</div>
          <p className={styles.eyebrow}>BUILD6™ Licensing Operations</p>
          <h1>License Control Center</h1>
          <p className={styles.lead}>
            Draft the complete purchase → agreement → activation workflow inside the
            protected admin before payment, e-signature, database storage or live
            account provisioning are connected.
          </p>
        </div>

        <button className={styles.newButton} type="button" onClick={newRecord}>
          + New License Draft
        </button>
      </header>

      <section className={styles.metrics} aria-label="Licensing pipeline summary">
        <article>
          <span>Total Draft Records</span>
          <strong>{counts.total}</strong>
        </article>
        <article>
          <span>Waiting</span>
          <strong>{counts.waiting}</strong>
        </article>
        <article>
          <span>Ready to Activate</span>
          <strong>{counts.ready}</strong>
        </article>
        <article>
          <span>Active — Local Simulation</span>
          <strong>{counts.active}</strong>
        </article>
      </section>

      <div className={styles.grid}>
        <aside className={styles.listPanel}>
          <div className={styles.panelTitle}>
            <div>
              <p>Pipeline</p>
              <h2>Organizations</h2>
            </div>
            <span>{records.length}</span>
          </div>

          {records.length === 0 ? (
            <div className={styles.empty}>
              No admin license drafts yet. Create one to test the gate.
            </div>
          ) : (
            <div className={styles.recordList}>
              {records.map((record) => {
                const currentStatus = deriveStatus(record);
                return (
                  <button
                    key={record.id}
                    type="button"
                    className={`${styles.recordButton} ${
                      selectedId === record.id ? styles.selected : ""
                    }`}
                    onClick={() => selectRecord(record)}
                  >
                    <strong>{record.organization}</strong>
                    <span>{record.id}</span>
                    <small>{statusLabel[currentStatus]}</small>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <section className={styles.editorPanel}>
          <div className={styles.panelTitle}>
            <div>
              <p>Admin Record</p>
              <h2>{draft.id ? draft.id : "New License Draft"}</h2>
            </div>
            <span>{statusLabel[deriveStatus(draft)]}</span>
          </div>

          <form onSubmit={saveRecord} className={styles.form}>
            <div className={styles.sectionTitle}>
              <h3>1. Organization + Scope</h3>
              <p>Define exactly who is being licensed and what the license covers.</p>
            </div>

            <div className={styles.formGrid}>
              <label>
                Organization Legal Name
                <input
                  value={draft.organization}
                  onChange={(event) =>
                    setDraft({ ...draft, organization: event.target.value })
                  }
                  placeholder="Organization name"
                />
              </label>

              <label>
                Organization Type
                <select
                  value={draft.organizationType}
                  onChange={(event) =>
                    setDraft({ ...draft, organizationType: event.target.value })
                  }
                >
                  <option>School / Education</option>
                  <option>Employer / Workforce</option>
                  <option>Nonprofit / Community</option>
                  <option>Consultant / Facilitator</option>
                  <option>College / University</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Authorized Contact
                <input
                  value={draft.contactName}
                  onChange={(event) =>
                    setDraft({ ...draft, contactName: event.target.value })
                  }
                />
              </label>

              <label>
                Contact Email
                <input
                  type="email"
                  value={draft.contactEmail}
                  onChange={(event) =>
                    setDraft({ ...draft, contactEmail: event.target.value })
                  }
                />
              </label>

              <label className={styles.full}>
                License Package
                <input
                  value={draft.licensePackage}
                  onChange={(event) =>
                    setDraft({ ...draft, licensePackage: event.target.value })
                  }
                />
              </label>

              <label>
                Sites / Campuses
                <input
                  type="number"
                  min="1"
                  value={draft.sites}
                  onChange={(event) =>
                    setDraft({ ...draft, sites: Number(event.target.value) || 1 })
                  }
                />
              </label>

              <label>
                Participant / Seat Limit
                <input
                  type="number"
                  min="1"
                  value={draft.seats}
                  onChange={(event) =>
                    setDraft({ ...draft, seats: Number(event.target.value) || 1 })
                  }
                />
              </label>

              <label>
                Authorized Facilitators
                <input
                  type="number"
                  min="1"
                  value={draft.facilitators}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      facilitators: Number(event.target.value) || 1,
                    })
                  }
                />
              </label>

              <label>
                License Amount
                <input
                  value={draft.amount}
                  onChange={(event) =>
                    setDraft({ ...draft, amount: event.target.value })
                  }
                  placeholder="$0.00"
                />
              </label>

              <label>
                Term Start
                <input
                  type="date"
                  value={draft.termStart}
                  onChange={(event) =>
                    setDraft({ ...draft, termStart: event.target.value })
                  }
                />
              </label>

              <label>
                Term End
                <input
                  type="date"
                  value={draft.termEnd}
                  onChange={(event) =>
                    setDraft({ ...draft, termEnd: event.target.value })
                  }
                />
              </label>
            </div>

            <div className={styles.sectionTitle}>
              <h3>2. Purchase Gate</h3>
              <p>
                No activation unless payment is completed or an approved purchase order
                is recorded.
              </p>
            </div>

            <div className={styles.formGrid}>
              <label>
                Payment / PO Status
                <select
                  value={draft.paymentStatus}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      paymentStatus: event.target.value as PaymentStatus,
                    })
                  }
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="INVOICE_SENT">Invoice Sent</option>
                  <option value="PO_APPROVED">PO Approved</option>
                  <option value="PAID">Paid</option>
                </select>
              </label>
            </div>

            <div className={styles.sectionTitle}>
              <h3>3. Agreement Gate</h3>
              <p>
                Track the agreements that must be executed before the organization can
                become an active licensee.
              </p>
            </div>

            <div className={styles.formGrid}>
              <label>
                Master License Agreement
                <select
                  value={draft.masterAgreement}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      masterAgreement: event.target.value as AgreementStatus,
                    })
                  }
                >
                  <option value="NOT_SENT">Not Sent</option>
                  <option value="SENT">Sent</option>
                  <option value="SIGNED">Signed</option>
                </select>
              </label>

              <label>
                Supplemental Agreement(s)
                <select
                  value={draft.supplementalAgreement}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      supplementalAgreement: event.target.value as AgreementStatus,
                    })
                  }
                >
                  <option value="NOT_SENT">Not Sent</option>
                  <option value="SENT">Sent</option>
                  <option value="SIGNED">Signed</option>
                </select>
              </label>
            </div>

            <div className={styles.checks}>
              <label>
                <input
                  type="checkbox"
                  checked={draft.facilitatorAcknowledgments}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      facilitatorAcknowledgments: event.target.checked,
                    })
                  }
                />
                Facilitator authorization / acknowledgments complete
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={draft.privacyDataTerms}
                  onChange={(event) =>
                    setDraft({ ...draft, privacyDataTerms: event.target.checked })
                  }
                />
                Privacy / data requirements complete
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={draft.brandUseTerms}
                  onChange={(event) =>
                    setDraft({ ...draft, brandUseTerms: event.target.checked })
                  }
                />
                Brand-use / proprietary-use requirements complete
              </label>
            </div>

            <div className={styles.sectionTitle}>
              <h3>4. Activation Gate</h3>
              <p>
                The workflow will not allow an active license until every required gate
                is complete.
              </p>
            </div>

            <div className={styles.gates}>
              <div className={gate.purchaseComplete ? styles.pass : styles.fail}>
                <strong>{gate.purchaseComplete ? "✓" : "○"} Purchase</strong>
                <span>Paid or approved PO</span>
              </div>
              <div className={gate.masterSigned ? styles.pass : styles.fail}>
                <strong>{gate.masterSigned ? "✓" : "○"} Master Agreement</strong>
                <span>Signed</span>
              </div>
              <div className={gate.supplementalSigned ? styles.pass : styles.fail}>
                <strong>{gate.supplementalSigned ? "✓" : "○"} Supplemental</strong>
                <span>Signed</span>
              </div>
              <div className={gate.operationalComplete ? styles.pass : styles.fail}>
                <strong>{gate.operationalComplete ? "✓" : "○"} Operational Terms</strong>
                <span>Facilitator + data + brand</span>
              </div>
            </div>

            <label className={styles.notes}>
              Internal Admin Notes
              <textarea
                rows={5}
                value={draft.notes}
                onChange={(event) =>
                  setDraft({ ...draft, notes: event.target.value })
                }
                placeholder="Internal notes only. Do not place sensitive personal data here while this remains a local draft."
              />
            </label>

            <div className={styles.actionBar}>
              <button className={styles.save} type="submit">
                Save Local Draft
              </button>

              <button
                className={styles.activate}
                type="button"
                onClick={simulateActivation}
                disabled={!draft.id || !gate.ready || draft.status === "ACTIVE"}
              >
                {draft.status === "ACTIVE"
                  ? "Active — Local Simulation"
                  : "Activate License — Local Simulation"}
              </button>

              <button
                className={styles.secondary}
                type="button"
                onClick={markSuspended}
                disabled={!draft.id}
              >
                Suspend Draft License
              </button>

              <button
                className={styles.delete}
                type="button"
                onClick={removeDraft}
                disabled={!draft.id}
              >
                Delete Local Draft
              </button>
            </div>
          </form>

          <div className={styles.integrationBox}>
            <h3>Live integrations intentionally OFF</h3>
            <div>
              <span>Payment processor</span>
              <strong>NOT CONNECTED</strong>
            </div>
            <div>
              <span>Electronic signature</span>
              <strong>NOT CONNECTED</strong>
            </div>
            <div>
              <span>License database</span>
              <strong>LOCAL BROWSER DRAFT ONLY</strong>
            </div>
            <div>
              <span>Account provisioning</span>
              <strong>NOT CONNECTED</strong>
            </div>
            <p>
              No button on this page charges a card, sends an agreement, changes the
              database, grants portal access, or activates a real customer account.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
