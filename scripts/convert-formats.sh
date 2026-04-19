#!/bin/bash
# Convert MP4 animations to 60fps MP4 (via minterpolate) and optimized GIF.
#
# Usage:
#   ./convert-formats.sh input.mp4 [gif_width]
#
# Produces next to the input:
#   <name>-60fps.mp4   (1920x1080, 60fps, motion-interpolated)
#   <name>.gif         (scaled width, 15fps, palette-optimized)
#
# minterpolate flags:
#   mi_mode=mci              motion compensation interpolation
#   mc_mode=aobmc            adaptive overlapped block motion comp
#   me_mode=bidir            bidirectional motion estimation
#   vsbmc=1                  variable-size block motion comp
# GIF uses two-pass palette:
#   pass 1: palettegen with stats_mode=diff (per-video optimal palette)
#   pass 2: paletteuse with bayer dither + rectangle diff
# This keeps 30s/1080p animations GIF under ~4MB with good color fidelity.

set -e

INPUT="${1:?Usage: $0 input.mp4 [gif_width]}"
GIF_WIDTH="${2:-960}"

DIR=$(dirname "$INPUT")
BASE=$(basename "$INPUT" .mp4)
OUT60="$DIR/$BASE-60fps.mp4"
OUTGIF="$DIR/$BASE.gif"
PAL="$DIR/.palette-$BASE.png"

echo "▸ 60fps interpolate: $OUT60"
ffmpeg -y -loglevel error -i "$INPUT" \
  -vf "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart \
  "$OUT60"
MP4_SIZE=$(du -h "$OUT60" | cut -f1)
echo "  ✓ $MP4_SIZE"

echo "▸ GIF (${GIF_WIDTH}w, 15fps, palette-optimized): $OUTGIF"
# Pass 1: generate palette tailored to this video
ffmpeg -y -loglevel error -i "$INPUT" \
  -vf "fps=15,scale=${GIF_WIDTH}:-1:flags=lanczos,palettegen=stats_mode=diff" \
  "$PAL"
# Pass 2: apply palette with dithering
ffmpeg -y -loglevel error -i "$INPUT" -i "$PAL" \
  -lavfi "fps=15,scale=${GIF_WIDTH}:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
  "$OUTGIF"
rm -f "$PAL"
GIF_SIZE=$(du -h "$OUTGIF" | cut -f1)
echo "  ✓ $GIF_SIZE"
