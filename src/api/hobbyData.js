import { clientCredentials } from '@/utils/client';

const endpoint = clientCredentials.databaseURL;

const getHobby = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/hobby/user/?orderBy="uid"&equalTo="${uid}.json"`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

const getEveryHobby = () =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/hobby.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

const getSingleHobby = async (id) => {
  const del = await fetch(`${endpoint}/hobby/${id}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const response = del.json();
  return response;
};

export { getHobby, getSingleHobby, getEveryHobby };
