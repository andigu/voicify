import React from 'react';

const row = {flexDirection: "row", display: "flex"};
export const About = () => <div><p>This project was inspired by my adventures in coding. As any programmer will know,
    any small distraction when you're deep in the 'zone', it can ruin your productivity for a full 10 minutes.
    Changing my music was one of these distractions. Alt-tabbing to spotify, changing a song, and alt-tabbing back
    has probably caused 90% of the bugs in all of my code. So I created this app, where you can change the song
    simply by using your voice. I hope you find it useful!
</p>
    <br/>
    <table>
        <tr>
            <th>Command</th>
            <th>Description</th>
        </tr>
        <tr>
            <td><code>Spotify play *name by *artist</code></td>
            <td>Plays the track with the name that is by the given artist</td>
        </tr>
        <tr>
            <td><code>Spotify play *name</code></td>
            <td>Plays the track with the name given</td>
        </tr>
        <tr>
            <td><code>Spotify pause</code></td>
            <td>Pauses music</td>
        </tr>
        <tr>
            <td><code>Spotify pause</code></td>
            <td>Pauses music</td>
        </tr>
        <tr>
            <td><code>Spotify resume</code></td>
            <td>Resumes music (if paused)</td>
        </tr>
        <tr>
            <td><code>Rewind</code></td>
            <td>Rewinds to previous song</td>
        </tr>
        <tr>
            <td><code>Fast forward</code></td>
            <td>Skips to next song</td>
        </tr>
    </table>
</div>;

// 'play *song by *artist'
// 'play *song'
// 'resume'
// 'pause'
// 'rewind'
// 'fast forward'
