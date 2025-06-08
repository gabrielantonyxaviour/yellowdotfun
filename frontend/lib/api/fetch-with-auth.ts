export async function fetchWithAuth(
  getAccessTokenFn: () => Promise<string | null>,
  url: string | URL | Request,
  options: RequestInit = {},
): Promise<Response> {
  try {
    const accessToken = await getAccessTokenFn()

    const headers = new Headers(options.headers)

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`)
    } else {
      console.warn(
        `[fetchWithAuth] No access token found for request to ${url}. Proceeding without Authorization header.`,
      )
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers: headers,
    }

    const response = await fetch(url, fetchOptions)

    return response
  } catch (error) {
    console.error(`[fetchWithAuth] Error during fetch to ${url}:`, error)
    throw error
  }
}
