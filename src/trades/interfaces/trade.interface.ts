import { Document } from 'mongoose';

export interface Trade extends Document {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}
