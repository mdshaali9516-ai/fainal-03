# Implementation Plan - Tawzoon Nexus 24-Hour Stability & Time-Based Integrity Verification

## Overview
This plan outlines a thorough verification of all time-sensitive features, state persistence mechanisms, terminal status invariants, and Firestore background syncs to ensure zero regression or unexpected status reverts over 24+ hours of continuous operation.

## User Request Context
The user wants to ensure that recent cleanups and database optimizations do not cause any state reversion, order status resets, payment request rollbacks, or session drops after 2, 4, 5, or 24 hours.

## Detailed Verification Steps

1. **Terminal Status Invariant Verification**:
   - Verify `server/db.ts` methods (`isEntityTerminal`, `isEntityPending`, `getItemTimestamp`) across all collections (`sales`, `withdrawals`, `balance_topup_requests`, `employees`).
   - Ensure confirmed/approved/rejected states permanently override pending records during syncs and reboots.

2. **Firestore Sync & Quota Robustness**:
   - Verify `syncEntityDirect` write timeouts (10s) and error handling when Firestore quotas or rate limits are reached.
   - Confirm local fallback (`store.json`) integrity and backup synchronization (`store.backup.json`).

3. **Session & Idempotency Pruning Safety**:
   - Verify that session cleanup in `ensureCoreData` only removes genuinely expired sessions (beyond their expiry timestamp) and active sessions are preserved.
   - Ensure idempotency keys retain 7-day windows without interfering with ongoing transaction locks.

4. **Automated Integration & Load Testing**:
   - Run compilation (`compile_applet`) and linter (`lint_applet`) checks.
   - Verify dev server health and API bootstrap responses.

## Deliverables
- Fully verified and robust time-based state integrity.
- Zero build/lint errors.
