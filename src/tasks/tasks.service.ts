import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import mongoose, { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = new this.taskModel(createTaskDto);
    return newTask.save();
  }

  async getTaskById(taskId: string): Promise<Task> {
    const isValidId = mongoose.Types.ObjectId.isValid(taskId);
    if (!isValidId) throw new HttpException('Task not found', 404);
    const foundTask = await this.taskModel.findById(taskId);
    if (!foundTask) throw new HttpException('Task not found', 404);
    return foundTask;
  }

  getAllTasks(): Promise<Task[]> {
    return this.taskModel.find({});
  }
}
