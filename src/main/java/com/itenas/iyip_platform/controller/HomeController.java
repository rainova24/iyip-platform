package com.itenas.iyip_platform.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {
    @RequestMapping("/")
    public String index() {
        return "index.html";
    }

//    @GetMapping("/")
//
//
//    @ResponseBody
//    public String home() {
//        return "<html><body><h1>Welcome to IYIP Platform API</h1>" +
//               "<p>This is a REST API. Please use appropriate API client to access the endpoints.</p>" +
//               "<p>Available public endpoints:</p>" +
//               "<ul>" +
//               "<li>/api/auth/login</li>" +
//               "<li>/api/auth/register</li>" +
//               "</ul></body></html>";
//    }
}