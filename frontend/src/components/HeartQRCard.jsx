import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Share2, Heart, Check, Sparkles } from "lucide-react";

export default function HeartQRCard({ url, partnerName = "My Love", senderName = "Yours" }) {
  const canvasRef = useRef(null);
  const [qrReady, setQrReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!url) return;

    let isMounted = true;

    async function generateCard() {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const W = 800;
        const H = 960;
        canvas.width = W;
        canvas.height = H;

        // 1. Romantic Dark Burgundy Ambient Background
        const bgGrad = ctx.createLinearGradient(0, 0, W, H);
        bgGrad.addColorStop(0, "#190810");
        bgGrad.addColorStop(0.5, "#0d0407");
        bgGrad.addColorStop(1, "#1c0712");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // Ambient Rose Glow Orbs
        const drawGlow = (x, y, r, color) => {
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, color);
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        };
        drawGlow(W * 0.2, H * 0.2, 280, "rgba(225, 29, 72, 0.18)");
        drawGlow(W * 0.8, H * 0.7, 320, "rgba(190, 18, 60, 0.15)");
        drawGlow(W * 0.5, H * 0.5, 250, "rgba(244, 63, 94, 0.12)");

        // Decorative subtle border frame
        ctx.strokeStyle = "rgba(223, 193, 156, 0.22)";
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, W - 60, H - 60);

        // Corner Flourishes
        const drawCornerHeart = (cx, cy) => {
          ctx.fillStyle = "rgba(232, 180, 184, 0.5)";
          ctx.font = "16px serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("♥", cx, cy);
        };
        drawCornerHeart(45, 45);
        drawCornerHeart(W - 45, 45);
        drawCornerHeart(45, H - 45);
        drawCornerHeart(W - 45, H - 45);

        // 2. Top Header Text
        ctx.textAlign = "center";
        ctx.fillStyle = "#e8b4b8";
        ctx.font = "bold 16px sans-serif";
        ctx.letterSpacing = "3px";
        ctx.fillText("A ROMANTIC SURPRISE", W / 2, 90);
        ctx.letterSpacing = "0px";

        ctx.fillStyle = "#ffffff";
        ctx.font = "italic bold 34px Georgia, serif";
        const titleText = partnerName ? `For ${partnerName} ❤️` : "Made Just For You ❤️";
        ctx.fillText(titleText, W / 2, 140);

        // 3. Heart-Shaped Silhouette Container with Outer Glow
        const heartCenterX = W / 2;
        const heartCenterY = 460;
        const heartW = 460;
        const heartH = 430;

        function defineHeartPath(cx, cy, w, h) {
          ctx.beginPath();
          const topCurveHeight = h * 0.35;
          ctx.moveTo(cx, cy - h / 2 + topCurveHeight);
          // Top-left curve
          ctx.bezierCurveTo(
            cx, cy - h / 2,
            cx - w / 2, cy - h / 2,
            cx - w / 2, cy - h / 2 + topCurveHeight
          );
          // Bottom-left curve
          ctx.bezierCurveTo(
            cx - w / 2, cy + (h * 0.3),
            cx - w * 0.2, cy + (h * 0.38),
            cx, cy + h / 2
          );
          // Bottom-right curve
          ctx.bezierCurveTo(
            cx + w * 0.2, cy + (h * 0.38),
            cx + w / 2, cy + (h * 0.3),
            cx + w / 2, cy - h / 2 + topCurveHeight
          );
          // Top-right curve
          ctx.bezierCurveTo(
            cx + w / 2, cy - h / 2,
            cx, cy - h / 2,
            cx, cy - h / 2 + topCurveHeight
          );
          ctx.closePath();
        }

        // Draw Heart Background Shadow & Fill
        ctx.save();
        ctx.shadowColor = "rgba(225, 29, 72, 0.45)";
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 8;
        defineHeartPath(heartCenterX, heartCenterY, heartW + 20, heartH + 20);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.restore();

        // Inner Red Heart Accent Border
        ctx.save();
        defineHeartPath(heartCenterX, heartCenterY, heartW + 10, heartH + 10);
        ctx.strokeStyle = "#e11d48";
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.restore();

        // 4. Generate High-Correction Red QR Code
        const qrSize = 310;
        const qrDataUrl = await QRCode.toDataURL(url, {
          errorCorrectionLevel: "H",
          margin: 1,
          width: qrSize * 2,
          color: {
            dark: "#be123c", // Romantic Crimson Red
            light: "#ffffff", // Pure white for perfect scanning contrast
          },
        });

        // Draw QR Image inside the heart
        const qrImg = new Image();
        qrImg.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
          qrImg.onload = resolve;
          qrImg.onerror = reject;
          qrImg.src = qrDataUrl;
        });

        const qrX = heartCenterX - qrSize / 2;
        const qrY = heartCenterY - qrSize / 2 + 10;

        // Clip slightly rounded rectangle inside heart for 100% camera readability
        ctx.save();
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        ctx.restore();

        // 5. Center Heart Emblem in the QR (allowed by Level H error correction)
        const emblemSize = 54;
        const emblemX = heartCenterX;
        const emblemY = qrY + qrSize / 2;

        ctx.save();
        // White circular shield behind center heart
        ctx.beginPath();
        ctx.arc(emblemX, emblemY, emblemSize / 2 + 4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
        ctx.shadowBlur = 8;
        ctx.fill();

        // Crimson red heart circle
        ctx.beginPath();
        ctx.arc(emblemX, emblemY, emblemSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = "#e11d48";
        ctx.fill();

        // White heart icon in center
        ctx.fillStyle = "#ffffff";
        ctx.font = "26px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("♥", emblemX, emblemY + 2);
        ctx.restore();

        // 6. Bottom Reassurance & Instructions
        ctx.textAlign = "center";
        ctx.letterSpacing = "0px";
        ctx.fillStyle = "#fce7f3";
        ctx.font = "600 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText("📷 Scan with any phone camera to open", W / 2, 760);

        ctx.fillStyle = "#dfc19c";
        ctx.font = "italic 18px Georgia, serif";
        ctx.fillText("“A private interactive digital keepsake crafted with love”", W / 2, 805);

        // Watermark Footer
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "bold 13px sans-serif";
        ctx.letterSpacing = "2px";
        ctx.fillText("LOVECRAFTED.ME", W / 2, 875);
        ctx.letterSpacing = "0px";

        if (isMounted) {
          setQrReady(true);
        }
      } catch (err) {
        console.error("Failed to generate Heart QR Card:", err);
      }
    }

    generateCard();

    return () => {
      isMounted = false;
    };
  }, [url, partnerName, senderName]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setDownloading(true);
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const safeName = (partnerName || "romantic")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-");
      const link = document.createElement("a");
      link.download = `${safeName}-heart-keepsake-qr.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    } catch (e) {
      console.error("Download failed:", e);
    } finally {
      setDownloading(false);
    }
  };

  const handleWhatsAppShare = () => {
    const message = `Heyy ${partnerName || "my love"} ❤️, I made a personalized digital keepsake experience just for you! Scan our Heart QR card or tap this private link to open your surprise: ${url}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="space-y-4 text-center">
      {/* Visual Canvas Card Display */}
      <div className="relative mx-auto max-w-[290px] sm:max-w-[320px] rounded-2xl overflow-hidden border border-[#e8b4b8]/30 shadow-2xl shadow-rose-950/50 bg-[#12070c] p-2 group transition-transform hover:scale-[1.01]">
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-xl block"
          style={{ imageRendering: "crisp-edges" }}
        />
        {!qrReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0e070a]/90 backdrop-blur-sm text-xs text-[#e8b4b8]">
            <Sparkles className="size-4 animate-spin mr-2" />
            Crafting Heart QR Card...
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto pt-1">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!qrReady || downloading}
          className="flex-1 h-10 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
        >
          {downloaded ? (
            <>
              <Check className="size-4 text-white" /> Downloaded!
            </>
          ) : (
            <>
              <Download className="size-4" /> Download Heart QR (PNG)
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="flex-1 h-10 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0a0507] text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          <Share2 className="size-4" /> Send on WhatsApp
        </button>
      </div>

      <p className="text-[0.7rem] text-[#c5b0a5]/70 max-w-xs mx-auto">
        ✨ 100% camera scannable. Download to send as an image or print as a physical romantic card.
      </p>
    </div>
  );
}
