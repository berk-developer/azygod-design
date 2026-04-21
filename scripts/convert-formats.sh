#!/bin/bash
# MP4 animasyonlarını 60fps MP4 ve optimize GIF'e dönüştür.
#
# Kullanım:
#   ./convert-formats.sh input.mp4 [gif_genisligi] [--minterpolate]
#
# Girdinin yanına çıktılar:
#   <name>-60fps.mp4   (1920x1080, 60fps, varsayılan olarak kare çoğaltma)
#   <name>.gif         (ölçeklenmiş genişlik, 15fps, palet optimize)
#
# Bayraklar:
#   --minterpolate     Hareket telafili interpolasyonu etkinleştir (yüksek kalite
#                      ancak elementary stream'de bilinen QuickTime/Safari
#                      uyumluluk sorunları var — yalnızca oynatıcınız destekliyorsa kullanın).
#
# Varsayılan 60fps modu: basit fps=60 filtresi (kare çoğaltma). Geniş
# uyumluluk, QuickTime / Safari / Chrome / VLC'de oynatılır. 60fps
# etiketi yükleme platformu algısı içindir; algılanan akıcılık
# çoğu CSS odaklı hareket için kaynak 25fps ile aynıdır.
#
# --minterpolate ne zaman etkinleştirilmeli: yoğun translate/scale hareketinde
# gerçek 60fps interpolasyon istediğinizde. UYARI: macOS QuickTime bazen
# minterpolate çıktısını açmayı reddeder. Teslim etmeden test edin.
#
# GIF iki geçişli palet kullanır:
#   geçiş 1: stats_mode=diff ile palettegen (video başına optimal palet)
#   geçiş 2: bayer dither + rectangle diff ile paletteuse
# Bu, 30s/1080p animasyonların GIF'ini ~4MB altında ve iyi renk sadakatiyle tutar.

set -e

INPUT=""
GIF_WIDTH="960"
USE_MINTERPOLATE=0
for arg in "$@"; do
  case "$arg" in
    --minterpolate) USE_MINTERPOLATE=1 ;;
    --*) echo "Bilinmeyen bayrak: $arg" >&2; exit 1 ;;
    *)
      if [ -z "$INPUT" ]; then INPUT="$arg"
      else GIF_WIDTH="$arg"
      fi
      ;;
  esac
done
[ -z "$INPUT" ] && { echo "Kullanım: $0 input.mp4 [gif_genisligi] [--minterpolate]" >&2; exit 1; }

DIR=$(dirname "$INPUT")
BASE=$(basename "$INPUT" .mp4)
OUT60="$DIR/$BASE-60fps.mp4"
OUTGIF="$DIR/$BASE.gif"
PAL="$DIR/.palette-$BASE.png"

if [ "$USE_MINTERPOLATE" = "1" ]; then
  echo "▸ 60fps interpolate (minterpolate, yüksek kalite): $OUT60"
  VFILTER="minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1"
else
  echo "▸ 60fps kare çoğaltma (uyumluluk modu): $OUT60"
  VFILTER="fps=60"
fi

# -profile:v high -level 4.0 → geniş H.264 uyumluluk (QuickTime, Safari, mobil)
# -movflags +faststart        → moov atomu öne alınır, akışılabilir / anında oynatma
ffmpeg -y -loglevel error -i "$INPUT" \
  -vf "$VFILTER" \
  -c:v libx264 -pix_fmt yuv420p -profile:v high -level 4.0 \
  -crf 18 -preset medium -movflags +faststart \
  "$OUT60"
MP4_SIZE=$(du -h "$OUT60" | cut -f1)
echo "  ✓ $MP4_SIZE"

echo "▸ GIF (${GIF_WIDTH}w, 15fps, palet optimize): $OUTGIF"
# Geçiş 1: Bu video için özel palet üret
ffmpeg -y -loglevel error -i "$INPUT" \
  -vf "fps=15,scale=${GIF_WIDTH}:-1:flags=lanczos,palettegen=stats_mode=diff" \
  "$PAL"
# Geçiş 2: Dithering ile palet uygula
ffmpeg -y -loglevel error -i "$INPUT" -i "$PAL" \
  -lavfi "fps=15,scale=${GIF_WIDTH}:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
  "$OUTGIF"
rm -f "$PAL"
GIF_SIZE=$(du -h "$OUTGIF" | cut -f1)
echo "  ✓ $GIF_SIZE"
