---
name: unsa-lab-report
description: Produces Spanish UNSA Ingeniería de Sistemas laboratory reports from a professor's PDF guide, with faithful Word formatting, hands-on tool execution, real screenshots, activity traceability, justified IEEE-cited questionnaire answers, conclusions, and verifiable bibliography. Use for lab/practice reports, workshop guides, task evidence, and laboratory transcriptions.
---

# UNSA Laboratory Report — evidence-first reporting skill

## Mission and language

Create a **finished, academically rigorous laboratory report in Spanish** by treating the current professor-provided **PDF laboratory guide as the source of truth**. Match the attached Word template and the style pattern documented in `references/STYLE_GUIDE.md`. Keep this skill's implementation instructions in English, but write the actual report naturally in Spanish. Use technical, human-sounding, coherent prose; avoid repetitive AI filler and inflated claims.

**Do not equate writing an explanation of an activity with executing that activity.** Software requirements require real execution and genuine evidence. Never simulate software usage, invent measurements, fabricate screenshots, misrepresent downloaded images as execution evidence, or cite nonexistent publications. If an action cannot be performed within the current environment, mark it as **pending or unverified** and say exactly why.

## When to activate

Use this skill when the user supplies a laboratory/practice PDF, an optional instructor transcript, or exercise files and requests an UNSA lab report, exercise completion, documentation, screenshots, questionnaire answers, or a matching `.docx`.

## Bundled resources (load only as needed)

- `references/STYLE_GUIDE.md`: measured layout, typography, exact colors, screenshots, and paragraph targets.
- `references/REPORT_BLUEPRINT.md`: required/conditional sections, examples and observations from seven user-provided lab reports.
- `references/EXECUTION_EVIDENCE.md`: actual application execution, capture practices, and integrity rules.
- `references/IEEE_REFERENCES.md`: reference discovery, verification, one-citation-per-paragraph policy, and audits.
- `templates/UNSA_Laboratory_Template.docx`: editable base with institutional header/branding, four original-style tables, and safe placeholders.
- `scripts/pdf_intake.py`: extract a PDF's page text and preliminary tasks into a machine-readable intake manifest.
- `scripts/validate_report.py`: run structural, typography, screenshot, and IEEE-citation checks on the completed DOCX.
- `examples/lab_manifest.schema.json`: traceability schema for tasks, tools, references, and evidence.

## Source precedence (strict)

1. **Current professor's PDF**: authoritative for title, subject, practices, instructions, questionnaire, annexes, required tools, deadlines, rubrics, and outputs.
2. **Current user instructions**: override default writing preferences and add requirements without silently discarding PDF-mandated work. If there is a conflict, surface it.
3. **Current attachments**: datasets, templates, project files, sample code, instructor transcript/recording, screenshots, and diagrams.
4. **Bundled style template and observed report conventions**: appearance and narrative conventions only, not current practice facts.
5. **Verified external sources**: necessary for technical explanations, real documentation, and justified answers, never as replacements for a professor's tasks.

A previous report's *title, subject, numbering, date, teacher, results, sources, and questions* must never be reused without checking the current PDF. Old reports include metadata mismatches; copying is not safe.

## Phase 1 — read and interpret the PDF thoroughly

1. Locate the current laboratory PDF and associated files. Do not confuse the professor's PDF guide with an example report.
2. Extract every page, including cover, objectives, equipment, requirements, exercises, proposed exercises, annexes, questionnaire, acceptance criteria, references, and rubric. Use `scripts/pdf_intake.py <guide.pdf> --out-dir work/intake` when Python/PyMuPDF is available.
3. **Visually inspect rendered page images**, especially screenshots, tables, diagrams, formulas, code snippets, scanned portions, and annexes. Plain-text extraction alone is insufficient. For a scanned page, use a capable visual reader before any carefully bounded OCR attempt.
4. Build a traceability manifest before writing. Each numbered or bulleted instruction must map to a unique task ID, the source page, required tool, input, execution method, expected artifact, and verification criterion. Include all annex tasks and questions.
5. Determine whether the guide demands a specific tool/version/operating system. Do not quietly replace a required tool with another. If it is unavailable, explain the blocker and mark that task pending.
6. Extract any requested exact text, variable names, numerical parameters, command sequences, file names, and test assertions **without changing their meaning**.
7. If an instructor transcript is attached: read in chronological order; translate demonstrations into actionable steps, retaining relevant names, commands, outputs and caveats. Use the PDF as the authoritative task scope; the transcript supplies execution details. Do not invent omitted actions.
8. Distinguish **mandatory** tasks from optional proposals and examples. Record the distinction in the manifest.

