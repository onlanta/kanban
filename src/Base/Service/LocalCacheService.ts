import { Application } from '../../Application'

export class LocalCacheService {
    protected storage: { [key: string]: any } = {}

    public constructor(protected app: Application) { }

    public async get(key: string, defaultValue?: (() => Promise<any>)|any, useCache = true, lifetime = 5) {
        if (useCache && this.storage[key]) {
            if (this.storage[key].till && this.storage[key].till < Math.floor(Date.now() / 1000)) {
                delete this.storage[key]
            } else {
                return this.storage[key].value
            }
        }

        this.storage[key] = {
            value: typeof defaultValue === 'function' ? await defaultValue() : defaultValue,
            till: Math.floor(Date.now() / 1000) + lifetime,
        }

        return this.storage[key].value
    }

    public async set(key: string, value: any, lifetime = 0) {
        this.storage[key] = {
            value,
            till: lifetime ? Math.floor(Date.now() / 1000) + lifetime : undefined,
        }
    }

}
