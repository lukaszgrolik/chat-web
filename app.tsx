import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Link, NavLink, Route, Switch } from 'react-router-dom';
import { action } from 'mobx';

import { ApiData } from './src/shared/interfaces';
import { MainView } from './src/main-view';
import * as Store from './src/store';
import { upsert } from './src/lib/upsert';

const socket = new WebSocket('ws://localhost:3031');
const store = new Store.Store({socket});

// Connection opened
socket.addEventListener('open', e => {
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', e => {
    console.log('Message from server ', e.data);

    const data: ApiData.Response.Data = JSON.parse(e.data).data;

    action(() => {
        // store.channels.push(...data.channels.map(channel => new Store.Channel(store, channel)));
        upsert(store.channels, data.channels, {
            find: (a, b) => a.id === b.id,
            mapInsert: body => new Store.Channel(store, body),
            onUpdate: (found, body) => found.update(body),
        });

        // store.messages.push(...data.messages.map(message => new Store.Message(store, message)));
        upsert(store.messages, data.messages, {
            find: (a, b) => a.id === b.id,
            mapInsert: body => new Store.Message(store, body),
            onUpdate: (found, body) => found.update(body),
        });
    })();
});

const app = (
    <BrowserRouter>
        {/* <ul>
            <NavLink activeStyle={{ fontWeight: 'bold' }} exact to="/">Home</NavLink>
            <NavLink activeStyle={{ fontWeight: 'bold' }} to="/projects">Projects</NavLink>
            <NavLink activeStyle={{ fontWeight: 'bold' }} to="/legacy">Legacy</NavLink>
        </ul>

        <Switch>
            <Route path="/" exact={true}>
                <p>home</p>
            </Route>

            <Route path="/projects">
                <MainView store={store} />
            </Route>

            <Route path="/legacy">
                <LegacyView />
            </Route>
        </Switch> */}
        <MainView store={store} />
    </BrowserRouter>
);

ReactDOM.render(app, document.getElementById('react-root'));