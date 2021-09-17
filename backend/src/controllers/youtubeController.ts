import { Response } from "express";

// Controller for youtuber routes like getVideoById, getChannelById
import  { Client } from "youtubei";
import * as ytch from 'yt-channel-info';
import * as ytdl from 'ytdl-core';

import {Any, createConnection, EntityTarget, In, Repository} from "typeorm";
import { Channel } from "../entity/Channel";
import { User } from "../entity/User";
import { Search } from "../entity/Search";
import { Video } from "../entity/Video";
var connection = createConnection();
const youtube = new Client();

//https://www.youtube.com/watch?v=dQw4w9WgXcQ //Just youtube url 
const getVideoById = async (req, res): Promise<Response> => {
    if(req.query["v"]){
        const vid= encodeURIComponent(req.query["v"]);
        
        const conn = await connection;
        const videos = conn.getRepository(Video);
        const video = await videos.findOne({ytid:vid}).catch((reason:any)=>console.log(reason));
        
        const url = await ytdl.getInfo('http://www.youtube.com/watch?v='+vid);
        
        if(video){
            video.internalclicks++;
            videos.save(video);
        }else{
            let newvideo=new Video();
            if(url["videoDetails"]){
                if(url["videoDetails"]["lengthSeconds"]){
                    newvideo.seconds=Number(url["videoDetails"]["lengthSeconds"]);
                }
            }
            newvideo.internalclicks=1;
            newvideo.cache=JSON.stringify(url);
            videos.save(newvideo);
        }
        return res.status(200).json({
            message: 'OK',
            url:url
        });
        
    }
    return res.status(400).json({
        message: 'No video id',
    });
};


const getResults = async (req, res): Promise<Response> => {
    if(req.query["q"]||req.query["search_query"]){
        let query = "";
        if(req.query["q"])query=req.query["q"];
        if(req.query["search_query"])query=req.query["search_query"];
        
        var ONE_HOUR = 60 * 60 * 1000;
        let reloadflag = false;
        const conn = await connection;
            const searches = await conn.getRepository(Search);
        if(req.query["forcereload"]){
            reloadflag=true;
        }else{
            
            const s = await searches.findOne({query:query});
            if(s){
                if(((new Date()).getTime() -s.lastloaded.getTime())<ONE_HOUR){
                    return res.status(200).json({
                        message: 'OK',
                        ytvideos:s.cache,
                    });
                }else{
                    reloadflag=true;
                }
            }else{
                reloadflag=true;
            }
        }
        
        if(reloadflag){
            const videos = await youtube.search(query, {
                type: "all", // video | playlist | channel | all
            });
            let dbsearch = new Search();
            dbsearch.query=query;
            dbsearch.cache=JSON.stringify(videos);
            return res.status(200).json({
                message: 'OK',
                ytvideos:videos,
            });
            await searches.save(dbsearch);
        }else{
            return res.status(400).json({
                message: 'not implemented',
            });
        }
    }
    
    return res.status(400).json({
        message: 'No search query',
    });
};

const getchannelinfo =async (id:string) =>{
    const chanid= encodeURIComponent(id);
    const channel = await ytch.getChannelInfo(chanid);
    return channel;
};
const getcachedchannel= async (channelid:string) => {
    const conn = await connection;
    const channels = conn.getRepository(Channel);
    const dbchan = await channels.findOne({channelid:channelid});
    if(dbchan){
        let json= {}
        if(dbchan.cache==""){
            const channel = await getchannelinfo(channelid);
            json = channel;
            dbchan.cache=JSON.stringify(channel);
            channels.save(dbchan);
        }else{
            json= JSON.parse(dbchan.cache);
        }
        json["dbchannel"] = dbchan;
        return json;
    }else{
        const channel = await getchannelinfo(channelid);
        //console.log(channel);
        if(channel){
            const newchannel = new Channel();
            newchannel.channelid=channel.authorId;
            newchannel.cache=JSON.stringify(channel);
            channels.save(newchannel);
            channel["dbchannel"] = newchannel;
            return channel;
        }
    }
    return {};
}
const getvideos = async (channelId:string,sortBy:string) => {
    //ytch.getChannelVideos(channelId, sortBy);
    
   return await ytch.getChannelVideos(channelId, sortBy); 
    

};
const getnewestvideos = async (channelId:string) => {
    return await getvideos(channelId,'newest');
};
const getnewestvideoscached = async (channelid:string) => {
    const conn = await connection;
    const channels = conn.getRepository(Channel);
    let dbchan = await channels.findOne({channelid:channelid});
    if(dbchan){
    }else{
        getcachedchannel(channelid);
        dbchan = await channels.findOne({channelid:channelid});
    }
    if(dbchan){
        if((new Date()).getTime()- dbchan.lastloaded.getTime()>(1000*60*60) || dbchan.newestcache==""){
            const newest = await getnewestvideos(dbchan.channelid);
            dbchan.newestcache=JSON.stringify(newest);
            channels.save(dbchan);
        }else{
            return JSON.parse(dbchan.newestcache);
        }
        
    }else{
        return null;
    }
};
const getChannel = async (req, res): Promise<Response> => {
    if(req.params["cid"]){
        const channel = await getcachedchannel(req.params["cid"])
        channel.dbchannel = {};
        return res.status(200).json({
            message: 'OK',
            channel:channel,

        });
    }
    return res.status(400).json({
        message: 'No channel id',
    });
};
const subscribeuser= async (channel:Channel,user:User):Promise<boolean> => {
    const conn = await connection;
    const users = conn.getRepository(User);
    const sqlresult= await users.createQueryBuilder("user")
    .leftJoinAndSelect("user.subscriptions","channel")
    .where("user.id=:id",{id:user.id})
    .where("channel.id=:id",{id:channel.id})
    .getOne();
    if(sqlresult){
        return false;
    }else{
        if(user.subscriptions==undefined)user.subscriptions=[];
        user.subscriptions.push(channel);
        users.save(user);
        return true;
    }
    return false;
    
};

