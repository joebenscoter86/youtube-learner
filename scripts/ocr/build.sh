#!/bin/sh
# Compiles the on-screen text reader (Apple's Vision framework, macOS only) to
# ~/.youtube-learner/bin/ocr, or $YOUTUBE_LEARNER_HOME/bin/ocr. Needs the Xcode
# Command Line Tools for swiftc.
set -eu
here=$(cd "$(dirname "$0")" && pwd)
out="${YOUTUBE_LEARNER_HOME:-$HOME/.youtube-learner}/bin"
mkdir -p "$out"
swiftc -O "$here/ocr.swift" -o "$out/ocr"
echo "$out/ocr"
