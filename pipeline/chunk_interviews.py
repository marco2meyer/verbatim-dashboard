#!/usr/bin/env python3
"""
chunk_simulation_conversations.py

Read all JSON "simulation" files from a folder (each with a structure like:

{
  "id": "...",
  "title": "Simulation: ...",
  "contact_name": "...",
  "messages": [
    { "type": "system_message", "text": "First name: ... Occupation: ..." },
    { "type": "intro_message", "text": "..." },
    { "type": "user_message", "text": "..." },
    { "type": "ai_message", "text": "..." },
    ...
  ]
}

and convert them into a single combined JSON of chunked interviews:

{
  "INTERVIEWS": [
    {
      "interview_id": "...",
      "interviewee_first_name": "...",
      "interviewee_role": "...",
      "chunks": [
        { "chunk_number": 1, "speaker": "interviewer", "text": "..." },
        { "chunk_number": 2, "speaker": "interviewee", "text": "..." }
      ]
    },
    ...
  ]
}

Usage:
    python chunk_simulation_conversations.py /path/to/input_folder output.json
"""

import json
import os
import sys
from typing import Any, Dict, List, Optional


def extract_name_role_from_system(system_text: str) -> (Optional[str], Optional[str]):
    """
    Parse a system_message text for lines like:
        First name: Sarah
        Occupation: Principal Conservation Officer
    Return (first_name, role) or (None, None) if not found.
    """
    first = None
    role = None

    for line in system_text.splitlines():
        line_stripped = line.strip()
        if "First name:" in line_stripped:
            first = line_stripped.split("First name:", 1)[1].strip()
        if "Occupation:" in line_stripped:
            role = line_stripped.split("Occupation:", 1)[1].strip()

    return first, role


def chunk_single_conversation(conv: Dict[str, Any]) -> Dict[str, Any]:
    """
    Take one simulation JSON object and return a chunked interview dict:
        {
          "interview_id": ...,
          "interviewee_first_name": ...,
          "interviewee_role": ...,
          "chunks": [...]
        }
    """
    interview_id = conv.get("id") or conv.get("conversation_id")
    contact_name = conv.get("contact_name")

    first_name: Optional[str] = None
    role: Optional[str] = None

    # Find system_message with First name and Occupation
    for m in conv.get("messages", []):
        if m.get("type") == "system_message" and isinstance(m.get("text"), str):
            maybe_first, maybe_role = extract_name_role_from_system(m["text"])
            if maybe_first:
                first_name = maybe_first
            if maybe_role:
                role = maybe_role
            # We assume first such system message is enough
            if first_name or role:
                break

    # Fallbacks
    if not first_name and contact_name:
        first_name = contact_name.split()[0]
    if not first_name:
        first_name = "unknown"
    if not role:
        role = "unknown"

    chunks: List[Dict[str, Any]] = []
    chunk_number = 1

    for m in conv.get("messages", []):
        m_type = m.get("type")
        text = m.get("text")

        # Only treat ai_message/user_message as chunks
        if m_type not in ("ai_message", "user_message"):
            continue
        if text is None:
            continue

        speaker = "interviewer" if m_type == "ai_message" else "interviewee"

        chunks.append({"chunk_number": chunk_number, "speaker": speaker, "text": text})
        chunk_number += 1

    return {
        "interview_id": interview_id,
        "interviewee_first_name": first_name,
        "interviewee_role": role,
        "chunks": chunks,
    }


def load_conversation_file(path: str) -> Optional[Dict[str, Any]]:
    """
    Load a single simulation JSON file and return its dict,
    or None if it does not look like a conversation object.
    """
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Heuristic: must have "messages" key that is a list
    if not isinstance(data, dict):
        return None
    if "messages" not in data or not isinstance(data["messages"], list):
        return None

    return data


def convert_folder(input_folder: str) -> Dict[str, Any]:
    """
    Walk a folder, load all .json simulations, chunk them,
    and return the combined structure:
        { "INTERVIEWS": [ ... ] }
    """
    interviews: List[Dict[str, Any]] = []

    for filename in sorted(os.listdir(input_folder)):
        if not filename.lower().endswith(".json"):
            continue
        path = os.path.join(input_folder, filename)

        conv = load_conversation_file(path)
        if conv is None:
            continue

        chunked = chunk_single_conversation(conv)
        interviews.append(chunked)

    return {"INTERVIEWS": interviews}


def main():
    if len(sys.argv) != 3:
        print(
            "Usage: python chunk_simulation_conversations.py /path/to/input_folder output.json"
        )
        sys.exit(1)

    input_folder = sys.argv[1]
    output_path = sys.argv[2]

    if not os.path.isdir(input_folder):
        print(f"Error: {input_folder} is not a directory")
        sys.exit(1)

    result = convert_folder(input_folder)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(result['INTERVIEWS'])} interviews to {output_path}")


if __name__ == "__main__":
    main()
