package com.example.demo.cadet.service;

import com.example.demo.cadet.dto.CreateCadetRequest;
import com.example.demo.cadet.entity.Cadet;
import com.example.demo.cadet.repository.CadetRepository;
import com.example.demo.group.entity.Group;
import com.example.demo.group.repository.GroupRepository;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CadetService {

    private final CadetRepository cadetRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;

    public Cadet createCadet(CreateCadetRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cadet cadet = new Cadet();
        cadet.setUser(user);
        cadet.setFirstName(request.firstName());
        cadet.setLastName(request.lastName());
        cadet.setRank(request.rank());
        cadet.setServiceNumber(request.serviceNumber());
        cadet.setCreatedAt(LocalDateTime.now());

        if (request.groupId() != null) {
            Group group = groupRepository.findById(request.groupId())
                    .orElseThrow(() -> new RuntimeException("Group not found"));
            cadet.setGroup(group);
        }

        return cadetRepository.save(cadet);
    }
}