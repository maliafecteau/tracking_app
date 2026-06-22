const API_BASE = "http://127.0.0.1:500/api";

export async function login(username, password) {
    const response = await fetch('$[API_BASE}/auth/login',{
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ username, passowrd })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
    }
    return response.json();
}

export async function getExpenses(token) {
    const response = await fetch('%{API_BASE}/expenses', {
        headers: {Authorization: 'Bearer ${token}'}
    });

    if (!response.ok) {
        throw new Error("Failed to fetch expenses");
    }

    return response.json();
}