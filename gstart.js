const { SlashCommandBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gcreate')
        .setDescription('Crée un giveaway')
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Durée du giveaway (ex: 1d, 1h, 30m)')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('winners')
                .setDescription('Nombre de gagnants')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('prize')
                .setDescription('Prix à gagner')
                .setRequired(true)
        ),
    async execute(interaction) {
        const duration = interaction.options.getString('duration');
        const winnersCount = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');

        const giveawayEmbed = {
            title: '🎉 Giveaway 🎉',
            description: `Réagissez avec 🎉 pour participer au giveaway et tenter de gagner **${prize}** !`,
            color: 3447003, // Couleur bleue
            fields: [
                { name: 'Durée', value: duration, inline: true },
                { name: 'Nombre de gagnants', value: winnersCount.toString(), inline: true },
                { name: 'Prix à gagner', value: prize }
            ],
            footer: { text: 'Giveaway' },
            timestamp: new Date().toISOString()
        };

        const giveawayMessage = await interaction.reply({ embeds: [giveawayEmbed], fetchReply: true });
        giveawayMessage.react('🎉');

        setTimeout(async () => {
            const reactedUsers = await giveawayMessage.reactions.cache.get('🎉').users.fetch();
            const participants = reactedUsers.filter(user => !user.bot && user.id !== giveawayMessage.author.id).map(user => user.toString());
            const winners = pickRandomWinners(participants, winnersCount);

            const winnersEmbed = {
                title: '🏆 Résultats du Giveaway 🏆',
                description: `Félicitations aux gagnants du giveaway **${prize}** !`,
                color: 3066993, // Couleur verte
                fields: [
                    { name: 'Gagnants', value: winners.join('\n') }
                ],
                footer: { text: 'Giveaway' },
                timestamp: new Date().toISOString()
            };

            interaction.followUp({ embeds: [winnersEmbed] });

            winners.forEach(winner => {
                interaction.followUp(`Félicitations à ${winner} pour avoir gagné le giveaway **${prize}** !`);
            });
        }, ms(duration));
    },
};

function pickRandomWinners(participants, numWinners) {
    const winners = [];
    const shuffledParticipants = participants.sort(() => 0.5 - Math.random());
    for (let i = 0; i < numWinners && i < shuffledParticipants.length; i++) {
        winners.push(shuffledParticipants[i]);
    }
    return winners;
}
