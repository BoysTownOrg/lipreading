#!/bin/bash

set -eu

DIR=$1

bun build browser/survey.ts browser/adults.ts browser/cct-capt.ts --outdir "${DIR}"
