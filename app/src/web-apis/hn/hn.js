import axios from 'axios';
import { chunkText } from '../../utils/text_chunker';
import { cleanText } from '../../utils/text_clean';

const hnApiBase = 'https://hacker-news.firebaseio.com/v0'

const getTopArticleIds = (limit) => {
  return new Promise((resolve, reject) => { // dumb promise wrapper
    setTimeout(() => {
      axios.get(`${hnApiBase}/topstories.json`)
        .then(res => resolve(res.data.slice(0, limit)))
        .catch(err => reject(err));
    }, 250);
  });
}

const getArticleTopCommentId = (articleId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.get(`${hnApiBase}/item/${articleId}.json`)
        .then(res => {
          resolve({
            title: res.data.title,
            topCommentId: res.data?.kids
              ? res.data.kids[0]
              : null
          });
        })
        .catch(err => reject(err));
      }, 250);
  });
}

const getArticleTopComment = (kidId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.get(`${hnApiBase}/item/${kidId}.json`)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => reject(err));
    }, 250); // add delays to avoid hammering HN api
  });
}

// recursive function
const getHnArticleData = async (articleIds, articleData, promiseResolver) => {
  if (articleIds.length) {
    const articleId = articleIds[0];
    
    console.log(`processing article ${articleId}`);
    const articleTopCommentInfo = await getArticleTopCommentId(articleId);

    const articleTopComment = articleTopCommentInfo.topCommentId
      ? await getArticleTopComment(articleTopCommentInfo.topCommentId)
      : {
        text: ['no comments yet'],
      };

    articleData[articleId] = {
      title: `${cleanText(articleTopCommentInfo.title).substring(0, 16)} ...`, 
      comment: chunkText(cleanText(articleTopComment.text)),
    };

    articleIds.shift();
    getHnArticleData(articleIds, articleData, promiseResolver);
  } else {
    promiseResolver(true);
  }
}

const processHnQueue = async (articleIds, articleData) => {
  return new Promise(resolve => {
    getHnArticleData(articleIds, articleData, resolve);
  });
}

export const getHnTopArticleComments = async (limit = 5) => {
  return new Promise(async (resolve, reject) => {
    try {
      const articleIds = await getTopArticleIds(limit);
      const articleData = {};
      await processHnQueue(articleIds, articleData);
      console.log(articleData);
      resolve(articleData);
    } catch (error) {
      reject(error)
    }
  });
}
