function main() {
  const canvas = document.querySelector("canvas#glcanvas");
  if (!window.HTMLCanvasElement) {
    console.log("non-standard browser HTMLCanvasElement support");
    return;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.style.display = "block";
    canvas.innerText = "2D kontekst crtanja nije podržan";
    console.log("Context2D not supported by browser");
    return;
  }

  ctx.fillStyle = "blue";
  ctx.fillRect(200, 300, 100, 100);

  ctx.strokeStyle = "yellow";
  ctx.beginPath();
  ctx.moveTo(200, 300);
  ctx.lineTo(300, 400);
  ctx.stroke();
}
