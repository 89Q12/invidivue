import { time } from 'console';
import { EntityTarget, Connection, createConnection, Repository, SaveOptions, FindOneOptions, getConnection } from 'typeorm';

export class Cache {
	private connection: Connection | Promise<Connection>;
	private expireAfter: Number;
	private setUpFuncs: Array<Promise<Function>>;
	/**
	 *
	 * @param seutUpFuncs An array of functions that should run after connecting to the db, every function will have this class as this
	 * @param expireAfter Amount of seconds after an entrie should invalidated and deleted
	 */
	constructor(seutUpFuncs: Array<Promise<Function>> = undefined, expireAfter: Number = 36000) {
		if (typeof seutUpFuncs != 'undefined') this.setUpFuncs.concat(seutUpFuncs);
		this.expireAfter = expireAfter;
		this.dbConnectionSetUp();
	}
	/**
	 * Adds an object to the database
	 * @param target The entity class that should be used to add the object to
	 * @param entity the object itself to add to the database, should be an instance of target
	 * @param options Should be an Object of type SaveOptions but can be null/undefined
	 * @returns
	 */
	public async addToCache(target: EntityTarget<any>, entity: any, options?: SaveOptions): Promise<any> {
		try {
			const res = await (await this.get_repo(target)).save(entity, options);
			return res;
		} catch (error) {
			return error;
		}
	}
	private async removeFromCache(target: Repository<any>, id: Number): Promise<any> {
		try {
			await target.remove(id);
		} catch (error) {
			throw error;
		}
	}
	/**
	 * Wether an object e.g search result is in the database or not and if it is expired it gets deleted
	 * @param target The entity class that should be used to check wether it is in the db or not
	 * @param filter Filter options e.g. video id
	 * @param options should be an object of typ FindOneOptions<any>
	 * @returns The db entry in question or returns false
	 */
	public async isInCache(target: EntityTarget<any>, filter: any, options?: FindOneOptions<any>): Promise<any> {
		const repo = await this.get_repo(target);
		const answer = await repo.findOne(filter, options);
		if (answer) {
			if (answer.lastloaded) {
				if (new Date().getTime() - answer.lastloaded.getTime() < this.expireAfter) {
					return answer.cache;
				} else {
					this.removeFromCache(repo, answer.id);
					return false;
				}
			}
		}
		return false;
	}
	/**
	 * A shortcut to directly find an entity by a given filter
	 * @param entity An Entity class
	 * @param filter an filter object e.g. { query: "ltt"}
	 * @returns Respository<Entity> or any error thrown by typorm
	 */
	async findOne(entity: EntityTarget<any>, filter: any) {
		const conn = await this.get_repo(entity);
		try {
			return conn.findOne(filter);
		} catch (error) {
			return error;
		}
	}
	/**
	 * A shortcut to directly remove an entity by a given filter
	 * @param entity An Entity class
	 * @param filter an filter object e.g. { query: "ltt"}
	 * @returns nothing or any error thrown by typeorm
	 */
	async remove(entity: EntityTarget<any>, filterOrId: Record<string, any> | number): Promise<void> {
		if (typeof filterOrId == 'number') {
			return this.removeFromCache(await this.get_repo(entity), filterOrId);
		} else {
			const res = await this.findOne(entity, filterOrId);
			return this.removeFromCache(res, res.id);
		}
	}

	private async dbConnectionSetUp() {
		try {
			this.connection = getConnection();
		} catch (error) {
			this.connection = createConnection();
		}
		await (await this.connection).synchronize();
	}
	private async get_repo(entity: EntityTarget<any>): Promise<Repository<any>> {
		const conn = await this.connection;
		return conn.manager.getRepository(entity);
	}
	private async runSetUpFuncs() {
		for await (const func of this.setUpFuncs) {
			func.call(this);
		}
	}
}
