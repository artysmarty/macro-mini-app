// app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient, Errors } from "@farcaster/quick-auth";

// Get domain from environment or use localhost for development
const getDomain = () => {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (url) {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }
  return process.env.NODE_ENV === "production" ? "macro-tracker.vercel.app" : "localhost";
};

const domain = getDomain();

const client = createClient();

/**
 * Verify Quick Auth JWT token
 * This endpoint verifies the JWT token from Quick Auth and returns the user's FID
 */
export async function GET(request: NextRequest) {
  const authorization = request.headers.get("Authorization");
  
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    // Verify JWT token signature and decode payload
    // The token contains:
    // - iss: "https://auth.farcaster.xyz"
    // - sub: user's FID (number)
    // - aud: your domain
    // - exp: expiration timestamp
    // - iat: issued at timestamp
    const payload = await client.verifyJwt({ token, domain });
    
    // Return the user's FID from the verified JWT payload
    return NextResponse.json({
      fid: payload.sub,
    });
  } catch (e) {
    console.error("Auth error:", e);
    
    if (e instanceof Errors.InvalidTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
