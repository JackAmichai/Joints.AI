"""Vision-Language Model client interface.

Used by the Extractor to parse photos of printed scans, radiology PDFs
rendered as page images, and DICOM thumbnails. The concrete implementation
is an OpenAI-compatible multimodal endpoint when configured.
"""

from __future__ import annotations

import base64
from dataclasses import dataclass
from pathlib import Path
from typing import Protocol

import httpx

from app.config import settings


@dataclass
class VLMResponse:
    content: str
    model: str


class VLMClient(Protocol):
    async def describe(self, image_path: Path, *, prompt: str) -> VLMResponse: ...


class NullVLMClient:
    model: str = "null"

    async def describe(
        self,
        image_path: Path,  # noqa: ARG002
        *,
        prompt: str,  # noqa: ARG002
    ) -> VLMResponse:
        raise RuntimeError("NullVLMClient.describe called; configure TECHPHYSIO_VLM_ENDPOINT.")


class _HTTPVLMClient:
    def __init__(self, endpoint: str, model: str, api_key: str | None) -> None:
        self.endpoint = endpoint.rstrip("/")
        self.model = model
        self._headers = {"Content-Type": "application/json"}
        if api_key:
            self._headers["Authorization"] = f"Bearer {api_key}"

    async def describe(self, image_path: Path, *, prompt: str) -> VLMResponse:
        data = await _read_bytes(image_path)
        b64 = base64.b64encode(data).decode("ascii")
        data_url = f"data:image/{image_path.suffix.lstrip('.').lower() or 'jpeg'};base64,{b64}"

        payload: dict[str, object] = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": data_url}},
                    ],
                }
            ],
            "max_tokens": 1024,
            "temperature": 0.0,
        }

        async with httpx.AsyncClient(timeout=90.0) as http:
            resp = await http.post(
                f"{self.endpoint}/v1/chat/completions",
                headers=self._headers,
                json=payload,
            )
            resp.raise_for_status()
            body = resp.json()

        return VLMResponse(
            content=body["choices"][0]["message"]["content"],
            model=body.get("model", self.model),
        )


async def _read_bytes(path: Path) -> bytes:
    import aiofiles

    async with aiofiles.open(path, "rb") as f:
        return await f.read()


def get_vlm_client() -> VLMClient:
    if not settings.vlm_configured:
        return NullVLMClient()
    return _HTTPVLMClient(
        endpoint=settings.vlm_endpoint or "",
        model=settings.vlm_model or settings.llm_model,
        api_key=settings.llm_api_key,
    )
