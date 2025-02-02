import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export enum Progress {
  todo = 'todo',
  inProgress = 'inProgress',
  completed = 'completed',
}

export enum Priority {
  high = 'high',
  medium = 'medium',
  low = 'low',
}

export enum Type {
  personal = 'personal',
  work = 'work',
  other = 'other',
}

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  assignTo: User;

  @Prop({ type: String, enum: Progress, default: Progress.todo })
  progress: Progress;

  @Prop({ type: String, enum: Priority, default: Priority.low })
  priority: Progress;

  @Prop({ type: String, enum: Type, default: Type.personal })
  type: Type;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
