import { Response } from "express";

// Controller for youtuber routes like getVideoById, getChannelById
import  { Client } from "youtubei";
import * as ytch from 'yt-channel-info';
import * as ytdl from 'ytdl-core';

import {createConnection, EntityTarget, Repository} from "typeorm";
import { Channel } from "../entity/Channel";
import { User } from "../entity/User";
var connection = createConnection();
const youtube = new Client();
//https://www.youtube.com/watch?v=dQw4w9WgXcQ //Just youtube url 
const getVideoById = async (req, res): Promise<Response> => {
    if(req.query["v"]){
        const url = await ytdl.getInfo('http://www.youtube.com/watch?v='+encodeURIComponent(req.query["v"]));
        //console.log(url);
        return res.status(200).json({
            message: 'OK',
            url:url,
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
    return await ytch.getChannelVideos(channelId, sortBy); 
};
const getnewestvideos = async (channelId:string) => {
    getvideos(channelId,'newest');
};
const getChannel = async (req, res): Promise<Response> => {
    if(req.params["cid"]){
        const channel = await getcachedchannel(req.params["cid"])
        const videos = await getnewestvideos(channel.channelId);
        return res.status(200).json({
            message: 'OK',
            channel:channel,
            videos:videos,
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
                            return channel.id !== dbchan.id
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
        const user = await users.findOne(req.user);
        if(user){
            return res.status(200).json({
                message: 'OK',
                subscribtions:user.subscriptions
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
export default { getVideoById,getResults,getChannel,subscribe,unsubscribe,getSubscriptions,uploadnewpipesubs };