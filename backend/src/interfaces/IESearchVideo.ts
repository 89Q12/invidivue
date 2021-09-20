import IERelatedChannel from "./IERelatedChannel";
import IESearchChannel from "./IESearchChannel";
import IEUrl from "./IEUrl";

export default interface IESearchVideo{
    id: String;
    title: String;
    thumbnails: IEUrl[];
    uploadDate: String;
    duration: Number;
    isLive: Boolean;
    channel: IESearchChannel;
    viewCount: Number;
}