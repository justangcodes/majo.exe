const { MessageEmbed } = require("discord.js");

module.exports = {
 name: "nsfw",
 description: "🍑 Something he he",
 usage: "/nsfw <command>",
 category: "NSFW",
 nsfw: true,
 container: true,
 options: [
  {
   name: "command",
   description: "🍑 NSFW Command",
   required: true,
   type: 3,
   choices: [
    {
     name: "4k",
     value: "anal",
     description: "🔞 4K nsfw image or gif",
     usage: "/nsfw 4k",
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "anal",
     value: "anal",
     description: "🔞 Anal image or gif",
     usage: "/nsfw anal",
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "ass",
     value: "ass",
     description: "🔞 Ass image or gif",
     usage: "/nsfw ass",
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "belle",
     value: "belle",
     description: "🔞 Belle delphine image or video",
     usage: "/nsfw belle",
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "blowjob",
     value: "blowjob",
     description: "🔞 Blowjob image or gif",
     usage: "/nsfw blowjob",
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "boobs",
     value: "boobs",
     description: "🔞 Tits image or gif",
     usage: `/nsfw boobs`,
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "classic",
     value: "classic",
     description: "🔞 Classic porn image or gif",
     usage: `/nsfw classic`,
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "cum",
     value: "cum",
     description: "🔞 Cum image or gif",
     usage: `/nsfw cum`,
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "eroneko",
     value: "eroneko",
     description: "🔞 Eroneko image or gif",
     usage: `/nsfw eroneko`,
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "feet",
     value: "feet",
     description: "🔞 Feet image or gif",
     usage: `/nsfw feet`,
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "foxgirl",
     value: "foxgirl",
     description: "🔞 Foxgirl image or gif",
     usage: `/nsfw foxgirl`,
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "hentai",
     value: "hentai",
     description: "🔞 Hentai image or gif",
     usage: `/nsfw hentai`,
     category: "NSFW",
    },
    {
     name: "lesbian",
     value: "lesbian",
     description: "🔞 Lesbian image or gif",
     usage: `/nsfw lesbian`,
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "lewd",
     value: "lewd",
     description: "🔞 Lewd image or gif",
     usage: `/nsfw lewd`,
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "lick",
     value: "lick",
     description: "🔞 Lick image or gif",
     usage: `/nsfw lick`,
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "neko",
     value: "neko",
     description: "🔞 Neko image or gif",
     usage: `/nsfw neko`,
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "pussy",
     value: "pussy",
     description: "🔞 Pussy image or gif",
     usage: `/nsfw pussy`,
     category: "NSFW",
     orgin: "nsfw",
    },
    {
     name: "spank",
     value: "spank",
     description: "🔞 Spank image or gif",
     usage: `/nsfw spank`,
     category: "NSFW",
     orgin: "nsfw",
    },
   ],
  },
 ],
 run: async (client, interaction, args) => {
  try {
   require(`./modules/${args[0]}`)(client, interaction);
  } catch (err) {
   console.log(err);
   return client.createSlashCommandError(interaction, err);
  }
 },
};
