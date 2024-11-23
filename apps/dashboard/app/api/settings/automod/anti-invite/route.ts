import { globalConfig } from "@majoexe/config";
import prismaClient from "@majoexe/database";
import { AutoModerationRuleCreationData, createHTTPAutomodRule, validateAutoModIgnores, validateAutoModRuleActions } from "@majoexe/util/functions/automod";
import { getGuild, getGuildFromMemberGuilds } from "@majoexe/util/functions/guild";
import { AutoModerationActionType, AutoModerationRuleTriggerType, AutoModerationRuleEventType, ChannelType } from "discord-api-types/v10";
import { getSession } from "lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
 try {
  const session = await getSession();
  const start = Date.now();

  if (!session || !session.access_token) {
   return NextResponse.json(
    {
     error: "Unauthorized - you need to log in first",
    },
    {
     status: 401,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  const cloned = request.clone();
  const data: AutoModerationRuleCreationData | undefined = await cloned.json();

  if (!data) {
   return NextResponse.json(
    {
     error: "Bad Request - incomplete data",
     code: 400,
    },
    {
     status: 400,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  if (!data.actions || data.actions.length === 0) {
   data.actions = [
    {
     type: AutoModerationActionType.BlockMessage,
     metadata: {
      custom_message: "Message blocked due to containing an invite link. Rule added by Majo.exe",
     },
    },
   ];
  }

  if (
   // prettier
   !data ||
   !data.id ||
   typeof data.id !== "string" ||
   typeof data.enabled !== "boolean" ||
   !data.exemptRoles ||
   !data.exemptChannels ||
   !data.actions ||
   !Array.isArray(data.actions) ||
   !Array.isArray(data.exemptRoles) ||
   !Array.isArray(data.exemptChannels) ||
   !data.exemptRoles.every((r) => typeof r === "string") ||
   !data.exemptChannels.every((c) => typeof c === "string") ||
   !data.actions.every((a) => a.type === AutoModerationActionType.BlockMessage || a.type === AutoModerationActionType.SendAlertMessage || a.type === AutoModerationActionType.Timeout)
  ) {
   return NextResponse.json(
    {
     error: "Bad Request - incomplete data",
     code: 400,
    },
    {
     status: 400,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  const server = await getGuild(data.id);

  if (!server) {
   return NextResponse.json(
    {
     error: "Unable to find this server",
     code: 404,
    },
    {
     status: 404,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  if (!server.bot) {
   return NextResponse.json(
    {
     error: "Bot is unable to find this server",
     code: 404,
    },
    {
     status: 404,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  const serverMember = await getGuildFromMemberGuilds(server.id, session.access_token);

  if (!serverMember || !serverMember.permissions_names || !serverMember.permissions_names.includes("ManageGuild") || !serverMember.permissions_names.includes("Administrator")) {
   return NextResponse.json(
    {
     error: "Unauthorized - you need to log in first",
     code: 401,
    },
    {
     status: 401,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  await prismaClient.guild.upsert({
   where: {
    guildId: server.id,
   },
   update: {},
   create: {
    guildId: server.id,
   },
   include: {
    autoMod: {
     where: {
      guildId: server.id,
     },
    },
   },
  });

  const allRolesFetch = await fetch(`https://discord.com/api/v${globalConfig.apiVersion}/guilds/${server.id}/roles`, {
   method: "GET",
   headers: {
    Authorization: `Bot ${process.env.TOKEN}`,
   },
  }).then((res) => res.json());

  const allChannelsFetch = await fetch(`https://discord.com/api/v${globalConfig.apiVersion}/guilds/${server.id}/channels`, {
   method: "GET",
   headers: {
    Authorization: `Bot ${process.env.TOKEN}`,
   },
  }).then((res) => res.json());

  const allRoles = allRolesFetch
   .map((role) => {
    if (role.name === "@everyone") return null;
    return {
     id: role.id,
     name: role.name,
     color: role.color ? `#${role.color.toString(16).toUpperCase()}` : "#FFFFFF",
    };
   })
   .filter(Boolean);

  const allChannels = allChannelsFetch
   .map((channel) => {
    if (channel.type !== ChannelType.GuildText) return null;

    return {
     id: channel.id,
     name: channel.name,
     type: channel.type,
     permissions: channel.permission_overwrites,
    };
   })
   .filter(Boolean);

  const validatedIgnores = await validateAutoModIgnores(allChannels, allRoles, data.exemptRoles, data.exemptChannels);

  if (validatedIgnores.error || validatedIgnores.code !== 200) {
   return NextResponse.json(
    {
     error: validatedIgnores.error,
     code: validatedIgnores.code,
    },
    {
     status: validatedIgnores.code,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  const validatedActions = await validateAutoModRuleActions(data.actions, allChannels, "Message blocked due to containing an invite link. Rule added by Majo.exe");

  if ("error" in validatedActions) {
   return NextResponse.json(
    {
     error: validatedActions.error,
     code: validatedActions.code,
    },
    {
     status: validatedActions.code,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  if (!validatedActions || validatedActions.length === 0) {
   return NextResponse.json(
    {
     error: "You must have at least one action enabled",
     code: 400,
    },
    {
     status: 400,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  const createdRule = await createHTTPAutomodRule(server.id, "anti-invite", {
   enabled: data.enabled,
   name: "Disallow invites [Majo.exe]",
   actions: validatedActions,
   event_type: AutoModerationRuleEventType.MessageSend,
   trigger_type: AutoModerationRuleTriggerType.Keyword,
   exempt_roles: data.exemptRoles,
   exempt_channels: data.exemptChannels,
   trigger_metadata: {
    regex_patterns: ["(?:https?://)?(?:www.|ptb.|canary.)?(?:discord(?:app)?.(?:(?:com|gg)/(?:invite|servers)/[a-z0-9-_]+)|discord.gg/[a-z0-9-_]+)"],
   },
  });

  if (createdRule.error) {
   return NextResponse.json(
    {
     error: createdRule.error,
     code: createdRule.code,
    },
    {
     status: createdRule.code,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  } else {
   return NextResponse.json(
    {
     message: "Successfully updated the anti-invite system",
     code: 200,
    },
    {
     status: 200,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }
 } catch (err) {
  console.log(err);
  return NextResponse.json(
   {
    error: "Internal Server Error",
    code: 500,
   },
   {
    status: 500,
   }
  );
 }
}
