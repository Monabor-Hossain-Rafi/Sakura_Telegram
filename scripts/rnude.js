const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const download = require('image-downloader');

module.exports = {
    config: {
        name: "rnude",
        version: "1.0",
        author: "Rafi",
        category: "NSFW",
        role: 0,
    },
    annieStart: async function({ bot, msg }) {
        bot.sendMessage(msg.chat.id, "Please wait while I fetch a random image...");

        try {
            // Fetch image URL from the API
            const response = await axios.get('https://rnude-api.vercel.app/random-image');
            const imageUrl = response.data.raw_url;

            // Generate a unique file name
            const fileName = `${uuidv4()}.jpg`;
            const filePath = path.join(__dirname, 'tmp', fileName);

            // Download the image and save it to the tmp folder
            await download.image({
                url: imageUrl,
                dest: filePath
            });

            // Send the image to the user
            bot.sendPhoto(msg.chat.id, filePath, { caption: "Here is your random image:" });

            // Delete the image from the tmp folder after sending
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error(error);
            bot.sendMessage(msg.chat.id, "Failed to fetch a random image.");
        }
    }
};
