package com.example.demo.group.service;

import com.example.demo.group.dto.CreateGroupRequest;
import com.example.demo.group.entity.Group;
import com.example.demo.group.repository.GroupRepository;
import com.example.demo.instructor.entity.Instructor;
import com.example.demo.instructor.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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

        if (request.instructorIds() != null && !request.instructorIds().isEmpty()) {
            Set<Instructor> instructors = new HashSet<>(
                    instructorRepository.findAllById(request.instructorIds())
            );

            group.setInstructors(instructors);
        }

        return groupRepository.save(group);
    }
}