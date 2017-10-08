import React, {Component} from "react";
import {connect} from 'react-redux';
import querystring from "query-string"
@connect((state) => state)
export class SpotifySuccess extends Component {
    constructor(props) {
        super(props);
        console.log(querystring.parse(this.props.router.location.search));
    }

    render() {
        return <div>
            <p>Hello</p>
        </div>
    }
}
