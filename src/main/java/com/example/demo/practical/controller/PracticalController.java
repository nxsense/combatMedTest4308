package com.example.demo.practical.controller;

import com.example.demo.practical.dto.CreatePracticalSkillRequest;
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

    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @PostMapping("/skills")
    public void createSkill(@RequestBody CreatePracticalSkillRequest request) {
        practicalService.createSkill(request);
    }

    @PostMapping("/results")
    public void submit(@RequestBody SubmitPracticalResultRequest request) {
        practicalService.submit(request);
    }
    @GetMapping("/skills")
    public List<PracticalSkill> getAllSkills() {
        return practicalService.getAllSkills();
    }

    @GetMapping("/skills/{id}")
    public PracticalSkill getSkillById(@PathVariable Long id) {
        return practicalService.getSkillById(id);
    }

    @GetMapping("/results")
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