import axios from "axios";

export const requestGithubToken = async credentials => {
  const { data } = await axios({
    method: "POST",
    url: process.env.GITHUB_OAUTH_LOGIN,
    data: credentials,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return data;
};

export const requestGithubUserToken = async token => {
  const { data } = await axios({
    method: "get",
    url: `https://api.github.com/user?access_token=${token}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

/**
 *
 * @param {*} credentials
 * @param {credentials.client_id} string
 * @param {credentials.client_secret} string
 * @returns
 */
export const authorizeWithGithub = async credentials => {
  const { access_token } = await requestGithubToken(credentials);
  const githubUser = await requestGithubUserToken(access_token);

  return {
    ...githubUser,
    access_token,
  };
};
