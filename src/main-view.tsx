import * as React from 'react';
import { action } from 'mobx';
import { observer } from "mobx-react-lite";

import * as Store from './store';

export const MainView: React.FC<{store: Store.Store}> = observer(({store}) => {
    return (
        <div>
            <ul>
                {
                    store.channels.map(channel => {
                        return (
                            <li key={channel.id}>
                                <ChannelBlock store={store} channel={channel} />
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );
});

export const ChannelBlock: React.FC<{store: Store.Store, channel: Store.Channel}> = observer(({store, channel}) => {
    return (
        <div>
            <div>
                <div style={{ fontWeight: 'bold' }}>{channel.name}</div>
            </div>

            <div>
                <ul>
                    {
                        channel.messages.map(msg => {
                            return (
                                <li key={msg.id}>
                                    <MessageBlock message={msg} />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>

            <div>
                <NewMessageBlock store={store} channel={channel} />
            </div>
        </div>
    );
});

export const NewMessageBlock: React.FC<{store: Store.Store, channel: Store.Channel}> = observer(({store, channel}) => {
    const [message, setMessage] = React.useState('');

    return (
        <div>
            <form onSubmit={e => {
                e.preventDefault();

                store.socket.send(JSON.stringify({action: 'messages/create', data: {channelId: channel.id, body: message}}));

                setMessage('');
            }}>
                <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.currentTarget.value)}
                />
                <button>send</button>
            </form>
        </div>
    );
});

export const MessageBlock: React.FC<{message: Store.Message}> = observer(({message}) => {
    // @todo format date
    return (
        <div style={{fontFamily: 'monospace'}}>
            <span>{message.createdAt}</span> <span>{message.body}</span>
        </div>
    );
});