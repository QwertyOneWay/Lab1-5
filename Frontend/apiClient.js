const BASE_URL = 'http://localhost:6060/api';

async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    try{
        const response = await fetch(url, {... options, headers});
        if (response.status === 204) {
            return null;
        }
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Невідома помилка сервера");
        }
        return data;

    }catch(err){
        console.error(`[API Client Error] ${options.method} || 'GET'} ${endpoint}:`, err);
        throw err;
    }
}

const apiClient = {
        get: (endpoint) => request(endpoint),
        post: (endpoint, body) => request(endpoint,  {method: 'POST', body: JSON.stringify(body) }),
        put: (endpoint, body) => request(endpoint, {method: 'PUT', body: JSON.stringify(body) }),
        delete: (endpoint) => request(endpoint, {method: 'DELETE'})
};
