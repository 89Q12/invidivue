import IEAuthor from './IEAuthor';
import IEUrl from './IEUrl';

export default interface IEVideo {
	title: String;
	description: String;
	lengthSeconds: Number;
	ownerProfileUrl: String;
	externalChannelId: String;
	isFamilySafe: Boolean;
	availableCountries: String[];
	isUnlisted: Boolean;
	hasYpcMetadata: Boolean;
	viewCount: Number;
	category: String;
	publishDate: String;
	ownerChannelName: String;
	uploadDate: String;
	id: String;
	keywords: String[];
	channelId: String;
	averageRating: Number;
	allowRatings: Boolean;
	author: IEAuthor;
	thumbnails: IEUrl;
	isPrivate: Boolean;
	likes?: Number;
	dislikes?: Number;
	age_restricted: Boolean;
	video_url: String;
}
