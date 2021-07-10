// Controller for youtuber routes like getVideoById, getChannelById
const { Client } = require("youtubei");

const getVideoById = async (req, res): Promise<any> => {};


const getResults = async (req, res): Promise<any> => {
    if(req.query["q"]||req.query["search_query"]){
        let query = "";
        if(req.query["q"])query=req.query["q"];
        if(req.query["search_query"])query=req.query["search_query"];
        const youtube = new Client();
    
        
        const videos = await youtube.search("Never gonna give you up", {
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