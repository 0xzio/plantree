import { io, Socket } from 'socket.io-client'
import {
  addMessageToStore,
  getMessagesStateById,
  IGroupMessage,
  IGroupStatus,
  IMessage,
  initFailStoreById,
  MessageStatus,
} from './useMessages'

export const SUCCESS = 1
export const FAIL = 0

export enum ConnectStatusType {
  disconnect = 1,
  requesting = 2,
  error = 3,
  connected = 8,
}

export interface ConnectStatus {
  type: ConnectStatusType
  msg: string
}

interface IResult {
  code: 0 | 1
  message: string
  data?: any
}

export class SocketConnector {
  private socket!: Socket
  private connectStatus = {
    type: ConnectStatusType.disconnect,
    msg: 'not init',
  }
  private static instance: SocketConnector
  private chatSendMsgUpdateIdMap: Map<string, ''> = new Map()

  public getChatSendMsgUpdateIdMap() {
    return this.chatSendMsgUpdateIdMap
  }

  constructor(token: string, channels: string[]) {
    const baseUrl = process.env.NEXT_PUBLIC_SOCKETURL!
    console.log('=====baseUrl:', baseUrl, 'token:', token)

    this.socket = io(baseUrl, {
      auth: {
        token,
      },
      /**
       * force use WebSocket; control polling event sending frequency
       *  */
      transports: ['websocket'],
      reconnectionAttempts: 360,
      reconnectionDelay: 5000,
    })

    this.socket.on('connect', () => {
      console.log(
        '%c=WebSocket connection established',
        'color:cyan',
        process.env.NEXT_PUBLIC_SOCKETURL,
      )
      this.connectStatus = { type: ConnectStatusType.connected, msg: 'ok' }
      this.setupListeners()
      channels.length && this.joinChannels(channels)
    })

    this.socket.on('disconnect', (reason) => {
      console.log(
        '%c=WebSocket connection disconnected,reason:',
        'color:cyan',
        reason,
      )
      this.connectStatus = { type: ConnectStatusType.disconnect, msg: reason }
    })

    this.socket.on('connect_error', (error) => {
      console.log('%c=WebSocket connection error', 'color:cyan', error)
      this.connectStatus = {
        type: ConnectStatusType.error,
        msg: error.toString(),
      }
    })

    if (!SocketConnector.instance) {
      SocketConnector.instance = this
    }
  }

  static getInstance(): SocketConnector {
    return SocketConnector.instance
  }

  private setupListeners() {
    /*
    this.socket.on('private-msg', (data: {
      from: string,
      type: MessageType,
      data: any,
    }) => {
      switch (data.type) {
        case MessageType.DATA_TO_WEB:

          break
        default:
          break;
      }
    });
    */

    this.socket.on('channel-msg', (data: IMessage) => {
      addMessageToStore(data.channelId, data)
    })
  }

  public joinChannels(channels: string[]) {
    this.socket.emit('join-channel', { channels }, (response: IResult) => {
      if (response.code === FAIL) {
        console.error('joinChannels', response)
        initFailStoreById(response.data)
      }
    })
  }

  public leaveChannels(channels: string[]) {
    this.socket.emit('leave-channel', { channels })
  }

  public getConnectionStatus(): ConnectStatus {
    return this.connectStatus
  }

  public async sendChannelMessage(
    groupMessage: IGroupMessage,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.socket) {
        if (this.connectStatus.type === ConnectStatusType.connected) {
          const msgStatus =
            getMessagesStateById(groupMessage.channelId)?.status ===
            IGroupStatus.OK
              ? MessageStatus.Sending
              : MessageStatus.Fail
          this.addMessageToStoreWithStatus(groupMessage, msgStatus)
          this.chatSendMsgUpdateIdMap.set(groupMessage.updateId, '')
          this.socket.emit(
            'channel-message',
            groupMessage,
            (response: IResult) => {
              if (response.code === 1) {
                resolve(true)
              } else {
                resolve(false)
              }
            },
          )
        } else {
          this.addMessageToStoreWithStatus(groupMessage, MessageStatus.Fail)
          resolve(false)
        }
      } else {
        console.error('Socket not initialized')
        resolve(false)
      }
    })
  }

  private addMessageToStoreWithStatus(
    groupMessage: IGroupMessage,
    status: MessageStatus,
  ): void {
    const time = new Date()
    addMessageToStore(groupMessage.channelId, {
      id: groupMessage.updateId,
      status: status,
      direction: 0,
      userId: groupMessage.uid,
      toId: groupMessage.channelId,
      contentType: groupMessage.contentType,
      content: groupMessage.content,
      siteId: groupMessage.siteId,
      channelId: groupMessage.channelId,
      createdAt: time,
      updatedAt: time,
      user: groupMessage.user,
    })
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.connectStatus = {
        type: ConnectStatusType.disconnect,
        msg: 'Manually disconnected',
      }
    }
  }

  public hasChatSendMsgUpdateId(key: string): boolean {
    return this.chatSendMsgUpdateIdMap.has(key)
  }

  public removeChatSendMsgUpdateId(key: string): boolean {
    return this.chatSendMsgUpdateIdMap.delete(key)
  }
}
