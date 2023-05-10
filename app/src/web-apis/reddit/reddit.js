import axios from 'axios';
import { chunkText } from '../../utils/text_chunker';
import { cleanText } from '../../utils/text_clean';

const redditApiBase = 'https://www.reddit.com';
const redditWorldNewsApi = 'https://www.reddit.com/r/worldnews/.json';

const getArticleComment = (permalink) => {
  return new Promise(resolve => {
    const fullCommentUrl = `${redditApiBase}${permalink}.json`;

    axios.get(fullCommentUrl)
      .then(res => {
        const comments = res?.data[1].data.children;
  
        if (comments.length) {
          resolve(chunkText(cleanText(comments[0].data.body)));
        } else {
          resolve("failed to get comment");
        }
      })
      .catch(err => {
        resolve('');
      });
  });
}

const processArticles = async (articlesData, finalArticles, resolver) => {
  if (articlesData.length) {
    const { title, num_comments, permalink } = articlesData[0];

    const articleCommentPair = {
      title: `${cleanText(title).substring(0, 18)}...`,
      comment: '',
    };

    if (num_comments > 0) {
      articleCommentPair.comment = await getArticleComment(permalink);
    }

    finalArticles.push(articleCommentPair);

    setTimeout(() => {
      articlesData.shift();
      processArticles(articlesData, finalArticles, resolver);
    }, 500); // artificial delay to avoid ddos
  } else {
    console.log('final', finalArticles);
    resolver(finalArticles);
  }
}

export const getWorldNews = async (limit = 5) => {
  return new Promise(resolve => {
    axios.get(redditWorldNewsApi)
      .then(res => {
        const articles = res?.data?.data?.children.slice(0, limit);
        const articlesData = []; // sucks plural plural
        const finalArticles = [];
  
        if (articles.length) {
          articles.forEach(async article => {
            const { title, num_comments, permalink } = article.data;
            articlesData.push({
              title,
              num_comments,
              permalink
            })
          });

          processArticles(articlesData, finalArticles, resolve);
        }
      })
      .catch(err => {
        resolve([]);
      });
  });
}
