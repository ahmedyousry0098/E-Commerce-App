
export class ApiFeatures {
    constructor (public mongooseQuery: any, public queryData: any) {
        this.mongooseQuery = mongooseQuery
        this.queryData = queryData
    }

    paginate () {
        let {limit, page}: {limit?: number, page?: number} = this.queryData
        if (!limit || limit <= 0) limit = 3
        if (!page || page <= 0) page = 1
        const skip = ((page - 1) * Math.trunc(limit))
        this.mongooseQuery.limit(Math.trunc(limit)).skip(skip)
        return this
    }

    filter () {
        const execludedKeys = ['page', 'limit', 'sort', 'search']
        const filteredQuery = {...this.queryData}
        execludedKeys.forEach(key => {
            delete filteredQuery[key]
        })
        this.mongooseQuery.find(
            JSON.parse(
                JSON.stringify(filteredQuery).replace(/\b(gt|gte|lt|lte|eq|neq|in|nin)\b/g, match => `$${match}`)
            )
        )
        return this
    }

    sort () {
        if (this.queryData.sort) {
            this.mongooseQuery.sort(this.queryData.sort.split(",").join(" "))
        }
        return this
    }

    search () {
        if (this.queryData.search) {
            this.mongooseQuery.find({
                $or: [
                    {name: {$regex: this.queryData.search, Options: 'i'}},
                    {description: {$regex: this.queryData.search, options: 'i'}}
                ]
            })
        }
    }

}
