

const USER_ID_KEY = 'userId';
const USER_NAME_KEY = 'username';
const USER_TOKEN_KEY = 'userToken';

export class AuthService {
  

    getUserId() {
        const data = window.localStorage.getItem(USER_ID_KEY);
        return data;
      }

      setUserId(userId: string) {
        window.localStorage[USER_ID_KEY] = userId;
      }

    
      getUserDisplayName() {
        const data = window.localStorage.getItem(USER_NAME_KEY);
        return data;
      }
    
      setUserDisplayName(username: string) {
        window.localStorage[USER_NAME_KEY] = username;
      }


      getUserToken() {
        const storage = window.localStorage.getItem(USER_TOKEN_KEY);
        return storage;
      }
    
      setUserToken(userToken: string) {
        window.localStorage[USER_TOKEN_KEY] = userToken;
      }


      clearUser() {
        window.localStorage.removeItem(USER_ID_KEY );
        window.localStorage.removeItem(USER_NAME_KEY );
        window.localStorage.removeItem(USER_TOKEN_KEY );
     
      }

}