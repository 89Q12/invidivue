import IEUrl from "./IEUrl";

export default interface IEAuthor{
    id:string;
    name: String;
    user: String;
    channel_url: String;
    external_channel_url: String;
    user_url: String;
    thumbnails: IEUrl[];
    verified: Boolean
    subscriber_count?: Number;
}