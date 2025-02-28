import { useEffect, useRef, useState } from 'preact/hooks'
import { ChangeEvent } from 'preact/compat'
import * as pdfjs from 'pdfjs-dist'
import 'pdfjs-dist/build/pdf.worker'
import PDFCanvas from './PDFCanvas'

export default function PDFViewer() {
  const [pdfPages, setPdfPages] = useState([]);
  const [pageSizes, setPageSizes] = useState({}); // Store each page's width & height
  const pdfBufferRef = useRef(null);

  async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      pdfBufferRef.current = reader.result;

      const pdf = await pdfjs.getDocument({ data: reader.result.slice() }).promise;
      setPdfPages(Array.from({ length: pdf.numPages }, (_, i) => i + 1));
    };
  }

  useEffect(() => {
    async function renderPages() {
      if (!pdfBufferRef.current || pdfPages.length === 0) return;

      const pdf = await pdfjs.getDocument({ data: new Uint8Array(pdfBufferRef.current).slice() }).promise;
      const sizes = {};

      for (const pageNum of pdfPages) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        sizes[pageNum] = { width: viewport.width, height: viewport.height };

        const canvas = document.getElementById(`pdf-page-${pageNum}`);
        if (!canvas) continue;

        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;
      }

      setPageSizes(sizes); // Store page dimensions
    }

    renderPages();
  }, [pdfPages]);

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      <div class="flex flex-col gap-4">
        {pdfPages.map((pageNum) => (
          <div key={pageNum} class="relative">
            <canvas id={`pdf-page-${pageNum}`} class="b-1 b-black" />
            {pageSizes[pageNum] && (
              <PDFCanvas pageNum={pageNum} width={pageSizes[pageNum].width} height={pageSizes[pageNum].height} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

