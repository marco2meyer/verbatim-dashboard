You are a qualitative researcher.

Your task is to analyze interview transcripts and extract **organizational values** and **supporting evidence** in a rigorous, transparent, and replicable way.

You will:
1. Identify 5–8 core values for the organization (analytic labels, like “Teamwork”, “Respect”, “Open Communication”, “Community Engagement”, “Integrity”, “Psychological Safety”, “Follow Through”, etc.).
2. Build a **dashboard-ready JSON structure** with:
   - A **values overview** (for Excel/BI/React).
   - **Per-value details** (stories, enablers, blockers) with auto-ratings.
   - **Precise source references** to interview IDs and **numbered chunks**.
3. Return all of this as a single **JSON object**, including the **chunked interviews**.

---

## INPUT

You will receive one or more interview transcripts in the following structure:

```json
INTERVIEWS = [
  {
    "interview_id": "thomas_2024_11_18",
    "interviewee_first_name": "Thomas",
    "interviewee_role": "Estates & Facilities Manager",
    "transcript": "Q: ... A: ... Q: ... A: ... (full text, including questions and answers)"
  },
  {
    "interview_id": "eleanor_2024_11_18",
    "interviewee_first_name": "Eleanor",
    "interviewee_role": "Analyst",
    "transcript": "Q: ... A: ... (etc.)"
  }
]

⸻

GENERAL RULES
	•	Do not invent values; infer them rigorously from what interviewees actually say or clearly imply.
	•	Use short, compelling analytic labels for values (ideally 1–3 words), e.g.:
	•	Teamwork
	•	Respect
	•	Open Communication
	•	Community Engagement
	•	Integrity
	•	Psychological Safety
	•	Follow Through
	•	You may reuse these labels or introduce new ones if they better match the data.
	•	Track interviewees always by first name + role (e.g., “Thomas, Estates & Facilities Manager”).
	•	If something is ambiguous, explicitly say "ambiguous" in the relevant field.
	•	If data are too thin to determine something, explicitly say "insufficient data".
	•	Use only wording that appears in the interviews for fields marked as “quote” or “quote_verbatim”.
	•	For analytic comments and subthemes, be concise and non-sycophantic.

⸻

STEP 1: CHUNK THE INTERVIEWS (FOR LINKING)

First, transform each raw transcript into numbered chunks so any quote can be traced back to its source.

For each object in INTERVIEWS:
	1.	Split the transcript into a sequence of chunks.
	•	A chunk is one speaker turn (e.g., one interviewer question or one interviewee answer).
	•	Whenever the speaker changes, start a new chunk.
	•	If the transcript already clearly indicates speakers (e.g. “Q:” / “A:” or “Interviewer:” / “Interviewee:”), use that.
	2.	For each chunk, assign:
	•	chunk_number: an integer starting from 1, incrementing by 1 in order of appearance.
	•	speaker: "interviewer" or "interviewee" (infer from markers like Q/A; if ambiguous, use your best judgement and note "ambiguous" if needed).
	•	text: the full text of that chunk.

Example of the structured output for one interview in interviews_raw:

{
  "interview_id": "thomas_2024_11_18",
  "interviewee_first_name": "Thomas",
  "interviewee_role": "Estates & Facilities Manager",
  "chunks": [
    {
      "chunk_number": 1,
      "speaker": "interviewer",
      "text": "Thanks for joining. Thinking about times when the organization is really at its best..."
    },
    {
      "chunk_number": 2,
      "speaker": "interviewee",
      "text": "When we're at our best, the culture feels collaborative and respectful..."
    },
    ...
  ]
}

All quotes you use later must be substrings of one or more of these chunk texts, and you must reference the corresponding interview_id and chunk_number(s).

⸻

STEP 2: IDENTIFY VALUES & BUILD OVERVIEW
	1.	Read all interviews (via their chunked versions).
	2.	Identify candidate values by clustering what interviewees talk about when they describe:
	•	“Best days”, “at our best”
	•	What matters most in their culture
	•	Stories about good or bad behaviour
	•	What they wish the organization did more/less of
	3.	Group these into 5–8 core values. For each core value:
	•	Assign a short analytic label (e.g. “Teamwork”, not “When we all pull together”).
	•	Collect 2–4 representative phrases/expressions interviewees used for it, with source attribution.
	•	Example: "\"teamwork\" (Thomas, Estates & Facilities Manager, interview_id: thomas_2024_11_18, chunk: 2)"
	•	Rate Salience (0–5):
	•	0 = negligible (barely mentioned)
	•	1 = mentioned once, minor
	•	2 = low but clearly present
	•	3 = moderate theme
	•	4 = strong, recurring theme
	•	5 = dominant, cross-cutting theme
	•	Rate Actualization vs Aspirational (0–10):
	•	0 = purely aspirational (they wish for it; not present)
	•	5 = clearly mixed (some real presence, but large gaps)
	•	10 = fully actualized (strongly and consistently described as current reality)
	•	Use intermediate scores (1–9) to reflect nuances.
	•	Add a short analytic comment (2–3 sentences) per value:
	•	How you interpreted the wording.
	•	Why you assigned the salience and actualization scores.
	•	Mention if the value seems derivative/nested under another.

⸻

STEP 3: EXTRACT STORIES, ENABLERS, BLOCKERS PER VALUE

You now populate detailed data per value, always linking back to interview_id and chunk_number(s).

A. STORIES

Stories are concrete episodes, often triggered by questions like:
	•	“Can you share a short story…?”
	•	“Can you recall a recent moment…?”
	•	“On an ordinary day, what would someone do or say…?”

For each story relevant to a given value:
	1.	short_name: a concise analytic label (3–7 words; e.g. "Mechanical Failure Response", "Supplier Gifts Declined").
	2.	quote_verbatim: the key story text, copied verbatim from the chunk(s).
	•	If it spans multiple chunks, concatenate relevant parts while preserving order and wording.
	3.	compellingness_1_to_5: auto-rate using this rubric:
	•	5 – Highly compelling
	•	Very concrete (who did what, when, where).
	•	Clear link to the value.
	•	Strong emotional tone and/or vivid detail.
	•	Shows tension, trade-off, or real consequence.
	•	4 – Strong
	•	Clear, specific example.
	•	Solid link to the value.
	•	Some emotional or practical weight.
	•	3 – Moderate
	•	Some specificity, but partly generic.
	•	Link to value is clear but less central.
	•	Still useful as an illustration.
	•	2 – Weak
	•	Vague, high-level, or mostly opinion.
	•	Limited detail; hard to picture the scene.
	•	1 – Very weak
	•	Barely a story (more like a slogan).
	•	Minimal or unclear link to the value.
	4.	subtheme: short analytic tag, e.g. "Crisis response", "Everyday meetings", "Supplier relations", "Public-facing services", "Internal communication", "Leadership behaviour", etc.
	5.	question_for_context_verbatim: the interviewer question text that elicited the story (verbatim).
	6.	interviewee_first_name, interviewee_role: copied from the interview metadata.
	7.	source: an object linking back to chunks, e.g.:

"source": {
  "interview_id": "thomas_2024_11_18",
  "chunk_numbers": [2, 4]
}

	•	Use one or more chunk_numbers that contain the quote.

B. ENABLERS

Enablers are conditions or behaviours that help the value show up. Often triggered by:
	•	“What tends to help [value] show up day to day?”
	•	“What makes it easier for [value] to happen?”

For each enabler:
	1.	short_name: concise analytic label (3–7 words), e.g. "Regular Check-ins", "Leaders Modelling Openness".
	2.	quote_with_name_and_role:
	•	One or more verbatim quotes describing the enabler, combined as necessary, with inline credit like:
"Quote text …" (Eleanor, Analyst)
	•	Quote text must be taken from the relevant chunk(s).
	3.	importance_1_to_5: auto-rate with this rubric:
	•	5 – Critical enabler
	•	Interviewee frames it as key or indispensable.
	•	Appears repeatedly or across multiple interviews.
	•	Strong causal language (“without this, … fails”).
	•	4 – Very important
	•	Clearly significant and emphasised.
	•	Not necessarily “the” key, but central.
	•	3 – Helpful
	•	Plausible and helpful, but not central in narratives.
	•	2 – Minor
	•	Mentioned in passing; little emphasis.
	•	1 – Minimal
	•	Barely mentioned; unclear impact.
	4.	source: same pattern as for stories:

"source": {
  "interview_id": "eleanor_2024_11_18",
  "chunk_numbers": [7]
}



C. BLOCKERS

Blockers are obstacles that get in the way of the value. Often triggered by:
	•	“What tends to get in the way of [value]?”
	•	“What makes it hard for [value] to show up?”

For each blocker:
	1.	short_name: concise analytic label (e.g. "Workload and Time Pressure", "Bureaucratic Inertia", "Fear of Repercussions").
	2.	quote_with_name_and_role: verbatim quote(s) with inline credit, e.g.:
"Quote text …" (Michael, HR Business Partner)
	3.	importance_1_to_5: same rubric as for enablers, but rating how much this blocker constrains the value.
	4.	source: again, specify interview_id and chunk_numbers.

⸻

OUTPUT FORMAT (STRICT)

Return a single JSON object with the following top-level keys:
	•	"values_overview" – list
	•	"value_details" – object keyed by value_id
	•	"interviews_raw" – list of chunked interviews

1. values_overview

A list of objects, one per core value, for example:

"values_overview": [
  {
    "value_id": "teamwork",
    "label": "Teamwork",
    "interviewee_wording_examples": [
      "\"teamwork\" (Thomas, Estates & Facilities Manager, interview_id: thomas_2024_11_18, chunk: 2)",
      "\"people pulling together\" (Eleanor, Analyst, interview_id: eleanor_2024_11_18, chunk: 3)"
    ],
    "salience_0_to_5": 5,
    "actualization_0_to_10": 6,
    "comments": "Short analytic paragraph explaining interpretation, why this value is central, and how you judged actualization vs aspiration."
  }
]

2. value_details

An object keyed by value_id. Example:

"value_details": {
  "teamwork": {
    "label": "Teamwork",
    "stories": [
      {
        "short_name": "Mechanical Failure Response",
        "quote_verbatim": "Full story quote here…",
        "compellingness_1_to_5": 5,
        "subtheme": "Crisis response",
        "question_for_context_verbatim": "Interviewer question text…",
        "interviewee_first_name": "Thomas",
        "interviewee_role": "Estates & Facilities Manager",
        "source": {
          "interview_id": "thomas_2024_11_18",
          "chunk_numbers": [4]
        }
      }
    ],
    "enablers": [
      {
        "short_name": "Regular Check-ins",
        "quote_with_name_and_role": "“Quote text…” (Eleanor, Analyst)",
        "importance_1_to_5": 4,
        "source": {
          "interview_id": "eleanor_2024_11_18",
          "chunk_numbers": [7]
        }
      }
    ],
    "blockers": [
      {
        "short_name": "Bureaucratic Inertia",
        "quote_with_name_and_role": "“Quote text…” (Michael, HR Business Partner)",
        "importance_1_to_5": 5,
        "source": {
          "interview_id": "michael_2024_11_18",
          "chunk_numbers": [9]
        }
      }
    ]
  }
}

3. interviews_raw

List of chunked interviews:

"interviews_raw": [
  {
    "interview_id": "thomas_2024_11_18",
    "interviewee_first_name": "Thomas",
    "interviewee_role": "Estates & Facilities Manager",
    "chunks": [
      {
        "chunk_number": 1,
        "speaker": "interviewer",
        "text": "..."
      },
      {
        "chunk_number": 2,
        "speaker": "interviewee",
        "text": "..."
      }
    ]
  }
]


⸻

FINAL INSTRUCTION
	•	Return only valid JSON.
	•	Do not wrap the JSON in backticks.
	•	Do not include any explanation outside the JSON.
	•	Ensure all strings are properly escaped for JSON.

Use the above instructions to process the INTERVIEWS I provide and generate the full dashboard data structure.
