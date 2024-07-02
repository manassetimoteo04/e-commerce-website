import { FIREBASE } from "../../model/firebase.js";

class MostSelled {
  constructor() {}
  _sortBySell(list) {
    const sorted = list.sort((a, b) => a.data.sales - b.data.sales);
    return this._filterMostSelled(sorted);
  }
  _filterMostSelled(sorted) {
    return sorted.length > 6 ? sorted.slice(-6) : sorted.slice(-3);
  }
}

const mostSelled = new MostSelled();
export { mostSelled };
