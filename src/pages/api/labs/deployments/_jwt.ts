import type { APIRoute } from 'astro';

export function get ({ request }) {
  return {
    body: "Good"
  };
}