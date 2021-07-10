// Controller for youtuber routes like getVideoById, getChannelById

const getVideoById = async (req, res): Promise<any> => {};


const getSearch = async (req, res): Promise<any> => {

    const { Client } = require("youtubei");

    const youtube = new Client();

    const run = async () => {
	const videos = await youtube.search("Never gonna give you up", {
		type: "all", // video | playlist | channel | all
	});
	console.log(videos.length);
    console.log(videos);
    };
    run();
};

//export default { getSearch };
export default { getVideoById,getSearch };