import "server-only";

import { requireValue, serverEnv } from "@/lib/env";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

/**
 * Minimal OpenRouter chat helper for optional AI features (e.g. writing
 * feedback). Server-only. Uses fetch directly — no SDK dependency.
 */
export async function openRouterChat(
  messages: ChatMessage[],
  { model = "anthropic/claude-3.5-sonnet" }: { model?: string } = {},
) {
  const { OPENROUTER_API_KEY } = serverEnv();

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireValue(OPENROUTER_API_KEY, "OPENROUTER_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!res.ok) {
    throw new Error(
      `OpenRouter request failed: ${res.status} ${res.statusText}`,
    );
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message.content ?? "";
}
