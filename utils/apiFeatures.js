class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Build Query with FILTERING
    const queryObj = { ...this.queryString };
    const exclFields = ['page', 'sort', 'limit', 'fields'];
    exclFields.forEach((el) => delete queryObj[el]);
    // Adv FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // SORTING
    if (this.queryString.sort) {
      // to split variables to sort by (ex: 'price ratingsAvg')
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // default
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // FIELD LIMITING
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // PAGINATION
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // skip(skip n results) limit(display n results/page)
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIfeatures;
