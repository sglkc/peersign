
import { useEffect, useRef } from "preact/hooks"
import { Canvas, PencilBrush } from "fabric"

export default function PDFCanvas({ pageNum, width, height }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<Canvas>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new Canvas(canvasRef.current, {
      isDrawingMode: true,
      width,
      height,
    })

    canvas.freeDrawingBrush = new PencilBrush(canvas)
    fabricRef.current = canvas

    return () => {
      fabricRef.current.dispose()
    }
  }, [canvasRef.current])

  function clearDrawing() {
    fabricRef.current.clear()
  }

  return (
    <div class="absolute inset-0 ">
      <canvas
        ref={canvasRef}
        id={`drawing-canvas-${pageNum}`}
        class=""
        width={width}
        height={height}
      />
      <button onClick={clearDrawing} style={{ position: "absolute", top: 5, right: 5 }}>
        Clear
      </button>
    </div>
  )
}
