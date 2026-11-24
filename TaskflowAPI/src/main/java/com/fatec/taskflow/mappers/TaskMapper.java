package com.fatec.taskflow.mappers;

import com.fatec.taskflow.dtos.TaskRequest;
import com.fatec.taskflow.dtos.TaskResponse;
import com.fatec.taskflow.entities.Task;

public class TaskMapper {

    public static Task toEntity(TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setAssignee(request.assignee());
        task.setStatus(request.status());
        task.setPriority(request.priority());

        return task;
    }

    public static TaskResponse toDTO(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getAssignee(),
                task.getStatus(),
                task.getPriority());
    }
}
