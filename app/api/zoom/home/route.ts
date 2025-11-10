import { type NextRequest, NextResponse } from "next/server";
import { decryptZoomAppContext } from "@/app/lib/zoom-helper";
import { updateSession } from "@/utils/supabase/middleware";
import { redisService } from "@/lib/services/redis.service";
import { config } from "@/lib/config/environment";
import { handleAsyncError, logError } from "@/lib/utils/error-handler";

export async function GET(request: NextRequest) {
  console.log("__________________________Zoom Home Page Get Route________________________", "\n");
  const response = await updateSession(request);
  const { searchParams, origin } = new URL(request.url);

  console.log("searchParams:", searchParams.toString(), "\n");
  console.log("origin:", origin, "\n");


  const zoomHeader = request.headers.get("x-zoom-app-context");

  logRequest(request.url, zoomHeader, searchParams);
  const parsedAction = handleZoomContext(zoomHeader);
  const { uid ,state, act } = parsedAction;

  console.log(
    "\n",
    `Used for looking up Team Chat modal token using secondary Redis key (userId: ${uid}, state: ${state}) from Zoom context headers.\n`
  );
  
  // Only write to Redis if *both* uid and state are present
  if (uid && state) {
    try {
      await redisService.storeUserLatestState(uid, state);
      console.log("☑️  Saved latestState to Redis");
    } catch (e) {
      logError(e as Error, "Redis write failed", { uid, state });
      return NextResponse.json({ error: "Redis write failed" }, { status: 500 });
    }
  } else {
    console.log("ℹ No state in context (or missing uid) — skipping Redis write");
  }

  // Handle API mode from client request (no redirect)
  const result = await handleActParam(act, state);
  if (result) return result;

  const redirectUrl = buildRedirectUrl(request, searchParams, origin);

  return NextResponse.redirect(redirectUrl);

}

function logRequest(url: string, header: string | null, params: URLSearchParams) {
  console.log("🔗 Request URL:", url, "\n");
  console.log("🔍 HomeURL Template Parameters:");
  for (const [key, value] of Array.from(params.entries())) {
    console.log(`• ${key}: ${value}`);
  }
  console.log("\n","🚨 Note the Action Parameter will include the State param and deeplink Action!", '\n');
  console.log("🔑 Zoom Header:", header, "\n");
}

function buildRedirectUrl(request: NextRequest, searchParams: URLSearchParams, origin: string) {
  const next = searchParams.get("next") ?? "/";

  console.log("Next param:", next);

  const host = "https://" + request.headers.get("x-forwarded-host");
  return config.app.isDevelopment ? `${host}${next}` : `${origin}${next}`;
}

/**
 * Helper function to handle the "act" parameter logic
 */
async function handleActParam(
  act: { verified?: string } | undefined,
  state: string | undefined
): Promise<Response | null> {
  if (act?.verified === "getToken") {
    console.log("\n","⭐️ User-defined Deeplink Action:", act.verified, );
    console.log(" 🧠 LEARN MORE: https://developers.zoom.us/docs/api/marketplace/#tag/apps/POST/zoomapp/deeplink", "\n");


    try {
      const tokenData = await redisService.getSupabaseTokens(state ?? "");
      console.log("🔐 Token retrieved from Redis:", tokenData, "\n");

      const redirectUrl = new URL("https://donte.ngrok.io");
      redirectUrl.searchParams.set("state", state ?? "");

      console.log("🔄 Zoom App Home redirected:", redirectUrl.toString(), "\n");

      return NextResponse.redirect(redirectUrl.toString());
    } catch (e) {
      console.error("❌ Failed to retrieve token from Redis:", e);
      return NextResponse.redirect("https://donte.ngrok.io?error=token_not_found");
    }
  }

  return null;
}


function handleZoomContext(header: string | null): {
  uid?: string;
  act?: any;
  verified?: string;
  state?: string;
} {
  if (!header) {
    console.log("ℹ️ No x-zoom-app-context header found. Likely first load in Zoom Client.");
    return {};
  }

  try {
    const context = decryptZoomAppContext(header, config.zoom.clientSecret);
    console.log("🔐 Decrypted Zoom Context:", context, '\n');

    // UID is already a plain string, do not parse
    const uid = context.uid;
    if (!uid) {
      console.log("⚠️ Zoom Context missing UID — invalid or malformed.");
      return {};
    }

    console.log("⭐️ User ID from Zoom Context:", uid);

    // Act is optional — deep linking or context-based actions
    let act: any = undefined;
    let state: any  = undefined;
    if (context.act) {
      try {
        act = JSON.parse(context.act);
        console.log("🎬 Parsed Zoom Action Context:", act);

        state = act.state 
        if (act.state) {
          console.log("☄️  State from Action Context:", act.state);
        } else {
          console.log("⚠️ Action Context missing State — invalid or malformed.");
        }
      } catch (e) {
        console.warn("❌ Failed to parse 'act' from context:", e);
      }
    } else {
      console.log(" ⚠️  No 'act' value in Zoom Context — likely a standard app open.");
    }

    return {uid,act,state};
  } catch (error) {
    console.error("❌ Failed to process Zoom context:", error);
    return {};
  }
}

