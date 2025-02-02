import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import mongoose, { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private userService: UserService,
  ) {}

  getAllTasks(): Promise<Task[]> {
    return this.taskModel.find({}).populate('assignTo');
  }

  async getTaskById(taskId: string): Promise<Task> {
    const isValidId = mongoose.Types.ObjectId.isValid(taskId);
    if (!isValidId) throw new HttpException('Task not found', 404);

    const foundTask = await this.taskModel.findById(taskId);
    if (!foundTask) throw new HttpException('Task not found', 404);

    return foundTask;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const assignToEmail = createTaskDto.assignTo;
    delete createTaskDto.assignTo;
    const newTask = new this.taskModel(createTaskDto);

    if (assignToEmail) {
      const foundUser = await this.userService.getUserByEmail(assignToEmail);
      if (!foundUser) {
        throw new HttpException('AssignTo email not found', 404);
      }
      newTask.assignTo = foundUser;
    }

    return newTask.save();
  }

  async updateTaskById(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const assignToEmail = updateTaskDto.assignTo;
    delete updateTaskDto.assignTo;
    await this.getTaskById(taskId);

    if (assignToEmail) {
      const foundUser = await this.userService.getUserByEmail(assignToEmail);
      if (!foundUser) {
        throw new HttpException('AssignTo email not found', 404);
      }
      return this.taskModel.findByIdAndUpdate(
        taskId,
        { ...updateTaskDto, assignTo: foundUser },
        { new: true },
      );
    }

    return this.taskModel.findByIdAndUpdate(taskId, updateTaskDto, {
      new: true,
    });
  }

  async deleteTaskById(taskId: string): Promise<mongoose.mongo.DeleteResult> {
    await this.getTaskById(taskId);
    return this.taskModel.deleteOne({ _id: taskId });
  }
}
