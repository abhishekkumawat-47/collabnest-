import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  //console.log("Session:", session);

  if (!session || !session.accessToken) {
    //console.error("No session or access token found.");
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { startDateTime, endDateTime, subject } = await req.json();

  const client = Client.init({
    authProvider: (done) => {
      done(null, session.accessToken as string);
    },
  });

  try {
    const meeting = await client.api("/me/onlineMeetings").post({
      startDateTime,
      endDateTime,
      subject,
    });

    return new Response(JSON.stringify({ meeting }), { status: 200 });
  } catch (err) {
    console.error("Meeting error:", err);
    return new Response(JSON.stringify({ error: "Failed to create meeting" }), { status: 500 });
  }
}