## Phase 2 — execute the laboratory work and collect evidence

1. Inspect available execution capabilities (terminal, browser, desktop GUI, IDE, SDK, emulator, game engine, authorized tools). Verify versions when useful and note constraints.
2. Install/setup the guide's required software when permitted and feasible. Prefer official downloads/documentation; do not bypass licensing, security warnings or organizational permissions.
3. Execute tasks in PDF order where dependencies permit. Develop the code, project, commands, diagrams, configurations, test cases or computations required by the assignment.
4. For each substantive step capture **authentic, readable screenshots** of the application or execution result. Save images in `work/evidence/` with names such as `step_03_jmeter_thread_group.png`. Capture the relevant window, not unrelated desktop content. Record the screenshot path against its task ID. For console-only tasks, save a log and, when visual evidence is requested, capture the actual terminal window or IDE output.
5. Capture essential states: setup/configuration, action/process, successful output or failure diagnosis, and final validation. Show input values and outcomes when they matter. Re-run/capture if the first image is unclear.
6. Do not represent official-site screenshots, diagrams, mockups or figures from the guide as proof of the user's own execution. Such illustrations must be labeled **reference illustration** or **guide-provided image**.
7. Never alter performance metrics, test outcomes, timestamps, data records, or screenshots to make them look successful. A genuine error is a valid documented result; investigate and explain.
8. If interactive UI access is unavailable, **do not write "se instaló / se ejecutó / se comprobó" as fact**. Instead provide independently verifiable textual preparation or runnable code and identify unfinished steps in the deliverables. Do not invent evidence to satisfy the screenshot requirement.
9. Before documenting success, verify that the produced project/code/measurement corresponds to the PDF's explicit acceptance condition.

For tool-specific evidence and safety, see `references/EXECUTION_EVIDENCE.md`.

## Phase 3 — compose the report in Spanish

Use the base DOCX template, preserving the institutional header and its visual geometry. Section coverage must follow the PDF, not a rigid generic outline. Common preferred sequence:

1. **INFORME DE LABORATORIO** and **INFORMACIÓN BÁSICA**: university/faculty/school, subject, practice title and number, academic year, term, submission date, student(s), teacher(s).
2. **SOLUCIÓN Y RESULTADOS**: section container under orange table heading.
3. **I. OBJETIVOS**: general objective (one paragraph, 40–65 words typically); specific objectives (usually 4–6 items, 15–35 words each). For an original guide with a single objective, preserve it or split only when justified.
4. **II. DESCRIPCIÓN DEL PROCEDIMIENTO REALIZADO EN LA PRÁCTICA**: `EJERCICIOS RESUELTOS`, `EJERCICIOS PROPUESTOS`, `ACTIVIDAD N`, `PASO N` as required. Organize chronologically, one faithful action per step where possible.
5. **RESULTADOS OBTENIDOS**: actual verified outputs, tables, screenshots, source files, numeric values and observed behavior; distinguish expectations from observations.
6. **ANÁLISIS DE RESULTADOS**: explain why results matter, compare cases or configurations, analyze unexpected behavior and limitations. This is not a copy of the execution narrative.
7. **CUESTIONARIO**: reproduce all questions in order and answer them directly. For questions requiring justification, apply the strict IEEE requirements below.
8. **CONCLUSIONES**: aim for 4–5 substantive Spanish paragraphs (about 65–100 words each); accurately synthesize achieved tasks, concrete results, conceptual learning, and limitations. Do not claim the project is finished if it is not. The reference corpus has 3–5 paragraphs, so adapt to professor/user scope.
9. **RECOMENDACIONES**: if requested by professor/user or strongly justified by assignment, make a separate section, normally 5–7 practical recommendations (roughly 25–55 words each). This was not a universal section in the seven example reports; never imply otherwise.
10. **RETROALIMENTACIÓN GENERAL**: preserve the existing institutional box, usually blank unless feedback is actually provided.
11. **REFERENCIAS Y BIBLIOGRAFÍA**: numbered IEEE entries, each real and verifiable.

Roman section numbering in old reports varies. Use coherent sequential numbering in a newly generated report; don't reproduce inconsistent numbering or an unrelated title from an exemplar. For an officially mandated template, keep its fixed labels.

### Paragraph-level writing rules

