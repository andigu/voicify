import SpotifyApi from 'spotify-web-api-js';

export const Spotify = new SpotifyApi();

/**
 * Pure function that checks if token is valid
 * @param accessToken
 * @returns {Promise.<TResult>}
 */
export function isValid(accessToken): Promise<?any> {
    const oldToken = Spotify.getAccessToken();
    Spotify.setAccessToken(accessToken);
    return Spotify.getMe().then(() => {
        return true;
    }, () => {
        return false;
    }).then((x) => {
        Spotify.setAccessToken(oldToken);
        return x;
    })
}

export function isExpired(res) {
    return JSON.parse(res.response).error.message === 'The access token expired';
}

export function isInvalid(res) {
    return JSON.parse(res.response).error.message === 'Invalid access token';
}
