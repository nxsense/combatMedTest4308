package com.example.demo.practical.controller;

import com.example.demo.practical.dto.CreatePracticalSkillRequest;
import com.example.demo.practical.dto.PracticalSkillResponse;
import com.example.demo.practical.dto.SubmitPracticalResultRequest;
import com.example.demo.practical.dto.WeakLabelResponse;
import com.example.demo.practical.entity.PracticalResult;
import com.example.demo.practical.entity.PracticalSkill;
import com.example.demo.practical.service.PracticalService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/practical")
@RequiredArgsConstructor
public class PracticalController {

    private final PracticalService practicalService;

    @GetMapping("/skills")
    public List<PracticalSkillResponse> getAllSkills() {
        return practicalService.getAllSkills();
    }

    @GetMapping("/skills/{id}")
    public PracticalSkillResponse getSkillById(@PathVariable Long id) {
        return practicalService.getSkillById(id);
    }

    @PostMapping("/skills")
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR', 'ADMIN')")
    public PracticalSkillResponse createSkill(@RequestBody CreatePracticalSkillRequest request) {
        return practicalService.createSkill(request);
    }

    @PostMapping("/results")
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR', 'ADMIN')")
    public void submitResult(@RequestBody SubmitPracticalResultRequest request) {
        practicalService.submit(request);
    }
    @GetMapping("/results")
    @PreAuthorize("hasAnyAuthority('INSTRUCTOR', 'ADMIN')")
    public List<PracticalResult> getAllResults() {
        return practicalService.getAllResults();
    }


    @GetMapping("/results/cadet/{cadetId}")
    public List<PracticalResult> getResultsByCadet(@PathVariable Long cadetId) {
        return practicalService.getResultsByCadet(cadetId);
    }


    @GetMapping("/analytics/labels/{cadetId}")
    public List<WeakLabelResponse> weakLabels(@PathVariable Long cadetId) {
        return practicalService.getWeakLabels(cadetId);
    }
}