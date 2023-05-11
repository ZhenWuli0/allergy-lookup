var common = {
  // env
  env: process.env.NODE_ENV,
  // base url
  base_url: 'http://localhost:5000',
  /**
   * Common method for checking empty objeect
   * @param {*} value
   * @returns
   */
  isEmpty: function (value) {
    return (
      value === '' || value == null || value === undefined || value === [] || value.length === 0
    )
  },
}
export default common
