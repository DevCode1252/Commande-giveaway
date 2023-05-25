const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gstop')
        .setDescription('Annule un giveaway en cours'),
    async execute(interaction) {
        const giveawayChannel = interaction.channel;
        const giveawayMessage = await giveawayChannel.messages.fetch({ limit: 1 });
        const giveawayEmbed = giveawayMessage.first().embeds[0];

        if (!giveawayEmbed || giveawayEmbed.title !== '🎉 Giveaway 🎉') {
            return interaction.reply('Il n\'y a pas de giveaway en cours dans ce salon.');
        }

        giveawayMessage.first().reactions.removeAll();

        const cancelledEmbed = {
            title: '🚫 Giveaway Annulé 🚫',
            description: 'Le giveaway a été annulé.',
            color: 15158332, // Couleur rouge
            footer: { text: 'Giveaway' },
            timestamp: new Date().toISOString()
        };

        giveawayMessage.first().edit({ embeds: [cancelledEmbed] });
        interaction.reply('Le giveaway a été annulé avec succès.');
    },
};
