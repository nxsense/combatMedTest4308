package com.example.demo.group.controller;

import com.example.demo.group.dto.CreateGroupRequest;
import com.example.demo.group.entity.Group;
import com.example.demo.group.repository.GroupRepository;
import com.example.demo.group.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupRepository groupRepository;
    private final GroupService groupService;

    @GetMapping
    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    @PostMapping
    public Group createGroup(@Valid @RequestBody CreateGroupRequest request) {
        return groupService.createGroup(request);
    }
}