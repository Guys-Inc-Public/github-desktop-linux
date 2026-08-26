/**
 * Telemetry is disabled in the Guys Inc (unofficial) build of GitHub Desktop
 * for Linux. Usage statistics and exception reports are never transmitted to
 * GitHub's servers. Typed as `boolean` (not the literal `true`) so the compiler
 * keeps the original code paths reachable and their endpoints referenced.
 */
export const telemetryDisabled: boolean = true
