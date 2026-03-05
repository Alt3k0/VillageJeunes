// /public/js/core/api.js
(() => {
    const API_BASE = "/api";
  
    function getAccessToken() {
      return (
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("accessToken") ||
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("authToken")
      );
    }
  
    function setAccessToken(t) {
      if (!t) return;
      localStorage.setItem("accessToken", t);
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("authToken");
    }
  
    function clearAccessToken() {
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("authToken");
    }
  
    let refreshPromise = null;
  
    async function refreshAccessToken() {
      if (refreshPromise) return refreshPromise;
  
      refreshPromise = (async () => {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
  
        if (!res.ok) return null;
  
        const data = await res.json().catch(() => ({}));
        if (!data?.accessToken) return null;
  
        setAccessToken(data.accessToken);
        return data.accessToken;
      })();
  
      try {
        return await refreshPromise;
      } finally {
        refreshPromise = null;
      }
    }
  
    async function apiFetch(path, options = {}) {
      const url = path.startsWith("http")
        ? path
        : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  
      const headers = { ...(options.headers || {}) };
  
      const token = getAccessToken();
      if (token && !headers.Authorization && !headers.authorization) {
        headers.Authorization = `Bearer ${token}`;
      }
  
      let body = options.body;
      const isFormData = body instanceof FormData;
  
      if (body !== undefined && body !== null && typeof body === "object" && !isFormData) {
        if (!headers["Content-Type"] && !headers["content-type"]) {
          headers["Content-Type"] = "application/json";
        }
        body = JSON.stringify(body);
      }
  
      let res = await fetch(url, {
        ...options,
        headers,
        body,
        credentials: "include",
      });
  
      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
          res = await fetch(url, {
            ...options,
            headers: retryHeaders,
            body,
            credentials: "include",
          });
        } else {
          console.warn("401 + refresh impossible (cookie refresh absent/invalide).");
          // ⚠️ ne purge pas ici pendant le debug
        }
      }
  
      const text = await res.text().catch(() => "");
      let payload = {};
      try {
        payload = text ? JSON.parse(text) : {};
      } catch {
        payload = { raw: text };
      }
  
      if (!res.ok) {
        const message = payload?.error || payload?.message || `HTTP ${res.status}`;
        console.error("API error:", res.status, payload);
        throw new Error(message);
      }
  
      return payload;
    }
  
    globalThis.apiFetch = apiFetch;
    globalThis.setAccessToken = setAccessToken;
    globalThis.getAccessToken = getAccessToken;
    globalThis.refreshAccessToken = refreshAccessToken;
    globalThis.clearAccessToken = clearAccessToken;
  })();