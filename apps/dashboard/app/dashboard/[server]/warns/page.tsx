import prismaClient from "@majoexe/database";
import { getGuildFromMemberGuilds, getGuild } from "@majoexe/util/functions/guild";
import { getSession } from "lib/session";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Block } from "@/components/Block";
import { Warns } from "@/components/client/lists/Warns";
import Header, { headerVariants } from "@/components/Headers";
import { Icons, iconVariants } from "@/components/Icons";
import { cn } from "@/lib/utils";

export const metadata = {
 title: "Warns",
 description: "View the warn logs of your server.",
};

export default async function Page(props: { params: Promise<{ server: string }> }) {
 const params = await props.params;
 const session = await getSession();
 if (!session || !session.access_token) redirect("/auth/login");
 const { server } = params;
 const serverDownload = await getGuild(server);
 if (!serverDownload || !serverDownload.bot) return notFound();
 const serverMember = await getGuildFromMemberGuilds(serverDownload.id, session.access_token);
 if (
  // prettier
  !serverMember ||
  !serverMember.permissions_names ||
  !serverMember.permissions_names.includes("ManageGuild") ||
  !serverMember.permissions_names.includes("Administrator")
 )
  return notFound();

 const guild = await prismaClient.guild.upsert({
  where: {
   guildId: serverDownload.id,
  },
  update: {},
  create: {
   guildId: serverDownload.id,
  },
  include: {
   guildWarns: {
    orderBy: {
     createdAt: "desc",
    },
    include: {
     user: {
      select: {
       discordId: true,
       name: true,
       avatar: true,
       discriminator: true,
      },
     },
    },
   },
  },
 });

 const warns = guild.guildWarns.map(async (warn) => {
  return {
   ...warn,
   createdAt: warn.createdAt instanceof Date ? warn.createdAt.toString() : new Date(warn.createdAt).toString(),
   link: warn.user.discordId,
  };
 });

 return (
  <>
   <Header className={cn(headerVariants({ variant: "h1" }))}>
    <Icons.warning className={iconVariants({ variant: "extraLarge" })} />
    Warns <span className="text-accent-primary">({warns.length})</span>
   </Header>
   <p className="mb-4 text-left text-base md:text-lg">
    Here you can view all users warns issued by users with the <code>Manage Server</code> permission.
   </p>
   <Block className="mt-4 flex w-full overflow-auto">
    {warns.length === 0 && (
     <p className="flex items-center gap-2 text-left">
      <Icons.Sparkles className={iconVariants({ variant: "normal" })} />
      Hooray! No warns have been issued yet.
     </p>
    )}
    {warns.length > 0 && <Warns data={warns} />}
   </Block>
  </>
 );
}
