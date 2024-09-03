// lib/api.ts
import '@ungap/with-resolvers';
export async function fetchPdf(latex: string) {
    const response = await fetch('http://127.0.0.1:8000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latex }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`${errorData.error}: ${errorData.message}\n\nDetails: ${errorData.details}`);
    }
    return response.blob();
  }