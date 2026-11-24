package com.fatec.taskflow.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fatec.taskflow.dtos.TaskRequest;
import com.fatec.taskflow.dtos.TaskResponse;
import com.fatec.taskflow.dtos.TaskStatusRequest;
import com.fatec.taskflow.services.TaskService;

@RestController
@RequestMapping("/api/tarefas")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    // GET /api/tarefas
    @GetMapping
    public List<TaskResponse> getAllTasks(@RequestParam(required = false) String status) {
        return service.findAll(status);
    }

    // GET /api/tarefas/{id}
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        TaskResponse task = service.findById(id);

        if (task != null) {
            return ResponseEntity.ok(task);
        }

        return ResponseEntity.notFound().build();
    }

    // POST /api/tarefas
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody TaskRequest task) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(task));
    }

    // PUT /api/tarefas/{id}
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id, @RequestBody TaskRequest task) {
        TaskResponse updatedTask = service.update(id, task);

        if (updatedTask == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedTask);
    }

    // PATCH /api/tarefas/{id}/status
    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(@PathVariable Long id,
                                                         @RequestBody TaskStatusRequest status) {
        String newStatus = status != null ? status.status() : null;
        TaskResponse updatedTask = service.updateStatus(id, newStatus);

        if (updatedTask == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedTask);
    }

    // DELETE /api/tarefas/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaskById(@PathVariable Long id) {
        if (!service.deleteById(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
