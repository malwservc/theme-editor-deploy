'use client';

import { useState, useEffect, useMemo } from 'react';

type PreviewButtonProps = {
  themeName?: string;
  openedFilePath: string; 
};

export default function PreviewButton({ themeName = 'default', openedFilePath }: PreviewButtonProps) {
  const [open, setOpen] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const previewPath = useMemo(() => {
    if (!openedFilePath) return '/';
    const clean = openedFilePath.replace(/^templates\//, '').replace(/\.liquid$/, '');
    return clean === 'index' ? '/' : `/${clean}`;
  }, [openedFilePath]);

  const previewUrl = `https://themes.zironite.uk/themes/preview?theme=${themeName}&path=${previewPath}`;

  useEffect(() => {
    if (!open) return;

    const fetchPreview = async () => {
      setLoading(true);
      try {
        const tokenRes = await fetch('/api/token');
        const { accessToken } = await tokenRes.json();

        const res = await fetch(previewUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        const result = await res.text();
        setHtml(result);
      } catch (err) {
        console.error('Erro ao carregar preview:', err);
        setHtml('<h2 style="color:red;padding:2rem">Erro ao renderizar preview 😢</h2>');
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [open, previewUrl]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-black text-white rounded-xl shadow-lg hover:bg-gray-800 transition"
      >
        Preview
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl h-[90vh] overflow-hidden relative border">
            <div className="p-4 flex justify-between items-center bg-gray-100 border-b">
              <span className="text-lg font-semibold">Visualização: {previewPath}</span>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-red-500 transition">
                ✕
              </button>
            </div>

            {/* Preview */}
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                Carregando preview...
              </div>
            ) : (
              <iframe
                srcDoc={html || ''}
                className="w-full h-full border-none"
                title="Preview"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
