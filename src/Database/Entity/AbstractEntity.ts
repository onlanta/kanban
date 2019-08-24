export abstract class AbstractEntity {

    public getPlain(fields?: string[]) {
        const result: any = {}
        if (fields) {
            for (const key of fields) {
                result[key] = (this as any)[key]
            }
        } else {
            for (const key of Object.keys(this)) {
                result[key] = (this as any)[key]
            }
        }

        return result
    }

}
