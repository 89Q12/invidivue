import IEUrl from "./IEUrl";
import IERelatedChannel from "./IERelatedChannel";

export default interface IEChannel{
    author: String;
    authorId: String;
    authorUrl: String;
    authorBanners: IEUrl[];
    authorThumbnails: IEUrl[];
    subscriberText: String;
    subscriberCount: Number;
    description: String;
    isFamilyFriendly: Boolean;
    relatedChannels?: IERelatedChannel[]
    allowedRegions: String[];
    isVerified: Boolean;
    channelIdType: Number;
}