// Controller for youtuber routes like getVideoById, getChannelById
const { Client } = require("youtubei");
const ytch = require('yt-channel-info');
const ytdl = require('ytdl-core');
const youtube = new Client();
//https://www.youtube.com/watch?v=dQw4w9WgXcQ //Just youtube url 
const getVideoById = async (req, res): Promise<any> => {
    if(req.query["v"]){
        const url = await ytdl.getInfo('http://www.youtube.com/watch?v='+encodeURIComponent(req.query["v"]));
        console.log(url);
        return res.status(200).json({
            message: 'OK',
            url:url,
        });
        
    }
    return res.status(400).json({
        message: 'No video id',
    });
};


const getResults = async (req, res): Promise<any> => {
    if(req.query["q"]||req.query["search_query"]){
        let query = "";
        if(req.query["q"])query=req.query["q"];
        if(req.query["search_query"])query=req.query["search_query"];
    
        
        const videos = await youtube.search(query, {
            type: "all", // video | playlist | channel | all
        });
        
        return res.status(200).json({
            message: 'OK',
            ytvideos:videos,
        });

        
        
    }
    
    return res.status(400).json({
        message: 'No search query',
    });
};
const getChannel = async (req, res): Promise<any> => {
    if(req.params["cId"]){
        const chanid= encodeURIComponent(req.params["cId"])
        const channel = await ytch.getChannelInfo(chanid);
        
        const channelId = channel.authorId;
        console.log(channelId);
        const sortBy = 'newest';

        const videos = await ytch.getChannelVideos(channelId, sortBy);
        return res.status(200).json({
            message: 'OK',
            channel:channel,
            videos:videos,
        });
    }
    return res.status(400).json({
        message: 'No channel id',
    });
}
export default { getVideoById,getResults,getChannel };