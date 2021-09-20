import IEUrl from "./IEUrl";

export default interface IESearchChannel{
    _videoContinuation?: String;
    _playlistContinuation?: String;
    id: String;
    name: String;
    thumbnails: IEUrl[];
    videoCount: Number;
    subscriberCount: String;
}