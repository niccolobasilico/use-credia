'use client';

import { useCallback, useRef, useState } from 'react';

const TOOL_PATH = '/qualifica-tool.html';

export default function QualificaWizard() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(1600);

  const handleLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    try {
      const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
      if (!doc) {
        return;
      }

      const scrollHeight = doc.body?.scrollHeight;
      if (scrollHeight && Math.abs(scrollHeight - iframeHeight) > 24) {
        setIframeHeight(scrollHeight + 40);
      }
    } catch (error) {
      console.error('Impossibile ridimensionare l’iframe del tool Qualifica', error);
    }
  }, [iframeHeight]);

  return (
    <div className='rounded-3xl border border-white/10 bg-gradient-to-br from-[#667eea]/20 via-[#6b63d9]/25 to-[#764ba2]/30 p-2 shadow-[0_20px_60px_rgba(102,126,234,0.25)] backdrop-blur'>
      <iframe
        ref={iframeRef}
        title='Procedura Qualifica Finanziabilità'
        src={TOOL_PATH}
        onLoad={handleLoad}
        style={{
          width: '100%',
          height: `${iframeHeight}px`,
          border: 'none',
          borderRadius: '20px',
          backgroundColor: 'transparent',
        }}
        loading='lazy'
      />
    </div>
  );
}
