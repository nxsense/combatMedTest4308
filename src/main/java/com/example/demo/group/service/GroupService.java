package com.example.demo.group.service;

import com.example.demo.group.dto.CreateGroupRequest;
import com.example.demo.group.entity.Group;
import com.example.demo.group.repository.GroupRepository;
import com.example.demo.instructor.entity.Instructor;
import com.example.demo.instructor.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final InstructorRepository instructorRepository;

    public Group createGroup(CreateGroupRequest request) {
        Group group = new Group();

        group.setName(request.name());
        group.setTrainingLevel(request.trainingLevel());
        group.setCreatedAt(LocalDateTime.now());

        if (request.instructorId() != null) {
            Instructor instructor = instructorRepository.findById(request.instructorId())
                    .orElseThrow(() -> new RuntimeException("Instructor not found"));

            group.setInstructor(instructor);
        }

        return groupRepository.save(group);
    }
}