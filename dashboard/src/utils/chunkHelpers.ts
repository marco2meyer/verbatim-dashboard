import { type Interview, type Chunk } from '../types';

/**
 * Gets the display text for a chunk (edited text if available, otherwise original)
 */
export function getChunkDisplayText(chunk: Chunk): string {
  return chunk.edited_text || chunk.text;
}

/**
 * Gets text from chunks by source (interview_id and chunk_numbers)
 */
export function getTextFromSource(
  interviews: Interview[],
  interviewId: string,
  chunkNumbers: number[]
): string {
  const interview = interviews.find((i) => i.interview_id === interviewId);
  if (!interview) return '';

  const texts = chunkNumbers
    .map((chunkNum) => {
      const chunk = interview.chunks.find((c) => c.chunk_number === chunkNum);
      return chunk ? getChunkDisplayText(chunk) : '';
    })
    .filter((text) => text.length > 0);

  return texts.join(' ');
}
