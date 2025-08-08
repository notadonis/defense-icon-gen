'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [svg, setSvg] = useState('');
  const [loading, setLoading] = useState(false);

  const generateIcon = async () => {
    if (!prompt) return;
    setLoading(true);
    setSvg('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setSvg(data.svg || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!svg) return;
    try {
      await navigator.clipboard.writeText(svg);
      alert('SVG copied to clipboard');
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4 space-y-6">
      <h1 className="text-2xl font-bold">Defense-Hardened Icon Generator</h1>
      <div className="flex flex-col items-center gap-2 w-full max-w-lg">
        <input
          type="text"
          placeholder="Describe your icon..."
          className="border rounded p-2 w-full"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') generateIcon();
          }}
        />
        <button
          onClick={generateIcon}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading || !prompt}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      {svg && (
        <div className="flex flex-col items-center gap-2">
          <div
            className="border p-4"
            style={{ transform: 'scale(8)', transformOrigin: 'top left' }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <textarea
            readOnly
            className="border p-2 w-full max-w-lg text-xs"
            rows={6}
            value={svg}
          />
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Copy SVG
          </button>
        </div>
      )}
    </main>
  );
}
