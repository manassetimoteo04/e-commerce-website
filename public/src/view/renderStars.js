class RenderStar {
  constructor() {}
  _gettingProductStars(data) {
    const star_5 = data.data.comments
      .filter((rate) => rate.rating === 5)
      .reduce((acc, arr) => acc + 1, 0);
    const star_4 = data.data.comments
      .filter((rate) => rate.rating === 4)
      .reduce((acc, arr) => acc + 1, 0);
    const star_3 = data.data.comments
      .filter((rate) => rate.rating === 3)
      .reduce((acc, arr) => acc + 1, 0);
    const star_2 = data.data.comments
      .filter((rate) => rate.rating === 2)
      .reduce((acc, arr) => acc + 1, 0);

    const star_1 = data.data.comments
      .filter((rate) => rate.rating === 1)
      .reduce((acc, arr) => acc + 1, 0);
    const totalRating = star_1 + star_2 + star_3 + star_4 + star_5;
    console.log(totalRating);
    const returned = {
      star_1: { rate: star_1, stars: 1 },
      star_2: { rate: star_2, stars: 2 },
      star_3: { rate: star_3, stars: 3 },
      star_4: { rate: star_4, stars: 4 },
      star_5: { rate: star_5, stars: 5 },
      totalRating: totalRating,
    };

    return this._calculateAverageRating(returned);
  }
  _calculateAverageRating(ratingsCount) {
    let totalRatings = 0;
    let totalCount = 0;
    for (let i = 1; i <= 5; i++) {
      const ratingKey = `star_${i}`;
      totalRatings +=
        ratingsCount[ratingKey].rate * ratingsCount[ratingKey].stars;
      totalCount += ratingsCount[ratingKey].rate;
    }
    const avarage = Math.round((totalRatings / totalCount) * 2) / 2;
    return avarage;
  }
  _renderStars(s) {
    let star = "";
    for (let i = 1; i <= s; i++) {
      star += '<i data-feather="star"></i> ';
    }
    return star;
  }
}
const RENDER_STAR = new RenderStar();
export { RENDER_STAR };
