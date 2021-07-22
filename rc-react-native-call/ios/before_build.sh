#!/bin/sh -e

pwd

FRAMEWROK_DIR="Frameworks"
TARGET_NAME="RongCallWrapper"

if [ ! -d "$FRAMEWROK_DIR" ]; then
    mkdir -p "$FRAMEWROK_DIR"
fi

cp -af ../../../rtc-calliw-ios/${TARGET_NAME}/bin/${TARGET_NAME}.framework/ ${FRAMEWROK_DIR}/${TARGET_NAME}.framework

