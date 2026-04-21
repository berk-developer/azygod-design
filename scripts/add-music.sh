#!/usr/bin/env bash
# BGM parçasını MP4 videosuna karıştır.
#
# Kullanım:
#   bash add-music.sh <input.mp4> [--mood=<ad>] [--music=<yol>] [--out=<yol>]
#
# Mood kütüphanesi (../assets/ içinde, bgm-<mood>.mp3 ile eşleşir):
#   tech              — Apple Silicon / ürün lansmanı havası, minimal synth+piano (varsayılan)
#   ad                — canlı modern, net yükseliş + drop, sosyal medya reklam enerjisi
#   educational       — sıcak, sabırlı, davetkar öğrenme tonu
#   educational-alt   — educational'ın alternatif versiyonu
#   tutorial          — lo-fi arka plan, voiceover'ın önüne geçmez
#   tutorial-alt      — tutorial'ın alternatif versiyonu
#
# Bayraklar (tümü isteğe bağlı):
#   --mood=<ad>     kütüphaneden bir preset seç (varsayılan: tech)
#   --music=<yol>   kendi ses dosyanla geçersiz kıl (--mood'u ezer)
#   --out=<yol>     çıktı yolu (varsayılan: <input-basename>-bgm.mp4)
#
# Eski konumsal form hâlâ çalışır: bash add-music.sh in.mp4 music.mp3 out.mp4
#
# Davranış:
#   - Müzik video süresine göre kısaltılır
#   - 0.3s fade in, 1.0s fade out (sert kesmeleri önler)
#   - Video akışı kopyalanır (yeniden kodlama yok), ses AAC 192k
#
# Örnekler:
#   bash add-music.sh my.mp4                              # varsayılan: tech mood
#   bash add-music.sh my.mp4 --mood=ad                    # mood değiştir
#   bash add-music.sh my.mp4 --mood=educational --out=final.mp4
#   bash add-music.sh my.mp4 --music=~/Downloads/song.mp3 # kendi müziğinle getir
#
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ASSETS_DIR="$SCRIPT_DIR/../assets"

# ── Argümanları ayrıştır ───────────────────────────────────────────────────────
INPUT=""
MOOD="tech"
CUSTOM_MUSIC=""
OUTPUT=""
POSITIONAL=()

for arg in "$@"; do
  case "$arg" in
    --mood=*)  MOOD="${arg#*=}" ;;
    --music=*) CUSTOM_MUSIC="${arg#*=}" ;;
    --out=*)   OUTPUT="${arg#*=}" ;;
    *)         POSITIONAL+=("$arg") ;;
  esac
done

# Eski konumsal: <input> [music] [output]
INPUT="${POSITIONAL[0]}"
[ -z "$CUSTOM_MUSIC" ] && [ -n "${POSITIONAL[1]}" ] && CUSTOM_MUSIC="${POSITIONAL[1]}"
[ -z "$OUTPUT" ]       && [ -n "${POSITIONAL[2]}" ] && OUTPUT="${POSITIONAL[2]}"

if [ -z "$INPUT" ] || [ ! -f "$INPUT" ]; then
  echo "Kullanım: bash add-music.sh <input.mp4> [--mood=<ad>] [--music=<yol>] [--out=<yol>]" >&2
  echo "Mevcut mood'lar: $(ls "$ASSETS_DIR" | grep -E '^bgm-.*\.mp3$' | sed 's/^bgm-//;s/\.mp3$//' | tr '\n' ' ')" >&2
  exit 1
fi

# ── Müzik kaynağını çözümle: --music kazanır, yoksa --mood ────────────────────
if [ -n "$CUSTOM_MUSIC" ]; then
  MUSIC="$CUSTOM_MUSIC"
  SOURCE_LABEL="özel: $MUSIC"
else
  MUSIC="$ASSETS_DIR/bgm-${MOOD}.mp3"
  SOURCE_LABEL="mood: $MOOD"
fi

if [ ! -f "$MUSIC" ]; then
  echo "✗ Müzik bulunamadı: $MUSIC" >&2
  echo "  Mevcut mood'lar: $(ls "$ASSETS_DIR" | grep -E '^bgm-.*\.mp3$' | sed 's/^bgm-//;s/\.mp3$//' | tr '\n' ' ')" >&2
  exit 1
fi

# ── Çıktı yolunu çözümle ──────────────────────────────────────────────────────
INPUT_DIR="$(cd "$(dirname "$INPUT")" && pwd)"
INPUT_NAME="$(basename "$INPUT" .mp4)"
[ -z "$OUTPUT" ] && OUTPUT="$INPUT_DIR/$INPUT_NAME-bgm.mp4"

# ── Video süresini ölç, fade-out başlangıcını hesapla ─────────────────────────
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$INPUT")
if [ -z "$DURATION" ]; then
  echo "✗ Video süresi okunamadı" >&2
  exit 1
fi
FADE_OUT_START=$(awk "BEGIN { d = $DURATION - 1; if (d < 0) d = 0; print d }")

echo "▸ BGM video ile karıştırılıyor"
echo "  giriş:    $INPUT"
echo "  müzik:    $SOURCE_LABEL"
echo "  süre:     ${DURATION}s"
echo "  çıktı:    $OUTPUT"

ffmpeg -y -loglevel error \
  -i "$INPUT" \
  -i "$MUSIC" \
  -filter_complex "[1:a]atrim=0:${DURATION},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.3,afade=t=out:st=${FADE_OUT_START}:d=1[a]" \
  -map 0:v -map "[a]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$OUTPUT"

SIZE=$(du -h "$OUTPUT" | cut -f1)
echo "✓ Tamamlandı: $OUTPUT ($SIZE)"
