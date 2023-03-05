import axios from 'axios';

const hnApiBase = 'https://hacker-news.firebaseio.com/v0'

const getTopArticleIds = () => {
  return new Promise((resolve, reject) => { // dumb promise wrapper
    axios.get(`${hnApiBase}/topstories.json`)
      .then(res => resolve(res.data.slice(0, 10)))
      .catch(err => reject(err));
  });
}

const getArticleComment = (commentId) => {
  axios.get(`${hnApiBase}/item/${commentId}.json`)
    .then(res => {
      console.log(res);
    })
    .catch(err => console.log(err));
}

const getArticleInfo = (articleIds, articleComments) => {

  axios.get(`${hnApiBase}/item/${articleId}.json`)
    .then(res => {
      console.log(res.kids[0]);
    })
    .catch(err => console.log(err));
}

export const getHnTopArticleComments = async () => {
  
  // const articleIds = await getTopArticleIds();
  // const articleData = {}; // for recursion
  // getArticleInfo()
  // console.log(articleIds);
}
