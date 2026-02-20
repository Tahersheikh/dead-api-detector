"""
Core health-check engine.
Sends async HTTP GET requests concurrently and records results.
"""
import asyncio
import time
import logging
from typing import Optional
import httpx

logger = logging.getLogger(__name__)

TIMEOUT_SECONDS = 10.0
MAX_CONCURRENT = 20  # Semaphore limit to avoid hammering


async def check_single_api(
    client: httpx.AsyncClient,
    api_id: str,
    name: str,
    url: str,
    semaphore: asyncio.Semaphore,
) -> dict:
    """Check one API and return a result dict."""
    async with semaphore:
        start = time.monotonic()
        try:
            response = await client.get(url, follow_redirects=True)
            elapsed_ms = int((time.monotonic() - start) * 1000)
            is_up = 200 <= response.status_code < 300

            return {
                "api_id":           api_id,
                "name":             name,
                "status":           "up" if is_up else "down",
                "response_time_ms": elapsed_ms,
                "status_code":      response.status_code,
                "error":            None,
            }

        except httpx.TimeoutException:
            return {
                "api_id":           api_id,
                "name":             name,
                "status":           "down",
                "response_time_ms": int(TIMEOUT_SECONDS * 1000),
                "status_code":      None,
                "error":            "Timeout after 10s",
            }

        except Exception as exc:
            elapsed_ms = int((time.monotonic() - start) * 1000)
            logger.warning("Error checking %s (%s): %s", name, url, exc)
            return {
                "api_id":           api_id,
                "name":             name,
                "status":           "down",
                "response_time_ms": elapsed_ms,
                "status_code":      None,
                "error":            str(exc),
            }


async def check_all_apis(apis: list[dict]) -> list[dict]:
    """
    Check all APIs concurrently.
    `apis` is a list of dicts with keys: id, name, url
    """
    semaphore = asyncio.Semaphore(MAX_CONCURRENT)
    headers = {
        "User-Agent": "DeadAPIDetector/1.0 (health monitor; +https://github.com/yourusername/dead-api-detector)"
    }

    async with httpx.AsyncClient(
        timeout=httpx.Timeout(TIMEOUT_SECONDS),
        headers=headers,
        verify=True,
    ) as client:
        tasks = [
            check_single_api(client, str(api["id"]), api["name"], api["url"], semaphore)
            for api in apis
        ]
        results = await asyncio.gather(*tasks, return_exceptions=False)

    return list(results)
