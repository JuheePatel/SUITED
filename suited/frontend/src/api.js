const API_BASE_URL = 'http://localhost:8000/api';

const fetchWithTimeout = async (resource, options = {}) => {
    const timeout = options.timeout || 8000;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error.name === "AbortError") {
            throw new Error("Request timed out");
        }
        throw error;
    }
};

export const postData = async (endpoint, data) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
};

export const fetchData = async (endpoint) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
};
