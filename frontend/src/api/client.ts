const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/graphql";

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export class GraphQLRequestError extends Error {}

/** Minimal fetch-based GraphQL client — a single query doesn't need a full client library. */
export async function gqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
  } catch {
    throw new GraphQLRequestError(`Could not reach the API at ${API_URL}`);
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (!response.ok || json.errors?.length) {
    throw new GraphQLRequestError(
      json.errors?.[0]?.message ??
        `API request failed with status ${response.status}`,
    );
  }
  if (!json.data) {
    throw new GraphQLRequestError("API response had no data");
  }
  return json.data;
}
