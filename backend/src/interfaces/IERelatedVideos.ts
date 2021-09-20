import IEAuthor from './IEAuthor';
import IEUrl from './IEUrl';

export default interface IERelatedVideos {
	id: String;
	title: String;
	published: String;
	author: IEAuthor;
	short_view_count_text: String;
	view_count: Number;
	length_seconds: Number;
	thumbnails: IEUrl[];
	richThumbnails?: IEUrl[];
	isLive: Boolean;
}
