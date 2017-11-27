#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker run --rm \
    -v $SOURCE_DIR:/app/src \
    -v $TARGET_DIR:/assets \
    -w /app \
    webpack-module-bundle ${@:2}
