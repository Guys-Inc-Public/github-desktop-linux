#!/usr/bin/env bash
#
# Fails the build if an OAuth client secret has been baked into the webpack
# bundles, and asserts that the device-flow sign-in path is still present.
#
# Desktop authenticates as an OAuth *public* client using the device flow, so
# there is no client secret to ship. The client ID is public by design and is
# expected in the bundle; a client *secret* never is. CodeQL's
# js/build-artifact-leak rule cannot tell the two apart, so this check is what
# actually guards the invariant.
#
set -euo pipefail

fail() { echo "::error::$*" >&2; exit 1; }

[ -d out ] || fail "out/ not found - nothing was scanned. Did the build run?"

mapfile -t bundles < <(find out -type f -name '*.js' | sort)
[ "${#bundles[@]}" -gt 0 ] || fail "no JavaScript bundles under out/ - nothing was scanned."

echo "Scanning ${#bundles[@]} bundle(s) under out/"

# 1. No client secret, in any of the forms it has previously taken.
for needle in 'client_secret' '__OAUTH_SECRET__' 'DESKTOP_OAUTH_CLIENT_SECRET'; do
  if grep -l --fixed-strings -- "$needle" "${bundles[@]}" 2>/dev/null | head -5 | grep -q .; then
    echo "Matched in:" >&2
    grep -l --fixed-strings -- "$needle" "${bundles[@]}" >&2 || true
    fail "'$needle' found in a build artifact. Desktop is a public OAuth client and must not ship a secret."
  fi
done
echo "  ok: no client secret in any bundle"

# 2. The device flow is still wired up. Without this, dropping the sign-in code
#    would silently pass check 1 while breaking authentication.
if ! grep -q --fixed-strings -- 'login/device/code' "${bundles[@]}"; then
  fail "device-flow endpoint 'login/device/code' missing from the bundles - sign-in would be broken."
fi
echo "  ok: device-flow endpoint present"

echo "Build artifact secret check passed."
