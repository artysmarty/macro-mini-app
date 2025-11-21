// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
} from "@farcaster/miniapp-node";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || "";

if (!NEYNAR_API_KEY) {
  console.warn(
    "Warning: NEYNAR_API_KEY not set. Webhook verification will fail in production."
  );
}

interface SendNotificationRequest {
  notificationId: string;
  title: string;
  body: string;
  targetUrl: string;
  tokens: string[];
}

interface SendNotificationResponse {
  successfulTokens: string[];
  invalidTokens: string[];
  rateLimitedTokens: string[];
}

// In production, store notification tokens in a database
// Using Map for MVP - replace with database in production
const notificationTokens = new Map<string, { url: string; token: string }>();

/**
 * Store notification details for a user-client combination
 */
function setUserNotificationDetails(
  fid: number,
  appFid: number,
  notificationDetails: { url: string; token: string }
) {
  const key = `${fid}-${appFid}`;
  notificationTokens.set(key, notificationDetails);
}

/**
 * Delete notification details for a user-client combination
 */
function deleteUserNotificationDetails(fid: number, appFid: number) {
  const key = `${fid}-${appFid}`;
  notificationTokens.delete(key);
}

/**
 * Get notification details for a user-client combination
 */
function getUserNotificationDetails(
  fid: number,
  appFid: number
): { url: string; token: string } | undefined {
  const key = `${fid}-${appFid}`;
  return notificationTokens.get(key);
}

/**
 * Send a notification to a user
 */
async function sendNotification({
  fid,
  appFid,
  title,
  body,
}: {
  fid: number;
  appFid: number;
  title: string;
  body: string;
}): Promise<{
  state: "success" | "no_token" | "rate_limit" | "error";
  error?: any;
}> {
  const notificationDetails = getUserNotificationDetails(fid, appFid);

  if (!notificationDetails) {
    return { state: "no_token" };
  }

  try {
    const response = await fetch(notificationDetails.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationId: crypto.randomUUID(),
        title,
        body,
        targetUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://macro-tracker.vercel.app"}/dashboard`,
        tokens: [notificationDetails.token],
      } as SendNotificationRequest),
    });

    const responseJson = await response.json();

    if (response.status === 200) {
      const responseBody = responseJson as SendNotificationResponse;

      if (responseBody.rateLimitedTokens?.length) {
        // Rate limited - tokens will be rate limited, can retry later
        return { state: "rate_limit" };
      }

      if (responseBody.invalidTokens?.length) {
        // Tokens are invalid, remove them
        deleteUserNotificationDetails(fid, appFid);
        return { state: "error", error: "Invalid tokens" };
      }

      return { state: "success" };
    } else {
      // Error response
      return { state: "error", error: responseJson };
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    return { state: "error", error };
  }
}

/**
 * Webhook endpoint to handle mini app events
 * Events: miniapp_added, miniapp_removed, notifications_enabled, notifications_disabled
 */
export async function POST(request: NextRequest) {
  try {
    const requestJson = await request.json();

    // Parse and verify the webhook event
    // Events are signed by the app key of a user with a JSON Farcaster Signature
    let data;
    try {
      if (NEYNAR_API_KEY) {
        data = await parseWebhookEvent(
          requestJson,
          verifyAppKeyWithNeynar
        );
      } else {
        // Development mode without verification (NOT production-safe)
        console.warn("Running in development mode without webhook verification");
        // Extract data directly for development
        data = {
          fid: requestJson.fid || requestJson.data?.fid,
          appFid: requestJson.appFid || requestJson.data?.appFid || 309857,
          event: {
            event: requestJson.event,
            notificationDetails: requestJson.notificationDetails,
          },
        };
      }
    } catch (e: unknown) {
      console.error("Webhook verification error:", e);
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // Extract webhook data
    const fid = data.fid;
    const appFid = data.appFid; // The FID of the client app that the user added the Mini App to
    const event = data.event;

    // Handle different event types
    try {
      switch (event.event) {
        case "miniapp_added":
          if ("notificationDetails" in event && event.notificationDetails) {
            setUserNotificationDetails(fid, appFid, event.notificationDetails);
            // Send welcome notification
            await sendNotification({
              fid,
              appFid,
              title: "Welcome to Macro Tracker!",
              body: "Start tracking your macros and earning rewards 💪",
            });
          }
          break;

        case "miniapp_removed":
          // Delete notification details
          deleteUserNotificationDetails(fid, appFid);
          break;

        case "notifications_enabled":
          // Save new notification details and send confirmation
          if ("notificationDetails" in event && event.notificationDetails) {
            setUserNotificationDetails(fid, appFid, event.notificationDetails);
            await sendNotification({
              fid,
              appFid,
              title: "Notifications Enabled",
              body: "You'll receive updates about your fitness journey!",
            });
          }
          break;

        case "notifications_disabled":
          // Delete notification details
          deleteUserNotificationDetails(fid, appFid);
          break;
      }
    } catch (error) {
      console.error("Error processing webhook event:", error);
      // Still return success to avoid retries for processing errors
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

