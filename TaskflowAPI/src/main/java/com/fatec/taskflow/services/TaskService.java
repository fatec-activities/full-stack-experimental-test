package com.fatec.taskflow.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.fatec.taskflow.dtos.TaskRequest;
import com.fatec.taskflow.dtos.TaskResponse;
import com.fatec.taskflow.entities.Task;
import com.fatec.taskflow.mappers.TaskMapper;
import com.fatec.taskflow.repositories.TaskRepository;

@Service
public class TaskService {

    private static final List<String> VALID_STATUSES =
            List.of("PENDENTE", "EM_ANDAMENTO", "CONCLUIDA");

    private static final List<String> VALID_PRIORITIES =
            List.of("BAIXA", "MEDIA", "ALTA");

    private final TaskRepository repository;

    TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<TaskResponse> findAll(String status) {
        List<Task> tasks;

        if (status == null || status.isBlank()) {
            tasks = repository.findAll();
        } else {
            tasks = repository.findByStatus(normalizeStatus(status));
        }

        return tasks.stream()
                    .map(TaskMapper::toDTO)
                    .toList();
    }

    public TaskResponse findById(Long id) {
        Task task = repository.findById(id).orElse(null);

        if (task == null) {
            return null;
        }

        return TaskMapper.toDTO(task);
    }

    public TaskResponse save(TaskRequest request) {
        validate(request);

        Task task = TaskMapper.toEntity(request);
        task.setStatus(normalizeStatus(request.status()));
        task.setPriority(normalizePriority(request.priority()));

        return TaskMapper.toDTO(repository.save(task));
    }

    public TaskResponse update(Long id, TaskRequest request) {
        Task task = repository.findById(id).orElse(null);

        if (task == null) {
            return null;
        }

        validate(request);

        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setAssignee(request.assignee());
        task.setStatus(normalizeStatus(request.status()));
        task.setPriority(normalizePriority(request.priority()));

        return TaskMapper.toDTO(repository.save(task));
    }

    public TaskResponse updateStatus(Long id, String status) {
        Task task = repository.findById(id).orElse(null);

        if (task == null) {
            return null;
        }

        if (status == null || status.isBlank()) {
            throw badRequest("The status field is required");
        }

        task.setStatus(normalizeStatus(status));

        return TaskMapper.toDTO(repository.save(task));
    }

    public boolean deleteById(Long id) {
        if (!repository.existsById(id)) {
            return false;
        }

        repository.deleteById(id);
        return true;
    }

    private void validate(TaskRequest request) {
        if (request == null) {
            throw badRequest("Task data is required");
        }

        if (request.title() == null || request.title().isBlank()) {
            throw badRequest("The title field is required");
        }

        if (request.assignee() == null || request.assignee().isBlank()) {
            throw badRequest("The assignee field is required");
        }

        normalizeStatus(request.status());
        normalizePriority(request.priority());
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            return "PENDENTE";
        }

        String normalized = status.trim().toUpperCase();

        if (!VALID_STATUSES.contains(normalized)) {
            throw badRequest("Invalid status. Use PENDENTE, EM_ANDAMENTO or CONCLUIDA");
        }

        return normalized;
    }

    private String normalizePriority(String priority) {
        if (priority == null || priority.isBlank()) {
            return "MEDIA";
        }

        String normalized = priority.trim().toUpperCase();

        if (!VALID_PRIORITIES.contains(normalized)) {
            throw badRequest("Invalid priority. Use BAIXA, MEDIA or ALTA");
        }

        return normalized;
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
