/* eslint-disable linebreak-style */
export const embedMap = new Map();

export const pushToEmbedMap = (embed, embedButtons, voteArray, userWhoVoted) => {
  const uniqueId = embed.data.timestamp;
  const embedContents = {
    content: embed,
    buttons: embedButtons,
    votes: voteArray,
    Users: userWhoVoted,
  };
  embedMap.set(uniqueId, embedContents);
};

export const getEmbedFromMap = (embedId) => embedMap.get(embedId);

