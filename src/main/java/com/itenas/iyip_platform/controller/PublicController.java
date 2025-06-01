package com.itenas.iyip_platform.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/api/public")
public class PublicController {

    @GetMapping("/welcome")
    @ResponseBody
    public String welcome() {
        return "Welcome to IYIP Platform API!";
    }
}