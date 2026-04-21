"""LLM client interface.

We deliberately use a thin, provider-neutral abstraction here. The concrete
implementation behind `get_llm_client()` is selected by configuration —
currently an OpenAI-compatible HTTP endpoint (which is how Nemotron-3 is
typically served via NVIDIA NIM). Swapping to a local llama.cpp server,
vLLM, or TGI later means changing only the `_HTTPChatClient` body.

No token limits, rate handling, or prompt caching yet — add them when the
real workload shows up.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal, Protocol

import httpx

from app.config import settings


@dataclass
class LLMMessage:
    role: Literal["system", "user", "assistant"]
    content: str


@dataclass
class LLMResponse:
    content: str
    model: str
    finish_reason: str | None = None


class LLMClient(Protocol):
    async def chat(
        self,
        messages: list[LLMMessage],
        *,
        temperature: float = 0.1,
        max_tokens: int = 1024,
        json_mode: bool = False,
    ) -> LLMResponse: ...


class NullLLMClient:
    """Returned when no LLM endpoint is configured. The Extractor checks
    `isinstance(client, NullLLMClient)` and routes around it rather than
    calling into a no-op — that keeps the audit trail clean about what
    actually ran vs. what was skipped.
    """

    model: str = "null"

    async def chat(
        self,
        messages: list[LLMMessage],  # noqa: ARG002
        *,
        temperature: float = 0.1,  # noqa: ARG002
        max_tokens: int = 1024,  # noqa: ARG002
        json_mode: bool = False,  # noqa: ARG002
    ) -> LLMResponse:
        raise RuntimeError("NullLLMClient.chat called; configure TECHPHYSIO_LLM_ENDPOINT.")


class _HTTPChatClient:
    """OpenAI-compatible chat completions client. Works with Nemotron served
    via NIM, vLLM's OpenAI endpoint, llama.cpp's server, LM Studio, etc.
    """

    def __init__(self, endpoint: str, model: str, api_key: str | None) -> None:
        self.endpoint = endpoint.rstrip("/")
        self.model = model
        self._headers = {"Content-Type": "application/json"}
        if api_key:
            self._headers["Authorization"] = f"Bearer {api_key}"

    async def chat(
        self,
        messages: list[LLMMessage],
        *,
        temperature: float = 0.1,
        max_tokens: int = 1024,
        json_mode: bool = False,
    ) -> LLMResponse:
        payload: dict[str, object] = {
            "model": self.model,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if json_mode:
            payload["response_format"] = {"type": "json_object"}

        async with httpx.AsyncClient(timeout=60.0) as http:
            resp = await http.post(
                f"{self.endpoint}/v1/chat/completions",
                headers=self._headers,
                json=payload,
            )
            resp.raise_for_status()
            body = resp.json()

        choice = body["choices"][0]
        return LLMResponse(
            content=choice["message"]["content"],
            model=body.get("model", self.model),
            finish_reason=choice.get("finish_reason"),
        )


def get_llm_client() -> LLMClient:
    if not settings.llm_configured:
        return NullLLMClient()
    return _HTTPChatClient(
        endpoint=settings.llm_endpoint or "",
        model=settings.llm_model,
        api_key=settings.llm_api_key,
    )
