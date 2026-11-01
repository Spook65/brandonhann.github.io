import { useState } from "react";
import waitingPose from "../../art-direction/living-signal/courier-waiting.svg?url";
import inspectingPose from "../../art-direction/living-signal/courier-inspecting.svg?url";
import deniedPose from "../../art-direction/living-signal/courier-denied.svg?url";
import { caseStudies } from "../data/caseStudies";
import styles from "./SecureAgentMobile.module.css";

type Stage = "idle" | "selected" | "result";

// Source-derived synthetic example: SecureAgent Lab's gateway test denies a
// send_message to an unapproved recipient before invoking the mock executor.
const example = {
  tool: "send_message",
  resource: "doc:public",
  recipient: "recipient:unapproved",
  decision: "DENY",
  reason: "RECIPIENT_NOT_APPROVED",
} as const;

const poseByStage: Record<Stage, string> = {
  idle: waitingPose,
  selected: inspectingPose,
  result: deniedPose,
};

const secureAgent = (() => {
  const study = caseStudies.find(({ project }) => project.id === "project-secureagent");
  if (!study) throw new Error("SecureAgent Lab case study is missing.");
  return study;
})();

export function SecureAgentMobile() {
  const [stage, setStage] = useState<Stage>("idle");
  const base = import.meta.env.BASE_URL;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href={base}>BH <span>Brandon Hann</span></a>
        <a className={styles.projects} href={`${base}#projects`}>Projects <span aria-hidden="true">↗</span></a>
      </header>
      <main className={styles.main}>
        <p className={styles.kicker}>Interactive study / {secureAgent.project.name}</p>
        <h1>One request.<br /><span>One boundary.</span></h1>
        <p className={styles.intro}>The courier brings an illustrative tool request to a policy check. You decide when to inspect it.</p>

        <section className={styles.experience} aria-label="Illustrative SecureAgent request" data-stage={stage}>
          <div className={styles.scene} aria-hidden="true">
            <div className={styles.sceneGrain} />
            <span className={styles.sceneLabel}>RELAY / 01</span>
            <div className={styles.route} />
            <img className={styles.courier} src={poseByStage[stage]} width="120" height="144" alt="" />
            {stage !== "idle" && <div className={styles.packet}><span>REQUEST</span></div>}
            <div className={styles.boundary}>
              <span className={styles.boundaryMark}>{stage === "result" ? "×" : "?"}</span>
              <span>POLICY</span>
            </div>
          </div>

          <div className={styles.content}>
            {stage === "idle" && (
              <>
                <p className={styles.eyebrow}>COURIER WAITING</p>
                <h2>What happens before an AI tool acts?</h2>
                <p>Inspect a synthetic request, then choose whether to check its policy.</p>
                <button className={styles.primary} type="button" onClick={() => setStage("selected")}>Inspect a request <span aria-hidden="true">→</span></button>
              </>
            )}
            {stage === "selected" && (
              <>
                <p className={styles.eyebrow}>PROPOSED TOOL ACTION · SYNTHETIC</p>
                <h2>Send a document to a recipient.</h2>
                <dl className={styles.requestDetails}>
                  <div><dt>Tool</dt><dd>{example.tool}</dd></div>
                  <div><dt>Document</dt><dd>{example.resource}</dd></div>
                  <div><dt>Recipient</dt><dd>{example.recipient}</dd></div>
                </dl>
                <p className={styles.note}>This is a local illustration of a test fixture, not a live gateway call.</p>
                <div className={styles.actions}>
                  <button className={styles.primary} type="button" onClick={() => setStage("result")}>Check policy <span aria-hidden="true">→</span></button>
                  <button className={styles.secondary} type="button" onClick={() => setStage("idle")}>Back</button>
                </div>
              </>
            )}
            {stage === "result" && (
              <>
                <p className={styles.eyebrow}>POLICY CHECK · ILLUSTRATIVE</p>
                <div className={styles.decision} role="status" aria-live="polite" aria-atomic="true">
                  <h2>{example.decision} <span>Request stopped.</span></h2>
                  <p>The recipient is not approved for this synthetic request. The mock tool is not invoked.</p>
                  <code>{example.reason}</code>
                </div>
                <button className={styles.secondary} type="button" onClick={() => setStage("idle")}>Reset example <span aria-hidden="true">↺</span></button>
              </>
            )}
            <a className={styles.caseStudy} href={`${base}#${secureAgent.project.id}`}>Read the actual {secureAgent.project.name} case study <span aria-hidden="true">↗</span></a>
          </div>
        </section>
        <p className={styles.scope}>Illustrative offline example. This page performs no tool action, API request, or live security decision.</p>
        <noscript><p className={styles.noScript}>The interaction needs JavaScript. The case-study link above remains available.</p></noscript>
      </main>
    </div>
  );
}
