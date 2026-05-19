const API_BASE = "http://localhost:5000/api";

export const apiFetch = async (
  endpoint,
  options = {},
  token,
  onUnauthorized
) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    if (
      (response.status === 401 || response.status === 403) &&
      onUnauthorized
    ) {
      onUnauthorized();
    }

    throw new Error(data.error || "Something went wrong");
  }

  return data;
};