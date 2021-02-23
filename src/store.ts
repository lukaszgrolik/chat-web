import { action, computed, makeObservable, observable } from 'mobx';

export class Store {
    readonly socket: WebSocket;

    readonly channels: Channel[] = [];
    readonly messages: Message[] = [];

    constructor(opts: {socket: WebSocket}) {
        this.socket = opts.socket;

        makeObservable(this, {
            channels: observable,
            messages: observable,
        });
    }
}

export class Channel {
    readonly id: number;
    name: string;

    constructor(readonly store: Store, body: {id: number; name: string}) {
        this.id = body.id;
        this.name = body.name;

        makeObservable(this, {
            update: action,
            name: observable,
            messages: computed,
        });
    }

    update(body: {name?: string}) {
        if (body.name !== undefined) this.name = body.name;
    }

    get messages(): Message[] {
        return this.store.messages.filter(msg => msg.channelId === this.id);
    }
}

export class Message {
    readonly id: number;
    readonly channelId: number;
    readonly createdAt: string;
    body: string;

    constructor(readonly store: Store, body: {id: number; channelId: number; createdAt: string; body: string}) {
        this.id = body.id;
        this.channelId = body.channelId;
        this.createdAt = body.createdAt;
        this.body = body.body;

        makeObservable(this, {
            update: action,
            body: observable,
            channel: computed,
        });
    }

    update(body: {body?: string}) {
        if (body.body !== undefined) this.body = body.body;
    }

    get channel(): Channel | undefined {
        return this.store.channels.find(channel => channel.id === this.channelId);
    }
}