- **Procedure**: title `PASO N. <action>`; normally 1–2 paragraphs of 40–80 words each, describing purpose, actual action and result; add another paragraph only for a meaningful technical need. Keep screenshots immediately below the step they prove.
- **Results**: typically 50–100 words per result, plus evidence and concrete values; tables for comparisons.
- **Analysis**: typically 60–110 words per subsection, connecting observed data and theory, including limitations.
- **Questionnaire**: answer the exact question first; then justify with 1–3 paragraphs of about 45–90 words each, and more if needed to satisfy five unique references across a short questionnaire. Avoid bloating straightforward definitions.
- **Conclusions**: 4–5 distinct paragraphs by default, no speculative achievements.
- Style: concise, natural academic Spanish, clear connective phrases, no repetitive "se procedió" in every step; report completed actions in past tense **only when execution is verified**. No exclamation marks.
- Use bullets for objectives, checklists, multi-item comparisons and lists. Favor prose otherwise.
- Use legible code blocks or monospaced formatting for actual commands/source code; do not turn large code into blurry screenshots.

See `references/STYLE_GUIDE.md` for precise color/typography and `references/REPORT_BLUEPRINT.md` for variations observed in each reference file.

## Phase 4 — IEEE references, especially justified questionnaires

**Hard user requirement:** If a questionnaire asks to justify, explain, investigate, compare, or defend an answer, the finished report must contain **at least FIVE DISTINCT VERIFIED REFERENCES** relevant to the questionnaire, with bibliography entries in IEEE format. Spread citation use across the relevant answers rather than piling five citations in one sentence.

- A paragraph may include **at most one IEEE numeric citation marker**, e.g. `[1]`; do not use `[1], [2]` or `[1]–[3]` in the same paragraph.
- Put citations **inside the prose paragraph**, logically near the claim, e.g. "De acuerdo con el manual de Apache JMeter [1], ..." Do **not** create citation-only paragraphs and do not hide all citations solely in the final bibliography.
- If an answer requires three references, use three substantive paragraphs with one distinct citation in each as needed.
- Reuse a reference when relevant, but still cite **five distinct verifiable sources across a justified questionnaire**. Prefer different reputable organizations/authors and primary material (standards, official documentation, textbooks and peer-reviewed studies).
- Validate real author/publisher, title, year, version/edition, URL or DOI, and access date for web resources. Never invent a DOI, page, version, author or publication date. Verify each source by opening an actual authoritative page when web access exists. If browsing is unavailable, cite only verifiable supplied sources or clearly mark reference research pending: **do not fabricate verification**.
- IEEE bibliography numbering must be consistent with in-text usage, preferably in order of first citation; every in-text number must resolve to a complete entry, and entries should be cited in the report.
- The five-reference minimum applies when a justified questionnaire exists. Other report sections may additionally cite sources as warranted, still at most one citation per paragraph.

Read `references/IEEE_REFERENCES.md` before starting citation work.

## Phase 5 — build, render and quality-check the deliverables

1. Create a fully editable `.docx` using `templates/UNSA_Laboratory_Template.docx` as the base (prefer `python-docx`, Word, or LibreOffice), not a generic Markdown-only output. Preserve header logos, shaded institution tables, borders, A4, margins and justified Times New Roman typography.
2. Insert screenshots as native inline images anchored immediately after their relevant steps. Fit inside margins without distortion; do not crop away context that establishes authenticity. Optional concise `Figura N. ...` captions are encouraged for clarity when consistent with the guide.
3. Maintain real subsection breaks; avoid headings orphaned at page bottoms, empty screenshot slots, forced large white gaps, or figures spilling off the page. Apply the pagination rules below, especially for requirements and other information organized in tables.
4. Run `python scripts/validate_report.py <output.docx> --manifest <manifest.json>` (optional manifest), inspect the warnings and fix substantive ones. This script is a **heuristic check**, not proof that tasks or references are truthful.
5. Render the DOCX to PDF/page PNGs using available tools; visually inspect **every page** (especially first and last, page transitions, wide screenshots and all table boundaries). Repair clipping, overflow, footers/headers, bad breaks, and citation formatting, then rerender.
6. Double-check the original PDF line-by-line against the traceability manifest. No omitted mandatory activities, unanswered questions, missing annex outputs, or falsely claimed results.
7. Deliver a DOCX, and PDF only if requested, plus task-source mapping and evidence files when appropriate. Summarize completed/pending tasks truthfully.

### Extending an existing UNSA report

