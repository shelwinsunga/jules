import { RAILWAY_ENDPOINT_URL } from '@/lib/constants'  
export async function fetchPdf(latex: string) {
  console.log(RAILWAY_ENDPOINT_URL)
    const response = await fetch(RAILWAY_ENDPOINT_URL, {
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