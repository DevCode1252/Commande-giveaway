const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gend')
        .setDescription('Termine rapidement un giveaway en sélectionnant un gagnant'),
    async execute(interaction) {
        const giveawayChannel = interaction.channel;
        const giveawayMessage = await giveawayChannel.messages.fetch({ limit: 1 });
        const giveawayEmbed = giveawayMessage.first().embeds[0];

        if (!giveawayEmbed || giveawayEmbed.title !== '🎉 Giveaway 🎉') {
            return interaction.reply('Il n\'y a pas de giveaway en cours dans ce salon.');
        }

        const participants = await giveawayMessage.first().reactions.cache.get('🎉').users.fetch();
        const eligibleParticipants = participants.filter(user => !user.bot);

        if (eligibleParticipants.size <= 1) {
            return interaction.reply('Il n\'y a pas suffisamment de participants pour sélectionner un gagnant.');
        }

        const winner = eligibleParticipants.random();
        const winnerEmbed = {
            title: '🎉 Giveaway Terminé 🎉',
            description: `Le giveaway est terminé ! Le gagnant est : ${winner}`,
            color: 3066993, // Couleur verte
            footer: { text: 'Giveaway' },
            timestamp: new Date().toISOString()
        };

        giveawayMessage.first().reactions.removeAll();
        giveawayMessage.first().edit({ embeds: [winnerEmbed] });
        interaction.reply(`Le giveaway est terminé ! Le gagnant est : ${winner}`);
    },
};