const subscribe = async (req, res): Promise<Response> => {
    if(req.user){
        //console.log(req);
        if(req.query["cid"]){
            const cid = req.query.cid;
            const conn = await connection;
            const channels = conn.getRepository(Channel);
            const users = conn.getRepository(User);
            const user = await users.findOne(req.user,{ relations: ["subscriptions"] });
            if(user){
                const dbchan = await channels.findOne({channelid:cid});
                if(dbchan){
                        
                    if(await subscribeuser(dbchan,user)){
                        return res.status(200).json({
                            message: 'OK'
                        });
                       }else{
                        return res.status(200).json({
                            message: 'already subscribed'
                        });
                       }
                }else{
                    const channel = await getcachedchannel(cid);
                    console.log(channel);
                    if(channel){
                        const newchannel = new Channel();
                        newchannel.channelid=channel.authorId;
                        channels.save(newchannel);

                        
                       if(await subscribeuser(newchannel,user)){
                        return res.status(200).json({
                            message: 'OK'
                        });
                       }else{
                        return res.status(200).json({
                            message: 'already subscribed'
                        });
                       }

                        
                        
                    }else{
                        return res.status(400).json({
                            message: 'not a channel id',
                        });
                    }
                }
            }else{
                return res.status(400).json({
                    message: 'not logged in',
                });
            }
        }else{
            return res.status(400).json({
                message: 'no channel id',
            });
        }
    }else{
        return res.status(400).json({
            message: 'not logged in',
        });
    }
    return res.status(400).json({
		message: 'not implemented',
	});
};
const unsubscribe = async (req, res): Promise<Response> => {
    if(req.user){
        if(req.query.cid){
            const cid = req.query.cid;
            const conn = await connection;
            const channels = conn.getRepository(Channel);
            const users = conn.getRepository(User);
            const user = await users.findOne(req.user,{ relations: ["subscriptions"] });
            if(user){
                const dbchan = await channels.findOne({channelid:cid});
                if(dbchan){
                    let flag = false;
                    console.log(dbchan.id);
                    const newsubs = user.subscriptions.filter(channel=>{
                            if(channel.id !== dbchan.id){
                                
                                return true;
                            }else{
                                flag = true;
                                return false;
                            }
                    });
                    user.subscriptions=newsubs;
                    users.save(user);
                    if(flag){
                        return res.status(200).json({
                            message: 'OK',
                        });
                    }else{
                        return res.status(400).json({
                            message: 'channel not subscribed',
                        });
                    }
                }else{
                    return res.status(400).json({
                        message: 'channel not found',
                    });
                }
            }else{
                return res.status(400).json({
                    message: 'user not found',
                });
            }
        }
    }else{
        return res.status(400).json({
            message: 'not logged in',
        });
    }
    return res.status(400).json({
		message: 'not implemented',
	});
};
const getSubscriptions = async (req, res): Promise<Response> => {
    if(req.user){
        const conn = await connection;
        const users = conn.getRepository(User);
        const user = await users.findOne(req.user,{ relations: ["subscriptions"] });
        
        if(user){
            return res.status(200).json({
                message: 'OK',
                subscriptions:user.subscriptions
            });
        }
    }else{
        return res.status(400).json({
            message: 'not logged in',
        });
    }
    return res.status(400).json({
		message: 'not implemented',
	});
};

