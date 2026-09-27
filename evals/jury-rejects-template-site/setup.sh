#!/usr/bin/env bash
# Copies the fixture (contact sheets + brief of a deliberately generic site) into the run's workspace.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cp -r "$HERE/fixture" ./fixture