- Preserve the guide's visual identity when adding content. For this UNSA template, use bold red subsection headings (`C00000`), black justified Times New Roman 12 pt body text, centered tables and visible black table borders. Identify headings by their text and role as well as their style: headings inserted through OOXML may have lost their original `Heading` style. Check every new subsection explicitly for a red run color.
- Keep product branding separate from the institutional report. RESTORA's logo colors may style standalone companion files when requested; do not transfer that palette to the guide itself unless the user asks.
- Separate prose paragraphs visibly with paragraph spacing (normally 10 pt after body paragraphs, adjusted to the reference). Give headings modest space before and after. Do not imitate paragraph breaks with soft line breaks or repeated empty paragraphs, and do not collapse new prose into a dense block. Center tables as objects; keep prose justified and center short column headings where appropriate.
- Integrate new sections at the requested location. For RESTORA G01, planning and elicitation material belongs after all general and specific objectives and before the existing procedure. Do not place it before objectives or append it after conclusions and references. Preserve existing report text, tables and evidence when adding material; verify their preservation against a backup.
- Develop analysis around RESTORA's actual requirement IDs, actors, rules, examples and companion filenames. Explain how a finding affects a decision and what remains to validate. A table or generic statement does not replace an explanation. Distinguish represented interviews, documentary review, planned effort and measured execution.
- Before delivery, verify the new headings' red formatting, paragraph separation, body justification, table alignment and borders, section placement and preservation of previous content. If the user prohibits PDF generation, respect that instruction and use available non-PDF checks; do not claim rendered page review that was not performed.

### Compact pagination and continuity in Word

Optimize the distribution of content across pages so the report remains professional, compact and orderly, without changing the original information or the institutional template's visual identity.

- **Allow table rows to split across pages when needed.** Remove or disable `w:cantSplit` on rows whose content would otherwise be moved unnecessarily to the next page. Do not keep an entire long requirement, section or report-sized table row together merely because it is inside a table. Preserve a short block as a unit only when doing so improves readability without leaving excessive blank space.
- **Review paragraph pagination properties, including inherited styles.** Disable “Keep with next” (`w:keepNext` / «Conservar con el siguiente»), “Keep lines together” (`w:keepLines` / «Conservar líneas juntas») and “Page break before” (`w:pageBreakBefore` / «Salto de página anterior») wherever they produce unjustified gaps or move oversized blocks. In Word tables, chained keep settings can push several otherwise unrelated rows onto another page; do not apply these settings indiscriminately to every paragraph or requirement card.
- **Remove unnecessary empty paragraphs and breaks.** Delete redundant manual page breaks, section breaks and blank paragraphs used only to force spacing. Keep intentional structural breaks and the template's necessary spacing. Use paragraph spacing instead of repeated empty lines.
- **Keep headings and evidence organized.** Keep a heading with a reasonable amount of the following content, and a figure with its caption, without attaching an entire section or multiple figures into one unbreakable block. Maintain clear table headings and readable continuation when content crosses a page boundary.
- **Preserve content while improving flow.** Retain all original text, data, identifiers, references and evidence. Do not delete information, distort images or reduce text to an unreadable size to make the document shorter. Favor efficient use of each page and continuous reading over an arbitrary page count.
- **Verify the rendered result.** Inspect every page, including the first page, table continuations and the final page. Correct excessive blank areas, isolated headings, clipped content and unnecessary page jumps; render again after pagination changes. A successful DOCX export alone does not establish that the layout is satisfactory.

## Acceptance / stop conditions

A deliverable is complete only when:

- Every mandatory PDF activity/question has an explicit `completed` or `blocked` status and maps to a report location.
- Every claimed software outcome is backed by real execution output/evidence; screenshot count follows actual relevant tasks, not an arbitrary quota.
- Each compulsory tool was used when available, with version, project artifacts and reproducible settings recorded.
- Spanish prose, layout, colors and fonts follow the style guide, with required sections included and optional ones used appropriately.
- Questionnaires with justification use at least five **verified** sources and max one in-text IEEE marker per paragraph.
- Bibliography numbering/links are coherent, and page images have passed visual QA.
- Page flow is compact and continuous: no unjustified large blank areas or unnecessary page breaks remain, table rows can split where appropriate, and headings and captions remain correctly associated with their content without changing the original information.
- No made-up screenshot, source, test run, numerical result, participant name, professor name, or deadline appears in the report.

If any condition is unmet, deliver transparent partial work and clearly state the blockers; never disguise a draft as a fully executed laboratory.