const uploadnewpipesubs = async (req, res): Promise<Response> => {
    if(req.user){
        const conn = await connection;
        const users = conn.getRepository(User);
        const user = await users.findOne(req.user,{ relations: ["subscriptions"] });
        //console.log(req.body);
        if(user){
            const subs = req.body;
            if(subs["subscriptions"]){
                let failed= 0;
                let added= 0;
                subs["subscriptions"].forEach(async e => {
                   const channelurl = e.url;
                   if(channelurl.search("https://www.youtube.com/channel/")==0){
                        const channelid= channelurl.substr('https://www.youtube.com/channel/'.length);
                        const channel = await getcachedchannel(channelid);
                        //console.log(channel);
                        if(!await subscribeuser(channel["dbchannel"],user)){
                            failed++;
                        }else{
                            added++;
                        }
                   }
                });
                return res.status(200).json({
                    message: 'OK',
                    added:added,
                    failed:failed
                });
            }
            
            return res.status(200).json({
                message: 'OK'
            });
            return res.status(400).json({
                message: 'not implemented',
            });
        }
    }else{
        return res.status(400).json({
            message: 'not logged in',
        });
    }
    return res.status(400).json({
		message: 'not implemented',
	});
};
const addvideo=async()=>{

}
const texttomillis=(e,y)=>{
    if(e=="hours"||e=="hour"){
        return 1000*60*60;
    }
    else if(e=="days"||e=="day"){
        return 1000*60*60*24;
    }
    else if(e=="months"||e=="month"){
        return 1000*60*60*24*30;
    }
    else if(e=="weeks"||e=="week"){
        return 1000*60*60*24*7;
    }
    else if(e=="years"||e=="year"){
        return 1000*60*60*24*365;
    }
    else if(e=="minutes"||e=="minute"){
        return 1000*60;
    }
    else{
        console.log("not found:''"+e+"''"+y+"''");
    }
    return 0;
};
const publishedtexttomillis=(text)=>{
    const splitted= text.split(" ");
    if(splitted[0]!="Live"){
        return 0;
    }
    if(splitted[0]!="Streamed"){
        return(Number(splitted[0])*texttomillis(splitted[1],splitted));
    }else{
        return(Number(splitted[1])*texttomillis(splitted[2],splitted));
    }
}

const updateChannel= async (channel)=>{
    const conn = await connection;
    const videos = conn.getRepository(Video);
    const newest = await getnewestvideoscached(channel.channelid);
            
            if(newest){
                if(newest["items"]){
                    const items = newest["items"]
                    for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        
                        if(item["videoId"]){
                            const videoId = item["videoId"];
                            const video = await videos.findOne({ytid:videoId});
                            if(video){
                                //console.log("indb");
                                break;
                            }else{
                                const newvideo = new Video();
                                newvideo.ytid=videoId;
                                newvideo.channel=channel;
                                //newvids.push(item);
                                if(item["lengthSeconds"]){
                                    newvideo.seconds=item["lengthSeconds"];
                                }
                                if(item["publishedText"]){
                                    //console.log(item["publishedText"]);
                                    newvideo.guesseddate=new Date((new Date()).getTime()-publishedtexttomillis(item["publishedText"]));
                                }
                                newvideo.cache=JSON.stringify(item);
                                videos.save(newvideo);
                                
                            }
                        }
                    }
                }
            }
}
const updatefeeds= async()=>{
    const conn = await connection;
    const channels = conn.getRepository(Channel);
    const count = await channels.createQueryBuilder().getCount();
    const pagesize= 50;
    for (let i = 0; i < count; i+=pagesize) {
        const query = await channels.createQueryBuilder().limit(pagesize).skip(i).getMany();
        for (let x = 0; x < query.length; x++) {
            const element = query[x];
            updateChannel(element);
            console.log((i+x) +" / "+ count);
        }
    }
};
const getFeed = async (req, res): Promise<Response> => {
    if(req.user){
        const conn = await connection;
        const users = conn.getRepository(User);
        const channels = conn.getRepository(Channel);
        const user = await users.findOne(req.user,{ relations: ["subscriptions"] });
        let out = [];
        const subs = user.subscriptions;
        const videos = conn.getRepository(Video);
        let chids=[];
        let newvids=[];
        for (let index = 0; index < subs.length; index++) {
            console.log(index +" / "+ subs.length);
            const channel = subs[index];
            chids.push(channel.id);
            updateChannel(channel);
        }
        
        const q= await videos.createQueryBuilder("video")
        .select("video.ytid, video.seconds, video.internalclicks, video.cache, video.guesseddate")
        .where("channelId IN(:...ids)", { ids: chids })
        .orderBy('guesseddate', 'DESC')
        .limit(100)
        .getRawMany();
        return res.status(200).json({
            message: 'OK',
            feed: q
        });
        //videos.createQueryBuilder("video").where("channel.id IN (:chids)",{chids:chids}).orderBy("  ")
    }else{
        return res.status(400).json({
            message: 'not logged in',
        });
    }
    return res.status(400).json({
		message: 'not implemented',
	});
}

export default { getVideoById,getResults,getChannel,subscribe,unsubscribe,getSubscriptions,uploadnewpipesubs,getFeed,updatefeeds };