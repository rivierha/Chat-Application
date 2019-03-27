import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;

export interface Msg {
    content: string, name: string, type: string, time: Timestamp, msgTime: Date; date: string
}