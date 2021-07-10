// Controller for youtuber routes like getVideoById, getChannelById
const { Client } = require("youtubei");
const ytdl = require('ytdl-core');
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
        const youtube = new Client();
    
        
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

//export default { getSearch };
export default { getVideoById,getResults };